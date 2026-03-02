import { SystemInput, SystemResult } from "./types"
import { evaluatePolicy } from "./policyEngine"
import { calculateCost } from "./calculateCost"
import { assemblePrompt } from "./assemblePrompt"

/**
 * Orchestration flow: policy -> prompt -> cost -> result.
 * @param input - System input.
 */
export function runSystem(input: SystemInput): SystemResult {
    // 0. Internal Guard: Ensure data integrity within domain layer
    if (!input.message || typeof input.complexity !== "number") {
        throw new Error("Domain validation failed: Invalid SystemInput structure")
    }

    // 1. Calculate token estimation for policy input
    const estimatedTokens = Math.max(0, Math.ceil(input.message.length / 4))

    // 2. Determine model via deterministic policy engine
    const { selectedModel, reasoning } = evaluatePolicy({
        complexity: input.complexity,
        retrievalEnabled: input.retrievalEnabled,
        estimatedTokens
    })

    // 3. Build prompt
    const prompt = assemblePrompt(input)

    // 4. Compute cost
    const { tokensUsed, estimatedCost } = calculateCost(selectedModel, input.message)

    // 5. Generate mock response
    const response = `Processed using ${selectedModel} model with retrieval ${input.retrievalEnabled ? "enabled" : "disabled"
        }.`

    // 6. Return structured result
    return {
        response,
        prompt,
        metadata: {
            selectedModel,
            estimatedCost,
            tokensUsed,
            retrievalUsed: input.retrievalEnabled,
            reasoning
        }
    }
}
