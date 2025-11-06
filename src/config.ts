export const config = {
    model: process.env.LLM_MODEL ?? "gpt-4.1-mini",
    maxWorkers: Number(process.env.MAX_WORKERS ?? 4),
  
    // Budget/Rate Guardrails
    maxCallsPerMinute: Number(process.env.MAX_CALLS_PER_MINUTE ?? 30),
    maxCallsPerDay: Number(process.env.MAX_CALLS_PER_DAY ?? 3000),
    monthlyBudgetUSD: Number(process.env.MONTHLY_BUDGET_USD ?? 120),
  
    // Rough cost estimation for budget protection
    estCostPerKTokensUSD: Number(process.env.EST_COST_PER_KTOKENS ?? 0.0001),
};
  