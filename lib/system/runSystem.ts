import { SystemInput, SystemResult, PolicyStrategy } from "./types"
import {
    evaluatePolicyThreshold,
    evaluatePolicyCostAware,
    evaluatePolicyRetrievalWeighted
} from "./policyEngine"
import { calculateCost } from "./calculateCost"
import { assemblePrompt } from "./assemblePrompt"
import { enforceConstraint } from "./constraintEngine"

/**
 * Orchestration flow: policy -> prompt -> cost -> constraint -> result.
 * @param input - System input.
 * @param strategy - Optional policy strategy (defaults to threshold).
 */
export function runSystem(input: SystemInput, strategy: PolicyStrategy = "threshold"): SystemResult {
    // 0. Internal Guard: Ensure data integrity within domain layer
    if (!input.message || typeof input.complexity !== "number") {
        throw new Error("Domain validation failed: Invalid SystemInput structure")
    }

    // 1. Calculate token estimation for policy input
    const estimatedTokens = Math.max(0, Math.ceil(input.message.length / 4))

    // 2. Determine model via deterministic policy engine
    const policyInput = {
        complexity: input.complexity,
        retrievalEnabled: input.retrievalEnabled,
        estimatedTokens
    }

    let evaluation;
    switch (strategy) {
        case "costAware":
            evaluation = evaluatePolicyCostAware(policyInput);
            break;
        case "retrievalWeighted":
            evaluation = evaluatePolicyRetrievalWeighted(policyInput);
            break;
        case "threshold":
        default:
            evaluation = evaluatePolicyThreshold(policyInput);
            break;
    }

    const { selectedModel, reasoning: policyReasoning } = evaluation;

    // 3. Build prompt
    const prompt = assemblePrompt(input)

    // 4. Compute cost
    let { tokensUsed, estimatedCost } = calculateCost(selectedModel, input.message)

    // 5. Apply Deterministic Constraint Engine
    const { tokensUsed: fastTokens, estimatedCost: fastCost } = calculateCost("fast", input.message)
    const constraint = enforceConstraint(
        selectedModel,
        estimatedCost,
        fastCost,
        input.budgetLimit
    )

    const reasoning = [...policyReasoning]
    if (constraint.constraintOutcome === "downgraded") {
        // Recalculate cost for fast model
        const fastResult = calculateCost("fast", input.message)
        tokensUsed = fastResult.tokensUsed
        estimatedCost = fastResult.estimatedCost
        reasoning.push("Estimated cost exceeds budget.")
        reasoning.push("Downgrading to fast model to satisfy budget constraint.")
    } else if (constraint.constraintOutcome === "violated") {
        reasoning.push("Estimated cost exceeds budget.")
        reasoning.push("Budget violation cannot be resolved.")
    }

    // 6. Generate mock response
    const finalModel = constraint.finalModel
    const response = `Processed using ${finalModel} model with retrieval ${input.retrievalEnabled ? "enabled" : "disabled"
        }. Policy: ${strategy}.`

    // 7. Return structured result
    return {
        response,
        prompt,
        metadata: {
            selectedModel: finalModel,
            estimatedCost,
            tokensUsed,
            retrievalUsed: input.retrievalEnabled,
            reasoning,
            constraintOutcome: constraint.constraintOutcome,
            originalModel: selectedModel,
            finalModel: finalModel,
            budgetLimit: constraint.budgetLimit,
            costPressureRatio: constraint.costPressureRatio,
            budgetGap: constraint.budgetGap
        }
    }
}
