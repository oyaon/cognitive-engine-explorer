import { ModelTier } from "./types"

/**
 * PHASE 8A — Deterministic Constraint Engine
 * Pure logic for budget enforcement and model arbitration.
 */

export type ConstraintOutcome =
    | "compliant"
    | "degraded"
    | "breached"

export interface ConstraintResult {
    resolvedModel: ModelTier
    preConstraintModel: ModelTier
    constraintState: ConstraintOutcome
    budgetLimit?: number
    budgetStress?: number
    budgetDeficit?: number
}

/**
 * Enforces budget constraints and performs model arbitration.
 * @param selectedModel - The model tier selected by the policy engine.
 * @param estimatedCost - The cost estimated for the selected model.
 * @param fastCost - The simulated cost for the 'fast' model.
 * @param budgetLimit - The user-defined budget ceiling.
 */
export function enforceConstraint(
    selectedModel: ModelTier,
    estimatedCost: number,
    fastCost: number,
    budgetLimit?: number
): ConstraintResult {
    // Rule 1: If budgetLimit is undefined
    if (budgetLimit === undefined) {
        return {
            resolvedModel: selectedModel,
            preConstraintModel: selectedModel,
            constraintState: "compliant"
        }
    }

    // Rule 2: If budgetLimit <= 0
    if (budgetLimit <= 0) {
        throw new Error("Invalid budgetLimit: must be greater than 0")
    }

    // Rule 3: If estimatedCost <= budgetLimit
    if (estimatedCost <= budgetLimit) {
        return {
            resolvedModel: selectedModel,
            preConstraintModel: selectedModel,
            constraintState: "compliant",
            budgetLimit
        }
    }

    // Arbitration Logic
    const costPressureRatio = Number((estimatedCost / budgetLimit).toFixed(6))
    const budgetGap = Number((estimatedCost - budgetLimit).toFixed(6))

    // Arbitration Logic
    if (selectedModel === "balanced" && fastCost <= budgetLimit) {
        return {
            resolvedModel: "fast",
            preConstraintModel: selectedModel,
            constraintState: "degraded",
            budgetLimit,
            budgetStress: costPressureRatio,
            budgetDeficit: budgetGap
        }
    }

    return {
        resolvedModel: selectedModel,
        preConstraintModel: selectedModel,
        constraintState: "breached",
        budgetLimit,
        budgetStress: costPressureRatio,
        budgetDeficit: budgetGap
    }
}
