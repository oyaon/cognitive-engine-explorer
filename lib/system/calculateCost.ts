import { ModelTier } from "./types"

/**
 * Calculates deterministic cost and token usage.
 * @param model - Selected model tier.
 * @param message - User message string.
 */
export function calculateCost(model: ModelTier, message: string) {
    const tokensUsed = Math.max(0, Math.ceil(message.length / 4))
    const rate = model === "balanced" ? 0.000006 : 0.000002
    const estimatedCost = Number((tokensUsed * rate).toFixed(6))

    return {
        tokensUsed,
        estimatedCost
    }
}
