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
// Canonical Constants
// ------------------------------------------------

const STRATEGIES: PolicyStrategy[] = ["threshold", "costAware", "retrievalWeighted"]
const TOPOLOGY_MESSAGE = "topology-evaluation"

/**
 * PHASE V2 — Deterministic Multi-Policy Decision Topology Engine
 *
 * Derives deterministic decision topology partitions over complexity ∈ [0,1]
 * across all policy strategies simultaneously.
 */
export function deriveDecisionTopology(params: { budgetLimit?: number }): DecisionTopology {
  const { budgetLimit } = params

  // Step 1 — Derive Boundaries
  const boundaries = deriveBoundaries(TOPOLOGY_MESSAGE, STRATEGIES)

  const { divergencePoint, collapseComplexity } = boundaries.global
  const escalationThresholds = {} as Record<PolicyStrategy, number | undefined>
  for (const s of boundaries.perStrategy) {
    escalationThresholds[s.strategy] = s.escalationThreshold
  }

  // Step 2 & 3 — Collect & Clean Breakpoints
  const rawBreakpoints: (number | undefined)[] = [
    0,
    1,
    ...boundaries.perStrategy.map(s => s.escalationThreshold),
    divergencePoint,
    collapseComplexity
  ]

  const seen = new Set<number>()
  const breakpoints: number[] = []

  for (const val of rawBreakpoints) {
    if (val === undefined) continue
    const normalized = Number(val.toFixed(6))
    if (normalized < 0 || normalized > 1) continue
    if (!seen.has(normalized)) {
      seen.add(normalized)
      breakpoints.push(normalized)
    }
  }

  breakpoints.sort((a, b) => a - b)

  // Step 4 — Partition Into Regions
  const regions: DecisionRegion[] = []

  // Step 5 — Evaluate Each Region
  if (breakpoints.length === 0) {
    // Should not happen as 0 and 1 are included
    return { regions: [], escalationThresholds, divergencePoint, collapseComplexity }
  }

  for (let i = 0; i < breakpoints.length - 1; i++) {
    const a = breakpoints[i]
    const b = breakpoints[i + 1]

    const midpoint = Number(((a + b) / 2).toFixed(6))

    const results = comparePolicies({
      message: TOPOLOGY_MESSAGE,
      complexity: midpoint,
      retrievalEnabled: false,
      budgetLimit
    }, STRATEGIES)

    // Step 6 — Extract Strategy Decisions
    const strategyDecisions = {} as Record<PolicyStrategy, StrategyDecision>

    for (const r of results) {
      strategyDecisions[r.strategy] = {
        policyDecision: r.preConstraintModel ?? r.policyDecision, // Handle fallback
        resolvedModel: r.resolvedModel ?? r.policyDecision,
        constraintState: r.constraintState ?? "compliant"
      }
    }

    // Step 7 — Compute strategiesAligned
    const resolvedModels = results.map(r => r.resolvedModel ?? r.policyDecision)
    const strategiesAligned = resolvedModels.every(m => m === resolvedModels[0])

    // Step 8 — Construct Region Object
    regions.push({
      complexityRange: [a, b],
      strategyDecisions,
      strategiesAligned
    })
  }

  // Step 9 — Return DecisionTopology
  return {
    regions,
    escalationThresholds,
    divergencePoint: divergencePoint !== undefined ? Number(divergencePoint.toFixed(6)) : undefined,
    collapseComplexity: collapseComplexity !== undefined ? Number(collapseComplexity.toFixed(6)) : undefined
  }
}
