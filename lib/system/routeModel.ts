import { ModelTier } from "./types"

/**
 * Deterministic model routing based on complexity.
 * @param complexity - Value between 0 and 1.
 * @returns ModelTier
 */
export function routeModel(complexity: number): ModelTier {
    return complexity > 0.6 ? "balanced" : "fast"
}
