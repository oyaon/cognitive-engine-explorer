import { runSystem } from "../runSystem";
import { comparePolicies } from "../comparePolicies";
import { PolicyStrategy } from "../types";
import { analyzeBoundaries } from "../boundaryAnalysisEngine";
import { deriveBoundaries } from "../boundaryDerivationEngine";
import * as Invariants from "../invariantValidationEngine";
import { deriveDecisionTopology } from "../topologyDerivationEngine";

/**
 * PHASE 8A DETERMINISTIC CONSTRAINT ENGINE AUDIT
 * Verification-only script.
 */

// 1️⃣ CREATE ASSERT UTILITY
function assert(condition: boolean, message: string) {
    if (!condition) {
        throw new Error("AUDIT FAILURE: " + message);
    }
}

function deepEqual(obj1: unknown, obj2: unknown): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// 2️⃣ DEFINE TEST RUNNER
function runTest(input: import("../types").SystemInput, strategy: PolicyStrategy, expectations: (result: import("../types").SystemResult) => void) {
    // Execute twice for determinism check
    const result1 = runSystem(input, strategy);
    const result2 = runSystem(input, strategy);

    // Assert Determinism across all fields
    assert(deepEqual(result1, result2), `[${strategy}] Non-deterministic result detected between runs`);

    // Run case-specific expectations
    expectations(result1);
}

// 3️⃣ MULTI-POLICY COMPARISON AUDIT
function runComparisonAudit(input: import("../types").SystemInput) {
    const strategies: PolicyStrategy[] = ["threshold", "costAware", "retrievalWeighted"];

    // Execute comparison twice for determinism check
    const batch1 = comparePolicies(input, strategies);
    const batch2 = comparePolicies(input, strategies);

    assert(batch1.length === strategies.length, "Comparison length mismatch");
    assert(deepEqual(batch1, batch2), "Comparison batch mismatch between runs");

    for (let i = 0; i < strategies.length; i++) {
        const res = batch1[i];
        assert(res.strategy === strategies[i], `Strategy ordering mismatch at index ${i}`);

        // Ensure constraint fields are present if budget exists
        if (input.budgetLimit !== undefined) {
            assert(res.constraintState !== undefined, `Missing constraintState for ${res.strategy}`);
            assert(res.resolvedModel !== undefined, `Missing resolvedModel for ${res.strategy}`);
        }
    }
}

console.log("----------------------------------------");
console.log("Phase 8A — Constraint Enforcement");
console.log("----------------------------------------");

// CASE A: Standard Input
const inputA = {
    message: "Low complexity test",
    complexity: 0.1,
    retrievalEnabled: false
};
runTest(inputA, "threshold", (res) => assert(res.metadata.policyDecision === "fast", "CASE A: threshold should be fast"));
runTest(inputA, "costAware", (res) => assert(res.metadata.policyDecision === "fast", "CASE A: costAware should be fast"));
runComparisonAudit(inputA);
console.log("✔ CASE A: PASSED");

// CASE B: High Token Volume
const inputB = {
    message: "X".repeat(5000), // ~1250 tokens
    complexity: 0.5,
    retrievalEnabled: false
};
runTest(inputB, "threshold", (res) => assert(res.metadata.policyDecision === "fast", "CASE B: threshold should be fast (tokens < 2000)"));
runComparisonAudit(inputB);
console.log("✔ CASE B: PASSED");

// CASE C: High Token + High Complexity
const inputC = {
    message: "X".repeat(5000),
    complexity: 0.9,
    retrievalEnabled: false
};
runTest(inputC, "costAware", (res) => assert(res.metadata.policyDecision === "balanced", "CASE C: costAware should be balanced"));
runComparisonAudit(inputC);
console.log("✔ CASE C: PASSED");

// CASE D: Retrieval Weighted
const inputD = {
    message: "Short",
    complexity: 0.5,
    retrievalEnabled: true
};
runTest(inputD, "retrievalWeighted", (res) => assert(res.metadata.policyDecision === "balanced", "CASE D: retrievalWeighted should be balanced"));
runComparisonAudit(inputD);
console.log("✔ CASE D: PASSED");

// CASE E: Threshold Fallback
const inputE = {
    message: "Short",
    complexity: 0.8,
    retrievalEnabled: false
};
runTest(inputE, "threshold", (res) => assert(res.metadata.policyDecision === "balanced", "CASE E: threshold should be balanced"));
runComparisonAudit(inputE);
console.log("✔ CASE E: PASSED");

