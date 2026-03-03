import { PolicyStrategy, ModelTier } from "./types"
import { ComparisonResult } from "./comparePolicies"

export interface PerStrategyBoundaryMetrics {
    strategy: PolicyStrategy
    preConstraintModel: ModelTier
    resolvedModel: ModelTier
    projectedCost: number
    downgradeTriggered: boolean
    violationTriggered: boolean
    stabilityMargin?: number
}

export interface GlobalBoundaryMetrics {
    preConstraintConvergence: boolean
    postConstraintConvergence: boolean
    constraintCollapseDetected: boolean
    costSpread: number
    mostStableStrategy?: PolicyStrategy
    leastStableStrategy?: PolicyStrategy
}

export interface BoundaryAnalysisResult {
    perStrategy: PerStrategyBoundaryMetrics[]
    global: GlobalBoundaryMetrics
}

/**
 * Analyzes pre-constraint and post-constraint decision behavior across strategies.
 * Deterministic and read-only.
 */
export function analyzeBoundaries(
    comparisonResults: ComparisonResult[]
): BoundaryAnalysisResult {
    const perStrategy: PerStrategyBoundaryMetrics[] = comparisonResults.map(result => {
        const metrics: PerStrategyBoundaryMetrics = {
            strategy: result.strategy,
            preConstraintModel: result.preConstraintModel || result.policyDecision, // fallback if not explicitly provided
            resolvedModel: result.resolvedModel || result.policyDecision,
            projectedCost: result.projectedCost,
            downgradeTriggered: result.constraintState === "degraded",
            violationTriggered: result.constraintState === "breached"
        };

        if (result.budgetLimit !== undefined) {
            metrics.stabilityMargin = Number(
                (result.budgetLimit - result.projectedCost).toFixed(6)
            );
        }

        return metrics;
    });

    const allOriginalModels = perStrategy.map(m => m.preConstraintModel);
    const allFinalModels = perStrategy.map(m => m.resolvedModel);
    const costs = perStrategy.map(m => m.projectedCost);


    const preConstraintConvergence = allOriginalModels.length > 0 &&
        allOriginalModels.every(m => m === allOriginalModels[0]);

    const postConstraintConvergence = allFinalModels.length > 0 &&
        allFinalModels.every(m => m === allFinalModels[0]);

    const constraintCollapseDetected = preConstraintConvergence === false &&
        postConstraintConvergence === true;

    const costSpread = costs.length > 0 ?
        Number((Math.max(...costs) - Math.min(...costs)).toFixed(6)) : 0;

    let mostStableStrategy: PolicyStrategy | undefined;
    let leastStableStrategy: PolicyStrategy | undefined;

    const withStability = perStrategy.filter(m => m.stabilityMargin !== undefined);
    if (withStability.length === perStrategy.length && perStrategy.length > 0) {
        const sorted = [...perStrategy].sort((a, b) => (b.stabilityMargin || 0) - (a.stabilityMargin || 0));
        mostStableStrategy = sorted[0].strategy;
        leastStableStrategy = sorted[sorted.length - 1].strategy;
    }

    return {
        perStrategy,
        global: {
            preConstraintConvergence,
            postConstraintConvergence,
            constraintCollapseDetected,
            costSpread,
            mostStableStrategy,
            leastStableStrategy
        }
    };
}
