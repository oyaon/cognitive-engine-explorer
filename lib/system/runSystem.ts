import { SystemInput, SystemResult } from "./types"
import { routeModel } from "./routeModel"
import { calculateCost } from "./calculateCost"
import { assemblePrompt } from "./assemblePrompt"

/**
 * Orchestration flow: routing -> prompt -> cost -> result.
 * @param input - System input.
 */
export function runSystem(input: SystemInput): SystemResult {
    // 0. Internal Guard: Ensure data integrity within domain layer
    if (!input.message || typeof input.complexity !== "number") {
        throw new Error("Domain validation failed: Invalid SystemInput structure")
    }

    // 1. Determine model
    const selectedModel = routeModel(input.complexity)

    // 2. Build prompt
    const prompt = assemblePrompt(input)

    // 3. Compute cost
    const { tokensUsed, estimatedCost } = calculateCost(selectedModel, input.message)

    // 4. Generate mock response
    const response = `Processed using ${selectedModel} model with retrieval ${input.retrievalEnabled ? "enabled" : "disabled"
        }.`

    // 5. Return structured result
    return {
        response,
        prompt,
        metadata: {
            selectedModel,
            estimatedCost,
            tokensUsed,
            retrievalUsed: input.retrievalEnabled
        }
    }
}
