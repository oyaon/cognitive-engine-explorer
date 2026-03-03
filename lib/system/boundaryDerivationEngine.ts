import { PolicyStrategy, ModelTier } from "./types"
import { calculateCost } from "./calculateCost"
import {
    evaluatePolicyThreshold,
    evaluatePolicyCostAware,
    evaluatePolicyRetrievalWeighted,
    PolicyInput
} from "./policyEngine"
import { comparePolicies } from "./comparePolicies"

export interface StrategyBoundaryDerivation {
    strategy: PolicyStrategy
    fastCost: number
    balancedCost: number
    violationBelowBudget: number
    downgradeInterval?: {
        lower: number
        upper: number
    }
    policyEscalationComplexity?: number
}

export interface GlobalBoundaryDerivation {
    minimumBudgetForNoViolation: number
    collapseOccursBelowBudget?: number
    divergenceComplexity?: number
}

export interface BoundaryDerivationResult {
    perStrategy: StrategyBoundaryDerivation[]
    global: GlobalBoundaryDerivation
}

/**
 * Derives cost and constraint boundaries analytically and behaviorally.
 */
export function deriveBoundaries(
    message: string,
    strategies: PolicyStrategy[]
): BoundaryDerivationResult {
    const tokens = Math.max(0, Math.ceil(message.length / 4))
    const fastCost = Number(calculateCost("fast", message).estimatedCost.toFixed(6))
    const balancedCost = Number(calculateCost("balanced", message).estimatedCost.toFixed(6))

    const perStrategy: StrategyBoundaryDerivation[] = strategies.map(strategy => {
        const evaluate = (complexity: number): ModelTier => {
            const input: PolicyInput = {
                complexity,
                retrievalEnabled: false, // Standard derivation uses retrieval=false
                estimatedTokens: tokens
            }
            switch (strategy) {
                case "costAware": return evaluatePolicyCostAware(input).selectedModel
                case "retrievalWeighted": return evaluatePolicyRetrievalWeighted(input).selectedModel
                case "threshold":
                default: return evaluatePolicyThreshold(input).selectedModel
            }
        }

        const modelAt0 = evaluate(0)
        const modelAt1 = evaluate(1)

        // Monotonicity Validation
        if (modelAt0 === "balanced" || modelAt1 === "fast") {
            throw new Error("Policy monotonicity violated — escalation detection invalid.")
        }

        let policyEscalationComplexity: number | undefined

        if (modelAt0 !== modelAt1) {
            // Binary search for escalation threshold
            let low = 0
            let high = 1
            const maxIterations = 30
            const epsilon = 1e-6

            for (let i = 0; i < maxIterations; i++) {
                const midRaw = (low + high) / 2
                const mid = Number(midRaw.toFixed(6))

                if (mid === low || mid === high) break

                const model = evaluate(mid)
                if (model === "balanced") {
                    high = mid
                } else {
                    low = mid
                }

                if (high - low < epsilon) break
            }
            policyEscalationComplexity = Number(high.toFixed(6))
        }

        const violationBelowBudget = fastCost
        let downgradeInterval: { lower: number; upper: number } | undefined

        if (balancedCost > fastCost && policyEscalationComplexity !== undefined) {
            downgradeInterval = {
                lower: fastCost,
                upper: balancedCost
            }
        }

        return {
            strategy,
            fastCost,
            balancedCost,
            violationBelowBudget,
            downgradeInterval,
            policyEscalationComplexity
        }
    })

    // Divergence Detection
    let divergenceComplexity: number | undefined
    const testComplexities = [0, 1]

    // Check 0 and 1 first
    for (const c of testComplexities) {
        const models = strategies.map(s => {
            const input: PolicyInput = { complexity: c, retrievalEnabled: false, estimatedTokens: tokens }
            if (s === "costAware") return evaluatePolicyCostAware(input).selectedModel
            if (s === "retrievalWeighted") return evaluatePolicyRetrievalWeighted(input).selectedModel
            return evaluatePolicyThreshold(input).selectedModel
        })
        if (new Set(models).size > 1) {
            divergenceComplexity = c
            break
        }
    }

    if (divergenceComplexity === undefined) {
        // Check max escalation threshold
        const escalations = perStrategy
            .map(s => s.policyEscalationComplexity)
            .filter((v): v is number => v !== undefined)

        if (escalations.length > 0) {
            const maxEscalation = Math.max(...escalations)
            const models = strategies.map(s => {
                const input: PolicyInput = { complexity: maxEscalation, retrievalEnabled: false, estimatedTokens: tokens }
                if (s === "costAware") return evaluatePolicyCostAware(input).selectedModel
                if (s === "retrievalWeighted") return evaluatePolicyRetrievalWeighted(input).selectedModel
                return evaluatePolicyThreshold(input).selectedModel
            })
            if (new Set(models).size > 1) {
                divergenceComplexity = maxEscalation
            }
        }
    }

    // Collapse Detection
    let collapseOccursBelowBudget: number | undefined
    if (divergenceComplexity !== undefined) {
        const resultsPre = comparePolicies({
            message,
            complexity: divergenceComplexity,
            retrievalEnabled: false,
            budgetLimit: undefined
        }, strategies)

        const resultsPost = comparePolicies({
            message,
            complexity: divergenceComplexity,
            retrievalEnabled: false,
            budgetLimit: fastCost
        }, strategies)

        const selectedModelsPre = resultsPre.map(r => r.selectedModel)
        const selectedModelsPost = resultsPost.map(r => r.selectedModel)

        const distinctPre = new Set(selectedModelsPre).size
        const distinctPost = new Set(selectedModelsPost).size

        if (distinctPre >= 2 && distinctPost === 1) {
            collapseOccursBelowBudget = balancedCost
        }
    }

    const minimumBudgetForNoViolation = fastCost

    return {
        perStrategy,
        global: {
            minimumBudgetForNoViolation,
            collapseOccursBelowBudget,
            divergenceComplexity
        }
    }
}
