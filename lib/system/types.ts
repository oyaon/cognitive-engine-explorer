export type ModelTier = "fast" | "balanced"

export type SystemInput = {
    message: string
    complexity: number
    retrievalEnabled: boolean
}

export type ExecutionMetadata = {
    selectedModel: ModelTier
    estimatedCost: number
    tokensUsed: number
    retrievalUsed: boolean
    reasoning: string[]
}

export type SystemResult = {
    response: string
    prompt: string
    metadata: ExecutionMetadata
}
