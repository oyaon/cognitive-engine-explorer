import { ModelTier } from "./types"

/**
 * Deterministic policy evaluator for model selection.
 * @param input - Evaluation criteria.
 */
export function evaluatePolicy(input: {
    complexity: number
    retrievalEnabled: boolean
    estimatedTokens: number
}): {
    selectedModel: ModelTier
    reasoning: string[]
} {
    let selectedModel: ModelTier = "fast"
    const reasoning: string[] = []

    // Rule 1: Complexity threshold
    if (input.complexity > 0.6) {
        selectedModel = "balanced"
        reasoning.push("Complexity exceeds threshold (0.6)")
    }

    // Rule 2: Retrieval depth
    if (input.retrievalEnabled) {
        reasoning.push("Retrieval enabled increases reasoning depth")
        if (input.complexity > 0.4) {
            selectedModel = "balanced"
        }
    }

    // Rule 3: Token volume awareness
    if (input.estimatedTokens > 2000) {
        selectedModel = "balanced"
        reasoning.push("High token estimate suggests balanced model")
    }

    // Final decision trace
    reasoning.push(`Final model selected: ${selectedModel}`)

    return {
        selectedModel,
        reasoning
    }
}
