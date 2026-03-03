export type ModelTier = "fast" | "balanced"

export type PolicyStrategy =
    | "threshold"
    | "costAware"
    | "retrievalWeighted"

export type SystemInput = {
    message: string
    complexity: number
    retrievalEnabled: boolean
    budgetLimit?: number
}

export type ExecutionMetadata = {
    selectedModel: ModelTier
    estimatedCost: number
    tokensUsed: number
    retrievalUsed: boolean
    reasoning: string[]
    constraintOutcome?: "unchanged" | "downgraded" | "violated"
    originalModel?: ModelTier
    finalModel?: ModelTier
    budgetLimit?: number
    costPressureRatio?: number
    budgetGap?: number
}

export type SystemResult = {
    response: string
    prompt: string
    metadata: ExecutionMetadata
}
