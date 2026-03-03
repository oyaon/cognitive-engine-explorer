import { SystemInput, SystemResult, PolicyStrategy, ModelTier } from "./types"
import { evaluatePolicyThreshold, evaluatePolicyCostAware, evaluatePolicyRetrievalWeighted } from "./policyEngine"
import { calculateCost, estimateTokens } from "./calculateCost"
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
    const estimatedTokens = estimateTokens(input.message)

    // 2. Determine model via deterministic policy engine
    const policyInput = {
        complexity: input.complexity,
        retrievalEnabled: input.retrievalEnabled,
        estimatedTokens
    }

    let evaluation: { policyDecision: ModelTier, reasoning: string[] };
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

    const { policyDecision: selectedModel, reasoning: policyReasoning } = evaluation;

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

    const filteredReasoning = policyReasoning.filter(r => !r.startsWith("Final model selected:"));
    const reasoning = [...filteredReasoning]

    if (constraint.constraintState === "degraded") {
        // Recalculate cost for fast model
        const fastResult = calculateCost("fast", input.message)
        tokensUsed = fastResult.tokensUsed
        estimatedCost = fastResult.estimatedCost
        reasoning.push("Estimated cost exceeds budget.")
        reasoning.push("Downgrading to fast model to satisfy budget constraint.")
    } else if (constraint.constraintState === "breached") {
        reasoning.push("Estimated cost exceeds budget.")
        reasoning.push("Budget violation cannot be resolved.")
    }

    // Ensure Terminal Reasoning Contract
    reasoning.push(`Final model selected: ${constraint.resolvedModel}`)

    // 6. Generate mock response
    const finalModel = constraint.resolvedModel
    const response = `Processed using ${finalModel} model with retrieval ${input.retrievalEnabled ? "enabled" : "disabled"
        }. Policy: ${strategy}.`

    // 7. Return structured result
    return {
        response,
        prompt,
        metadata: {
            policyDecision: finalModel,
            projectedCost: estimatedCost,
            tokenEstimate: tokensUsed,
            retrievalUsed: input.retrievalEnabled,
            reasoning,
            constraintState: constraint.constraintState,
            preConstraintModel: selectedModel,
            resolvedModel: finalModel,
            budgetLimit: constraint.budgetLimit,
            budgetStress: constraint.budgetStress,
            budgetDeficit: constraint.budgetDeficit
        }
    }
}
