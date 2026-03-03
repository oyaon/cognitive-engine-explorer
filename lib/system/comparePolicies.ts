import { SystemInput, PolicyStrategy, ModelTier, ExecutionMetadata } from "./types"
import {
    evaluatePolicyThreshold,
    evaluatePolicyCostAware,
    evaluatePolicyRetrievalWeighted,
    PolicyInput
} from "./policyEngine"
import { calculateCost, estimateTokens } from "./calculateCost"
import { enforceConstraint, ConstraintOutcome } from "./constraintEngine"

export type ComparisonResult = {
    strategy: PolicyStrategy
    policyDecision: ModelTier
    reasoning: string[]
    projectedCost: number
    tokenEstimate: number
    constraintState?: ConstraintOutcome
    preConstraintModel?: ModelTier
    resolvedModel?: ModelTier
    budgetStress?: number
    budgetDeficit?: number
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
    const estimatedTokens = estimateTokens(input.message)

    const policyInput: PolicyInput = {
        complexity: input.complexity,
        retrievalEnabled: input.retrievalEnabled,
        estimatedTokens
    }

    // 2. Map strategies preserves providing ordering
    return strategies.map(strategy => {
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

        // Apply Constraints
        let { tokensUsed, estimatedCost } = calculateCost(selectedModel, input.message);
        const { estimatedCost: fastCost } = calculateCost("fast", input.message);

        const constraint = enforceConstraint(
            selectedModel,
            estimatedCost,
            fastCost,
            input.budgetLimit
        );

        if (constraint.constraintState === "degraded") {
            const fastResult = calculateCost("fast", input.message);
            tokensUsed = fastResult.tokensUsed;
            estimatedCost = fastResult.estimatedCost;
        }

        const reasoning = policyReasoning.filter(r => !r.startsWith("Final model selected:"));
        reasoning.push(`Final model selected: ${constraint.resolvedModel}`);

        return {
            strategy,
            policyDecision: constraint.resolvedModel,
            reasoning,
            projectedCost: estimatedCost,
            tokenEstimate: tokensUsed,
            constraintState: constraint.constraintState,
            preConstraintModel: selectedModel,
            resolvedModel: constraint.resolvedModel,
            budgetStress: constraint.budgetStress,
            budgetDeficit: constraint.budgetDeficit,
            budgetLimit: constraint.budgetLimit
        };
    });
}
