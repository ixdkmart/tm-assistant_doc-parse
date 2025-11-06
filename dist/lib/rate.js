import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../config.js";
const STATE = path.resolve(".budget.json");
async function readState() {
    try {
        const raw = await fs.readFile(STATE, "utf8");
        return JSON.parse(raw);
    }
    catch {
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
async function writeState(s) {
    await fs.writeFile(STATE, JSON.stringify(s), "utf8");
}
/** approxTokens is a rough estimate for budgeting only */
export async function enforceRateAndBudget(opts) {
    const now = new Date();
    const minuteNow = Math.floor(now.getTime() / 60000);
    const dayNow = now.toISOString().slice(0, 10);
    const monthNow = now.toISOString().slice(0, 7);
    const s = await readState();
    // reset windows
    if (s.minute !== minuteNow)
        s.callsThisMinute = 0;
    if (s.day !== dayNow)
        s.callsToday = 0;
    if (s.month !== monthNow) {
        s.month = monthNow;
        s.estUsdMonth = 0;
    }
    // rate limits
    if (s.callsThisMinute + 1 > config.maxCallsPerMinute) {
        throw new Error(`Rate limited: >${config.maxCallsPerMinute}/min. Try again shortly.`);
    }
    if (s.callsToday + 1 > config.maxCallsPerDay) {
        throw new Error(`Daily limit reached: >${config.maxCallsPerDay}/day.`);
    }
    // budget estimate (coarse)
    const usd = (opts.approxTokens / 1000) * config.estCostPerKTokensUSD;
    if (s.estUsdMonth + usd > config.monthlyBudgetUSD) {
        throw new Error(`Monthly budget guard: est $${(s.estUsdMonth + usd).toFixed(2)} would exceed $${config.monthlyBudgetUSD}.`);
    }
    // commit
    s.callsThisMinute += 1;
    s.callsToday += 1;
    s.estUsdMonth += usd;
    s.minute = minuteNow;
    s.day = dayNow;
    await writeState(s);
}
//# sourceMappingURL=rate.js.map