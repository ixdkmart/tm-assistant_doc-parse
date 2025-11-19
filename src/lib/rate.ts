import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../config.js";

const STATE = path.resolve(".budget.json");

export class DailyLimitError extends Error {
    constructor(
        public currentUsage: number,
        public limit: number,
        public resetTime: string
    ) {
        super(`Daily limit reached: ${currentUsage}/${limit} calls. Limit resets at ${resetTime}`);
        this.name = "DailyLimitError";
    }
}

export class MonthlyBudgetError extends Error {
    constructor(
        public currentUsage: number,
        public limit: number,
        public resetTime: string
    ) {
        super(`Monthly budget exceeded: $${currentUsage.toFixed(2)}/$${limit.toFixed(2)}. Budget resets at ${resetTime}`);
        this.name = "MonthlyBudgetError";
    }
}

async function readState() {
    try {
        const raw = await fs.readFile(STATE, "utf8");
        return JSON.parse(raw);
    } catch {
        const now = new Date();
        return {
            day: now.toISOString().slice(0, 10),
            minute: Math.floor(now.getTime() / 60000),
            callsToday: 0,
            callsThisMinute: 0,
            estUsdMonth: 0,
            month: now.toISOString().slice(0, 7),
        };
    }
}

async function writeState(s: any) {
    await fs.writeFile(STATE, JSON.stringify(s), "utf8");
}

/** approxTokens is a rough estimate for budgeting only */
export async function enforceRateAndBudget(opts: { approxTokens: number }): Promise<void> {
    const now = Date.now();
    const minuteNow = Math.floor(now / 60000);
    const dayNow = new Date().toISOString().slice(0, 10);
    const monthNow = new Date().toISOString().slice(0, 7);
    let s = await readState();
    
    // reset windows
    if (s.minute !== minuteNow) s.callsThisMinute = 0;
    if (s.day !== dayNow) s.callsToday = 0;
    if (s.month !== monthNow) {
        s.month = monthNow;
        s.estUsdMonth = 0;
    }
    
    // Handle per-minute rate limit: wait until next minute window
    if (s.callsThisMinute + 1 > config.maxCallsPerMinute) {
        const waitMs = (60 - ((now / 1000) % 60)) * 1000; // milliseconds until next minute
        console.log(`[rate] Per-minute rate limit reached (${s.callsThisMinute}/${config.maxCallsPerMinute}). Waiting ${Math.ceil(waitMs / 1000)}s until next minute window...`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
        // Re-check state after wait (counter will be reset for new minute)
        s = await readState();
        const newMinuteNow = Math.floor(Date.now() / 60000);
        if (s.minute !== newMinuteNow) {
            s.callsThisMinute = 0;
            s.minute = newMinuteNow;
        }
    }
    
    // Handle daily limit: throw error to stop process
    if (s.callsToday + 1 > config.maxCallsPerDay) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const resetTime = tomorrow.toISOString().slice(0, 19).replace('T', ' ');
        throw new DailyLimitError(s.callsToday, config.maxCallsPerDay, resetTime);
    }
    
    // Handle monthly budget: throw error to stop process
    const usd = (opts.approxTokens / 1000) * config.estCostPerKTokensUSD;
    if (s.estUsdMonth + usd > config.monthlyBudgetUSD) {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1, 1);
        nextMonth.setHours(0, 0, 0, 0);
        const resetTime = nextMonth.toISOString().slice(0, 19).replace('T', ' ');
        throw new MonthlyBudgetError(s.estUsdMonth + usd, config.monthlyBudgetUSD, resetTime);
    }
    
    // commit
    s.callsThisMinute += 1;
    s.callsToday += 1;
    s.estUsdMonth += usd;
    s.minute = minuteNow;
    s.day = dayNow;
    await writeState(s);
}

export function handleHardLimitError(error: DailyLimitError | MonthlyBudgetError): never {
    const border = "=".repeat(80);
    const separator = "-".repeat(80);
    
    console.error("\n");
    console.error(border);
    console.error("  " + " ".repeat(76) + "  ");
    
    if (error instanceof DailyLimitError) {
        console.error("  " + "HARD LIMIT REACHED: DAILY CALL LIMIT".padEnd(76) + "  ");
    } else {
        console.error("  " + "HARD LIMIT REACHED: MONTHLY BUDGET".padEnd(76) + "  ");
    }
    
    console.error("  " + " ".repeat(76) + "  ");
    console.error(separator);
    console.error("  " + " ".repeat(76) + "  ");
    
    if (error instanceof DailyLimitError) {
        console.error("  " + `Current Usage: ${error.currentUsage} calls`.padEnd(76) + "  ");
        console.error("  " + `Daily Limit:   ${error.limit} calls`.padEnd(76) + "  ");
    } else {
        console.error("  " + `Current Usage: $${error.currentUsage.toFixed(2)}`.padEnd(76) + "  ");
        console.error("  " + `Monthly Limit: $${error.limit.toFixed(2)}`.padEnd(76) + "  ");
    }
    
    console.error("  " + " ".repeat(76) + "  ");
    console.error(separator);
    console.error("  " + " ".repeat(76) + "  ");
    console.error("  " + `Limit resets at: ${error.resetTime}`.padEnd(76) + "  ");
    console.error("  " + " ".repeat(76) + "  ");
    console.error(separator);
    console.error("  " + " ".repeat(76) + "  ");
    console.error("  " + "PROCESS STOPPED".padEnd(76) + "  ");
    console.error("  " + " ".repeat(76) + "  ");
    console.error("  " + "Please retry after the limit resets.".padEnd(76) + "  ");
    console.error("  " + " ".repeat(76) + "  ");
    console.error(border);
    console.error("\n");
    
    process.exit(1);
}