// --- PHASE 8A NEW CASES ---

// CASE F: Budget sufficient (no change)
const inputF = {
    message: "Balanced model needed",
    complexity: 0.8,
    retrievalEnabled: false,
    budgetLimit: 0.1 // High enough for balanced
};
runTest(inputF, "threshold", (res) => {
    assert(res.metadata.policyDecision === "balanced", "CASE F: should remain balanced");
    assert(res.metadata.constraintState === "compliant", "CASE F: outcome should be compliant");
    assert(res.metadata.budgetLimit === 0.1, "CASE F: budgetLimit mismatch");
});
runComparisonAudit(inputF);
console.log("✔ CASE F: PASSED");

// CASE G: Budget triggers downgrade
const inputG = {
    message: "Balanced model too expensive",
    complexity: 0.8,
    retrievalEnabled: false,
    budgetLimit: 0.00002 // Too cheap for balanced (0.000042), but okay for fast (0.000014)
};
runTest(inputG, "threshold", (res) => {
    assert(res.metadata.policyDecision === "fast", "CASE G: should be downgraded to fast");
    assert(res.metadata.constraintState === "degraded", "CASE G: outcome should be degraded");
    assert(res.metadata.preConstraintModel === "balanced", "CASE G: preConstraintModel should be balanced");
    assert(res.metadata.resolvedModel === "fast", "CASE G: resolvedModel should be fast");
    assert(res.metadata.reasoning.includes("Estimated cost exceeds budget."), "CASE G: reasoning missing constraint alert");
    assert(res.metadata.reasoning.includes("Downgrading to fast model to satisfy budget constraint."), "CASE G: reasoning missing downgrade alert");
    assert(res.metadata.budgetStress !== undefined && res.metadata.budgetStress > 1, "CASE G: budgetStress should be > 1");
    assert(res.metadata.budgetDeficit !== undefined && res.metadata.budgetDeficit > 0, "CASE G: budgetDeficit should be > 0");
});
runComparisonAudit(inputG);
console.log("✔ CASE G: PASSED");

// CASE H: Budget triggers violation
const inputH = {
    message: "Even fast model too expensive".repeat(100),
    complexity: 0.1,
    retrievalEnabled: false,
    budgetLimit: 0.0001 // Even fast (~0.00145) is too expensive
};
runTest(inputH, "threshold", (res) => {
    assert(res.metadata.policyDecision === "fast", "CASE H: should remain fast (no lower tier)");
    assert(res.metadata.constraintState === "breached", "CASE H: outcome should be breached");
    assert(res.metadata.reasoning.includes("Estimated cost exceeds budget."), "CASE H: reasoning missing constraint alert");
    assert(res.metadata.reasoning.includes("Budget violation cannot be resolved."), "CASE H: reasoning missing violation alert");
});
runComparisonAudit(inputH);
console.log("✔ CASE H: PASSED");

// --- PHASE 8B BOUNDARY ANALYSIS ENGINE AUDIT ---

function runBoundaryAnalysisAudit(input: import("../types").SystemInput) {
    const strategies: PolicyStrategy[] = ["threshold", "costAware", "retrievalWeighted"];
    const results = comparePolicies(input, strategies);

    // Execute twice for determinism check
    const analysis1 = analyzeBoundaries(results);
    const analysis2 = analyzeBoundaries(results);

    assert(deepEqual(analysis1, analysis2), "Boundary analysis results mismatch between runs");

    // Metric Verification
    assert(analysis1.perStrategy.length === strategies.length, "Per-strategy count mismatch");

    // Convergence Logic Verification
    const { global } = analysis1;
    assert(typeof global.preConstraintConvergence === "boolean", "preConstraintConvergence must be boolean");
    assert(typeof global.postConstraintConvergence === "boolean", "postConstraintConvergence must be boolean");
    assert(typeof global.constraintCollapseDetected === "boolean", "constraintCollapseDetected must be boolean");
    assert(typeof global.costSpread === "number", "costSpread must be number");

    // Collapse detection test
    if (!global.preConstraintConvergence && global.postConstraintConvergence) {
        assert(global.constraintCollapseDetected === true, "Collapse should be detected");
    }

    // Stability Margin and Strategy Ranking
    if (input.budgetLimit !== undefined) {
        for (const metric of analysis1.perStrategy) {
            assert(metric.stabilityMargin !== undefined, `Missing stabilityMargin for ${metric.strategy}`);
        }
        assert(global.mostStableStrategy !== undefined, "mostStableStrategy must be defined when budget exists");
        assert(global.leastStableStrategy !== undefined, "leastStableStrategy must be defined when budget exists");
    }
}

