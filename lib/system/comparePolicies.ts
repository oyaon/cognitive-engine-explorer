import { SystemInput, PolicyStrategy, ModelTier, ExecutionMetadata } from "./types"
import {
    evaluatePolicyThreshold,
    evaluatePolicyCostAware,
    evaluatePolicyRetrievalWeighted,
    PolicyInput
} from "./policyEngine"
import { calculateCost } from "./calculateCost"
import { enforceConstraint, ConstraintOutcome } from "./constraintEngine"

export type ComparisonResult = {
    strategy: PolicyStrategy
    selectedModel: ModelTier
    reasoning: string[]
    estimatedCost: number
    tokensUsed: number
    constraintOutcome?: ConstraintOutcome
    originalModel?: ModelTier
    finalModel?: ModelTier
    costPressureRatio?: number
    budgetGap?: number
    budgetLimit?: number
}

/**
 * Headless Multi-Policy Comparison Engine.
 * Evaluates multiple strategies against a single input.
 */
export function comparePolicies(
    input: SystemInput,
    strategies: PolicyStrategy[]
): ComparisonResult[] {
    // 0. Domain validation
    if (!input.message || typeof input.complexity !== "number") {
        throw new Error("Domain validation failed: Invalid SystemInput structure")
    }

    // 1. Calculate tokens once for all evaluations
    const estimatedTokens = Math.max(0, Math.ceil(input.message.length / 4))

    const policyInput: PolicyInput = {
        complexity: input.complexity,
        retrievalEnabled: input.retrievalEnabled,
        estimatedTokens
    }

    // 2. Map strategies preserves providing ordering
    return strategies.map(strategy => {
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

        const { selectedModel, reasoning } = evaluation;

        // Apply Constraints
        let { tokensUsed, estimatedCost } = calculateCost(selectedModel, input.message);
        const { estimatedCost: fastCost } = calculateCost("fast", input.message);

        const constraint = enforceConstraint(
            selectedModel,
            estimatedCost,
            fastCost,
            input.budgetLimit
        );

        if (constraint.constraintOutcome === "downgraded") {
            const fastResult = calculateCost("fast", input.message);
            tokensUsed = fastResult.tokensUsed;
            estimatedCost = fastResult.estimatedCost;
        }

        return {
            strategy,
            selectedModel: constraint.finalModel,
            reasoning,
            estimatedCost,
            tokensUsed,
            constraintOutcome: constraint.constraintOutcome,
            originalModel: selectedModel,
            finalModel: constraint.finalModel,
            costPressureRatio: constraint.costPressureRatio,
            budgetGap: constraint.budgetGap,
            budgetLimit: constraint.budgetLimit
        };
    });
}
