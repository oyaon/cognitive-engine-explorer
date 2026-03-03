import { PolicyStrategy, ModelTier } from "./types"
import {
    evaluatePolicyThreshold,
    evaluatePolicyCostAware,
    evaluatePolicyRetrievalWeighted,
    PolicyInput
} from "./policyEngine"
import { enforceConstraint, ConstraintResult } from "./constraintEngine"
import { comparePolicies, ComparisonResult } from "./comparePolicies"
import { deriveBoundaries, BoundaryDerivationResult } from "./boundaryDerivationEngine"
import { estimateTokens } from "./calculateCost"

const EPS = 1e-6;

function normalize(value: number): number {
    return Number(value.toFixed(6));
}

function deepEqual(obj1: unknown, obj2: unknown): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

function evaluate(strategy: PolicyStrategy, complexity: number, tokens: number): ModelTier {
    const input: PolicyInput = {
        complexity: normalize(complexity),
        retrievalEnabled: false,
        estimatedTokens: tokens
    };
    switch (strategy) {
        case "costAware": return evaluatePolicyCostAware(input).policyDecision;
        case "retrievalWeighted": return evaluatePolicyRetrievalWeighted(input).policyDecision;
        case "threshold":
        default: return evaluatePolicyThreshold(input).policyDecision;
    }
}

/**
 * INVARIANT 1 — ESCALATION MONOTONICITY
 */
export function validateEscalationMonotonicity(
    message: string,
    derivation: BoundaryDerivationResult
) {
    const tokens = estimateTokens(message);

    for (const s of derivation.perStrategy) {
        const T = s.escalationThreshold;
        if (T === undefined) continue;

        const testPoints = [0, normalize(T - EPS), normalize(T), normalize(T + EPS), 1];
        let hasReachedBalanced = false;

        for (const p of testPoints) {
            const model = evaluate(s.strategy, p, tokens);
            if (model === "balanced") {
                hasReachedBalanced = true;
            } else if (model === "fast" && hasReachedBalanced) {
                throw new Error("Escalation monotonicity violation");
            }
        }
    }
}

/**
 * INVARIANT 2 — ESCALATION STABILITY
 */
export function validateEscalationStability(
    message: string,
    derivation: BoundaryDerivationResult
) {
    const tokens = estimateTokens(message);

    for (const s of derivation.perStrategy) {
        const T = s.escalationThreshold;
        if (T === undefined) continue;

        const mMinus = evaluate(s.strategy, normalize(T - EPS), tokens);
        const mAt = evaluate(s.strategy, normalize(T), tokens);
        const mPlus = evaluate(s.strategy, normalize(T + EPS), tokens);

        if (mMinus !== "fast" || mAt !== "balanced" || mPlus !== "balanced") {
            throw new Error("Escalation stability violation");
        }
    }
}

/**
 * INVARIANT 3 — CONSTRAINT COHERENCE
 */
export function validateConstraintCoherence(
    message: string,
    derivation: BoundaryDerivationResult
) {
    // Select strategy that produces "balanced" at some complexity
    const strategyResult = derivation.perStrategy.find(s => s.escalationThreshold !== undefined);
    if (!strategyResult) return;

    const strategy = strategyResult.strategy;
    const balancedCost = strategyResult.balancedCost;
    const fastCost = strategyResult.fastCost;
    const complexity = 1.0; // At complexity 1, it should be balanced if threshold exists

    const testBudgets = [
        normalize(balancedCost + EPS),
        normalize(balancedCost),
        normalize(fastCost),
        normalize(fastCost - EPS)
    ];

    const expectedOutcomes = ["compliant", "compliant", "degraded", "breached"];

    for (let i = 0; i < testBudgets.length; i++) {
        const budget = testBudgets[i];
        const result = enforceConstraint("balanced", balancedCost, fastCost, budget);

        if (result.constraintState !== expectedOutcomes[i]) {
            throw new Error(`Constraint coherence violation: expected ${expectedOutcomes[i]} at budget ${budget}, got ${result.constraintState}`);
        }
    }
}

/**
 * INVARIANT 4 — COLLAPSE STABILITY
 */
export function validateCollapseStability(
    message: string,
    derivation: BoundaryDerivationResult
) {
    if (derivation.global.collapseComplexity === undefined) return;
    if (derivation.global.divergencePoint === undefined) return;

    const divC = derivation.global.divergencePoint;
    const strategies: PolicyStrategy[] = derivation.perStrategy.map(s => s.strategy);

    // Convergence check helper
    const checkConvergence = (budget?: number) => {
        const results = comparePolicies({
            message,
            complexity: divC,
            retrievalEnabled: false,
            budgetLimit: budget
        }, strategies);
        return new Set(results.map(r => r.policyDecision)).size === 1;
    };

    // Above collapse (no budget) -> Divergence exists
    if (checkConvergence(undefined)) {
        throw new Error("Collapse stability violation: expected divergence above collapse");
    }

    // At/below collapse
    const fastCost = derivation.perStrategy[0].fastCost;
    const collapseBudgets = [
        derivation.global.collapseComplexity, // balancedCost
        fastCost,
        normalize(fastCost - EPS)
    ];

    for (const budget of collapseBudgets) {
        if (!checkConvergence(budget)) {
            throw new Error(`Collapse stability violation: expected convergence at budget ${budget}`);
        }
    }
}

/**
 * INVARIANT 5 — IDEMPOTENCE
 */
export function validateIdempotence(
    message: string,
    strategies: PolicyStrategy[]
) {
    // 1. deriveBoundaries
    const d1 = deriveBoundaries(message, strategies);
    const d2 = deriveBoundaries(message, strategies);
    if (!deepEqual(d1, d2)) throw new Error("Idempotence violation: deriveBoundaries");

    // 2. comparePolicies
    const input = { message, complexity: 0.8, retrievalEnabled: false, budgetLimit: 0.00005 };
    const c1 = comparePolicies(input, strategies);
    const c2 = comparePolicies(input, strategies);

    for (let i = 0; i < c1.length; i++) {
        const r1 = c1[i];
        const r2 = c2[i];

        if (r1.policyDecision !== r2.policyDecision) throw new Error("Idempotence violation: policyDecision");
        if (r1.resolvedModel !== r2.resolvedModel) throw new Error("Idempotence violation: resolvedModel");
        if (!deepEqual(r1.reasoning, r2.reasoning)) throw new Error("Idempotence violation: reasoning");
        if (r1.tokenEstimate !== r2.tokenEstimate) throw new Error("Idempotence violation: tokenEstimate");
        if (r1.projectedCost !== r2.projectedCost) throw new Error("Idempotence violation: projectedCost");

        const meta1 = { outcome: r1.constraintState, ratio: r1.budgetStress, gap: r1.budgetDeficit, limit: r1.budgetLimit };
        const meta2 = { outcome: r2.constraintState, ratio: r2.budgetStress, gap: r2.budgetDeficit, limit: r2.budgetLimit };
        if (!deepEqual(meta1, meta2)) throw new Error("Idempotence violation: constraint metadata");
    }

    // 3. enforceConstraint
    const e1 = enforceConstraint("balanced", 0.000042, 0.000014, 0.00002);
    const e2 = enforceConstraint("balanced", 0.000042, 0.000014, 0.00002);
    if (!deepEqual(e1, e2)) throw new Error("Idempotence violation: enforceConstraint");
}