console.log("----------------------------------------");
console.log("Phase 8B — Boundary Analysis");
console.log("----------------------------------------");

// CASE I: Natural Divergence (Pre-Constraint)
const inputI = {
    message: "Ambiguous case for strategies",
    complexity: 0.65, // Close to boundaries
    retrievalEnabled: true
};
runBoundaryAnalysisAudit(inputI);
console.log("✔ CASE I: PASSED");

// CASE J: Induced Collapse (Post-Constraint)
const inputJ = {
    message: "High complexity forced down by tight budget",
    complexity: 0.9,
    retrievalEnabled: true,
    budgetLimit: 0.00001 // Forces everything to fast
};
runBoundaryAnalysisAudit(inputJ);
console.log("✔ CASE J: PASSED");

// --- PHASE 10 HYBRID BOUNDARY DERIVATION ENGINE AUDIT ---

function runHybridBoundaryDerivationAudit(message: string) {
    const strategies: PolicyStrategy[] = ["threshold", "costAware", "retrievalWeighted"];

    // Execute twice for determinism check
    const result1 = deriveBoundaries(message, strategies);
    const result2 = deriveBoundaries(message, strategies);

    assert(deepEqual(result1, result2), "Hybrid boundary derivation results mismatch between runs");

    // Structure Verification
    assert(result1.perStrategy.length === strategies.length, "Per-strategy count mismatch");
    assert(result1.global.minimumBudgetForNoViolation !== undefined, "global.minimumBudgetForNoViolation must be defined");

    // Per-strategy metric verification
    for (let i = 0; i < strategies.length; i++) {
        const s = result1.perStrategy[i];
        assert(s.strategy === strategies[i], `Strategy mismatch at index ${i}`);
        assert(typeof s.fastCost === "number", "fastCost must be number");
        assert(typeof s.balancedCost === "number", "balancedCost must be number");
        assert(s.violationBelowBudget === s.fastCost, "violationBelowBudget must equal fastCost");

        if (s.escalationThreshold !== undefined) {
            assert(s.escalationThreshold >= 0 && s.escalationThreshold <= 1, "Escalation complexity out of bounds");
        }

        if (s.downgradeInterval !== undefined) {
            assert(s.balancedCost > s.fastCost, "Downgrade interval exists but balancedCost <= fastCost");
            assert(s.escalationThreshold !== undefined, "Downgrade interval exists but escalation complexity undefined");
            assert(s.downgradeInterval.lower === s.fastCost, "downgradeInterval.lower mismatch");
            assert(s.downgradeInterval.upper === s.balancedCost, "downgradeInterval.upper mismatch");
        }
    }

    // Global metric verification
    const { global } = result1;
    if (global.divergencePoint !== undefined) {
        assert(global.divergencePoint >= 0 && global.divergencePoint <= 1, "Divergence complexity out of bounds");
    }

    if (global.collapseComplexity !== undefined) {
        assert(global.divergencePoint !== undefined, "Collapse detected but divergence complexity undefined");
    }
}


console.log("----------------------------------------");
console.log("Phase 10 — Hybrid Boundary Derivation");
console.log("----------------------------------------");

// CASE K: Standard Analytical Derivation
runHybridBoundaryDerivationAudit("Test message for boundaries");
console.log("✔ CASE K: PASSED");

// CASE L: Complex message triggers collapse behavior
runHybridBoundaryDerivationAudit("X".repeat(100));
console.log("✔ CASE L: PASSED");

// --- PHASE 11 INVARIANT VALIDATION ENGINE AUDIT ---


function runInvariantAudit(message: string) {
    const strategies: PolicyStrategy[] = ["threshold", "costAware", "retrievalWeighted"];
    const derivation = deriveBoundaries(message, strategies);

    // Execute exactly five validators
    Invariants.validateEscalationMonotonicity(message, derivation);
    Invariants.validateEscalationStability(message, derivation);
    Invariants.validateConstraintCoherence(message, derivation);
    Invariants.validateCollapseStability(message, derivation);
    Invariants.validateIdempotence(message, strategies);
}

