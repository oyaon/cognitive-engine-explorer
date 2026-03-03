import { ModelTier } from "./types"

export type PolicyInput = {
    complexity: number
    retrievalEnabled: boolean
    estimatedTokens: number
}

/**
 * Standard threshold-based policy.
 */
export function evaluatePolicyThreshold(input: PolicyInput) {
    let selectedModel: ModelTier = "fast"
    const reasoning: string[] = []

    if (input.complexity > 0.6) {
        selectedModel = "balanced"
        reasoning.push("Complexity exceeds threshold (0.6)")
    }

    if (input.retrievalEnabled && input.complexity > 0.4) {
        selectedModel = "balanced"
        reasoning.push("Retrieval enabled + complexity > 0.4")
    }

    if (input.estimatedTokens > 2000) {
        selectedModel = "balanced"
        reasoning.push("High token estimate suggests balanced model")
    }

    reasoning.push(`Final model selected: ${selectedModel}`)

    return { policyDecision: selectedModel, reasoning }
}

/**
 * Cost-optimized policy. Prefers fast tier.
 */
export function evaluatePolicyCostAware(input: PolicyInput) {
    let selectedModel: ModelTier = "fast"
    const reasoning: string[] = ["Cost-aware policy prioritized"]

    if (input.complexity >= 0.8) {
        selectedModel = "balanced"
        reasoning.push("Critical complexity override (0.8)")
    } else if (input.estimatedTokens > 5000) {
        selectedModel = "balanced"
        reasoning.push("Extreme token volume override")
    }

    reasoning.push(`Final model selected: ${selectedModel}`)

    return { policyDecision: selectedModel, reasoning }
}

/**
 * Accuracy-optimized policy for retrieval.
 */
export function evaluatePolicyRetrievalWeighted(input: PolicyInput) {
    let selectedModel: ModelTier = "fast"
    const reasoning: string[] = ["Retrieval-weighted policy active"]

    if (input.retrievalEnabled) {
        selectedModel = "balanced"
        reasoning.push("Active retrieval requires balanced tier")
    } else if (input.complexity > 0.7) {
        selectedModel = "balanced"
        reasoning.push("High complexity fallback")
    }

    reasoning.push(`Final model selected: ${selectedModel}`)

    return { policyDecision: selectedModel, reasoning }
}
