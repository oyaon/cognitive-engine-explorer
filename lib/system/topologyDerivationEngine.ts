import { ModelTier, PolicyStrategy } from "./types"
import { ConstraintOutcome } from "./constraintEngine"
import { deriveBoundaries } from "./boundaryDerivationEngine"
import { comparePolicies } from "./comparePolicies"

// ------------------------------------------------
// Types
// ------------------------------------------------

export type ConstraintState = ConstraintOutcome

export type StrategyDecision = {
    policyDecision: ModelTier
    resolvedModel: ModelTier
    constraintState: ConstraintState
}

export type DecisionRegion = {
    complexityRange: [number, number]
    strategyDecisions: Record<PolicyStrategy, StrategyDecision>
    strategiesAligned: boolean
}

export type DecisionTopology = {
    regions: DecisionRegion[]
    escalationThresholds: Record<PolicyStrategy, number | undefined>
    divergencePoint?: number
    collapseComplexity?: number
}

// ------------------------------------------------
// Canonical Strategies (deterministic ordering)
// ------------------------------------------------

const STRATEGIES: PolicyStrategy[] = ["threshold", "costAware", "retrievalWeighted"]

// ------------------------------------------------
// Deterministic synthetic message baseline
// ------------------------------------------------

const SYNTHETIC_MESSAGE = "x"

// ------------------------------------------------
// Engine
// ------------------------------------------------

/**
 * Derives deterministic decision topology partitions over complexity ∈ [0,1]
 * across all policy strategies simultaneously.
 *
 * Composes deriveBoundaries() and comparePolicies().
 * Never duplicates policy logic. Never re-enforces invariants.
 * Fully synchronous. Produces byte-identical output for identical inputs.
 */
export function deriveDecisionTopology(params: {
    budgetLimit?: number
}): DecisionTopology {
    const { budgetLimit } = params

    // 1. Call deriveBoundaries to obtain boundary structure
    const boundaries = deriveBoundaries(SYNTHETIC_MESSAGE, STRATEGIES)

    // 2. Extract escalation thresholds per strategy
    const escalationThresholds: Record<PolicyStrategy, number | undefined> = {
        threshold: undefined,
        costAware: undefined,
        retrievalWeighted: undefined
    }

    for (const s of boundaries.perStrategy) {
        escalationThresholds[s.strategy] = s.escalationThreshold
    }

    const { divergencePoint, collapseComplexity } = boundaries.global

    // 3. Collect candidate breakpoints
    const rawBreakpoints: (number | undefined)[] = [
        0,
        1,
        ...boundaries.perStrategy.map(s => s.escalationThreshold),
        divergencePoint,
        collapseComplexity
    ]

    // 4. Filter, normalize, deduplicate, sort
    const seen = new Set<number>()
    const breakpoints: number[] = []

    for (const raw of rawBreakpoints) {
        if (raw === undefined) continue
        const normalized = Number(raw.toFixed(6))
        if (normalized < 0 || normalized > 1) continue
        if (seen.has(normalized)) continue
        seen.add(normalized)
        breakpoints.push(normalized)
    }

    breakpoints.sort((a, b) => a - b)

    // 5. Partition into adjacent intervals and evaluate each region
    const regions: DecisionRegion[] = []

    for (let i = 0; i < breakpoints.length - 1; i++) {
        const a = breakpoints[i]
        const b = breakpoints[i + 1]

        // Compute midpoint with normalization
        const midpoint = Number(((a + b) / 2).toFixed(6))

        // Call comparePolicies at midpoint
        const results = comparePolicies(
            {
                message: SYNTHETIC_MESSAGE,
                complexity: midpoint,
                retrievalEnabled: false,
                budgetLimit
            },
            STRATEGIES
        )

        // Extract per-strategy decisions
        const strategyDecisions = {} as Record<PolicyStrategy, StrategyDecision>

        for (const r of results) {
            strategyDecisions[r.strategy] = {
                policyDecision: r.preConstraintModel ?? r.policyDecision,
                resolvedModel: r.resolvedModel ?? r.policyDecision,
                constraintState: r.constraintState ?? "compliant"
            }
        }

        // Determine alignment
        const resolvedModels = results.map(r => r.resolvedModel ?? r.policyDecision)
        const strategiesAligned = new Set(resolvedModels).size === 1

        regions.push({
            complexityRange: [a, b],
            strategyDecisions,
            strategiesAligned
        })
    }

    return {
        regions,
        escalationThresholds,
        divergencePoint,
        collapseComplexity
    }
}
