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
    policyDecision: ModelTier
    projectedCost: number
    tokenEstimate: number
    retrievalUsed: boolean
    reasoning: string[]
    constraintState?: "compliant" | "degraded" | "breached"
    preConstraintModel?: ModelTier
    resolvedModel?: ModelTier
    budgetLimit?: number
    budgetStress?: number
    budgetDeficit?: number
}

export type SystemResult = {
    response: string
    prompt: string
    metadata: ExecutionMetadata
}
