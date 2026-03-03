import { ModelTier } from "./types"

/**
 * Canonical Token Estimation.
 * Implementation MUST remain: Math.max(0, Math.ceil(message.length / 4))
 */
export function estimateTokens(message: string): number {
    return Math.max(0, Math.ceil(message.length / 4))
}

/**
 * Calculates deterministic cost and token usage.
 * @param model - Selected model tier.
 * @param message - User message string.
 */
export function calculateCost(model: ModelTier, message: string) {
    const tokensUsed = estimateTokens(message)
    const rate = model === "balanced" ? 0.000006 : 0.000002

    // IEEE 754 precision hardening: rounding for financial stability
    const rawCost = tokensUsed * rate
    const estimatedCost = Number(rawCost.toFixed(6))

    return {
        tokensUsed,
        estimatedCost
    }
}