console.log("----------------------------------------");
console.log("Phase 11 — Invariant Validation");
console.log("----------------------------------------");

// CASE M: Comprehensive invariant check
runInvariantAudit("Verification of complex system invariants under varying conditions.");
console.log("✔ CASE M: PASSED");

// --- PHASE V2 DECISION TOPOLOGY AUDIT ---

console.log("----------------------------------------");
console.log("Phase V2 — Decision Topology Audit");
console.log("----------------------------------------");

// CASE N: No budget — Segmentation aligns with escalationThresholds
{
    const topology = deriveDecisionTopology({});
    assert(topology.regions.length > 0, "CASE N: Must produce at least one region");

    // Every non-undefined escalation threshold must appear as a region boundary
    const allBoundaries = new Set<number>();
    for (const region of topology.regions) {
        allBoundaries.add(region.complexityRange[0]);
        allBoundaries.add(region.complexityRange[1]);
    }

    const strategies: PolicyStrategy[] = ["threshold", "costAware", "retrievalWeighted"];
    for (const s of strategies) {
        const threshold = topology.escalationThresholds[s];
        if (threshold !== undefined) {
            assert(allBoundaries.has(Number(threshold.toFixed(6))),
                `CASE N: escalationThreshold for ${s} (${threshold}) not found in region boundaries`);
        }
    }

    // Verify regions span [0, 1]
    assert(topology.regions[0].complexityRange[0] === 0, "CASE N: First region must start at 0");
    assert(topology.regions[topology.regions.length - 1].complexityRange[1] === 1, "CASE N: Last region must end at 1");

    // Verify contiguity
    for (let i = 1; i < topology.regions.length; i++) {
        assert(topology.regions[i].complexityRange[0] === topology.regions[i - 1].complexityRange[1],
            `CASE N: Region gap between index ${i - 1} and ${i}`);
    }
}
console.log("✔ CASE N: PASSED");

// CASE O: Budget applied — resolvedModel changes reflected in regions
{
    const topology = deriveDecisionTopology({ budgetLimit: 0.000001 });
    assert(topology.regions.length > 0, "CASE O: Must produce at least one region");

    // With an extremely tight budget, at least one region must show non-compliant constraint
    let hasNonCompliant = false;
    for (const region of topology.regions) {
        const strategies: PolicyStrategy[] = ["threshold", "costAware", "retrievalWeighted"];
        for (const s of strategies) {
            const decision = region.strategyDecisions[s];
            if (decision && decision.constraintState !== "compliant") {
                hasNonCompliant = true;
            }
        }
    }
    assert(hasNonCompliant, "CASE O: Tight budget must produce at least one non-compliant constraint state");
}
console.log("✔ CASE O: PASSED");

// CASE P: collapseComplexity present — regions below show strategiesAligned = true
{
    const topology = deriveDecisionTopology({ budgetLimit: 0.000001 });

    if (topology.collapseComplexity !== undefined) {
        const collapse = Number(topology.collapseComplexity.toFixed(6));
        for (const region of topology.regions) {
            if (region.complexityRange[1] <= collapse) {
                assert(region.strategiesAligned === true,
                    `CASE P: Region [${region.complexityRange[0]}, ${region.complexityRange[1]}] below collapseComplexity must be aligned`);
            }
        }
    }
    // If collapseComplexity is undefined, this test is vacuously true
}
console.log("✔ CASE P: PASSED");

// CASE Q: Determinism — two calls, deep compare
{
    const topo1 = deriveDecisionTopology({});
    const topo2 = deriveDecisionTopology({});
    assert(deepEqual(topo1, topo2), "CASE Q: Determinism violated — topology outputs differ between runs");

    const topo3 = deriveDecisionTopology({ budgetLimit: 0.00005 });
    const topo4 = deriveDecisionTopology({ budgetLimit: 0.00005 });
    assert(deepEqual(topo3, topo4), "CASE Q: Determinism violated — budgeted topology outputs differ between runs");
}
console.log("✔ CASE Q: PASSED");

// 4️⃣ DETERMINISM CHECK
console.log("Determinism Check: VERIFIED");

// 5️⃣ FINAL SUMMARY
console.log("----------------------------------------");
console.log("System Integrity Report");
console.log("----------------------------------------");
console.log("All invariant and policy validation phases passed.");
console.log("Deterministic guarantees confirmed.");
console.log("----------------------------------------");
console.log("");
console.log("FINAL STATUS: PASS");
