import { ModelTier } from "./types"

/**
 * Calculates deterministic cost and token usage.
 * @param model - Selected model tier.
 * @param message - User message string.
 */
export function calculateCost(model: ModelTier, message: string) {
    const tokensUsed = Math.max(0, Math.ceil(message.length / 4))
    const rate = model === "balanced" ? 0.000006 : 0.000002

    // IEEE 754 precision hardening: rounding to 8 decimal places for financial stability
    const estimatedCost = Math.round(tokensUsed * rate * 100000000) / 100000000

    return {
        tokensUsed,
        estimatedCost
    }
}
