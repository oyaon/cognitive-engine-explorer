# Cognitive Engine Explorer

The project functions as a deterministic policy arbitration engine and constraint-aware resolution system. It implements a boundary-derivable decision framework, ensuring mathematically predictable operations decoupled from external variance. Functionality is verified entirely by a CI-enforced invariant model.

## Core Architectural Properties

- Determinism: Guaranteed synchronous resolution with no async execution or randomness.
- Escalation Monotonicity: Model tier progression is strictly monotonic with increasing complexity.
- Constraint Transition Coherence: State changes under budget boundaries resolve predictably.
- Boundary Derivation Precision: Exact identification of behavioral thresholds and collapse complexities.
- Invariant Enforcement via CI: Mathematical validation of constraints blocks structural drift.
- Strict Domain Isolation: Pure execution environments decoupled from interface artifacts.

## Architecture Overview

The resolution pipeline operates under strict separation of concerns, executing through the following sequentially isolated stages:

```text
SystemInput
  → policyEngine (policyDecision)
  → constraintEngine (resolvedModel, constraintState)
  → comparePolicies (multi-strategy analysis)
  → boundaryAnalysisEngine
  → boundaryDerivationEngine
  → invariantValidationEngine (audit layer)
```

The system segregates policy evaluation from constraint processing. The policy engine dictates cost paths without considering budget parameters, producing a `preConstraintModel`, `projectedCost`, and `tokenEstimate`. The constraint engine acts subsequently on those outputs to establish the `resolvedModel`, `constraintState`, `budgetDeficit`, and `budgetStress`. The boundary engines then run analysis to determine the `escalationThreshold`, `divergencePoint`, and `collapseComplexity`.

## Deterministic Audit Enforcement

The system employs `policyAudit.ts` as a strict verification layer. Integrated directly into CI, this script executes a sequence of checks testing escalation properties and boundary resolution. It is designed to hard-fail on invariant violations via exit-code enforcement. This mandates high determinism and enforces a strict deterministic output discipline, proven by byte-identical verification across runs. A successful run will strictly output a `FINAL STATUS: PASS`.

```bash
npx tsx lib/system/_audit_/policyAudit.ts
```

## API Contract

The system exposes the following API contract:

```json
{
  "message": string,
  "complexity": number,
  "retrievalEnabled": boolean,
  "strategy": optional,
  "compare": optional,
  "budgetLimit": optional
}
```

## Formal Structural Guarantees

See: [docs/invariant-guarantees.md](docs/invariant-guarantees.md)


## Usage

**Installation**
```bash
npm install
```

**Run Deterministic Audit**
```bash
npx tsx lib/system/_audit_/policyAudit.ts
```

**Development Server**
```bash
npm run dev
```

## System Rationale

The system models deterministic arbitration under constraints. It formalizes decision boundaries. It enforces invariants programmatically.

## Roadmap

- Visualization layer
- Policy expansion
- Extended invariant modeling
- Economic modeling refinement
