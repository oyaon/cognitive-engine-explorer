# Cognitive Engine Explorer

Deterministic policy arbitration and constraint-aware model routing engine.

Live Demo:
https://cognitive-engine-explorer.vercel.app

![Dashboard](docs/dashboard-preview.png)

## System Pipeline
The resolution pipeline operates through sequentially isolated stages to maintain architectural boundaries:

1.  **Input Analysis**: Processes message complexity and configuration parameters.
2.  **Policy Engine**: Dictates a `policyDecision` (e.g., `fast`, `balanced`, `precise`) based on complexity, producing initial cost and token estimates.
3.  **Constraint Engine**: Processes the policy decision against the `budgetLimit` to determine the `resolvedModel` and `constraintState`.
4.  **Comparison Engine**: Executes multi-strategy analysis to determine how alternative policies would have performed.
5.  **Topology Engine**: Derives decision boundaries, escalation thresholds, and divergence points.
6.  **Invariant Validation**: A verification layer that ensures the current state adheres to defined system guarantees.

## Core Features
- **Escalation Monotonicity**: Model tier progression is strictly monotonic relative to increasing input complexity.
- **Constraint Transition Coherence**: State transitions under budget boundaries resolve according to deterministic logic.
- **Boundary Derivation**: Exact identification of behavioral thresholds and model "collapse" complexities.
- **Multi-Policy Strategy Comparison**: Live visualization of outcomes across different arbitration strategies.
- **Decision Visibility**: Full traceability from raw input through policy selection to final constraint-aware resolution.

## Deterministic Guarantees
Determinism is verified through a dedicated audit layer located in `lib/system/_audit_/policyAudit.ts`. This layer ensures:
- **Zero Variance**: Identical inputs yield byte-identical outputs across all runs.
- **Synchronicity**: No asynchronous operations or external entropy (e.g., random, time) in the core resolution logic.
- **Invariant Enforcement**: Strict CI checks validate mathematical constraints and block architectural drift.

Running the audit:
```bash
npx tsx lib/system/_audit_/policyAudit.ts
```

## Example Execution
The system exposes a strictly typed API contract. A typical request-response cycle:

**Request** (`POST /api/run`):
```json
{
  "message": "analyze system state",
  "complexity": 0.65,
  "budgetLimit": 1.50,
  "retrievalEnabled": true,
  "strategy": "costAware"
}
```

**Response**:
```json
{
  "policyDecision": "balanced",
  "resolvedModel": "balanced",
  "constraintState": "compliant",
  "projectedCost": 0.00045,
  "tokenEstimate": 150,
  "reasoning": [
    "Input complexity 0.65 exceeds fast threshold",
    "CostAware strategy favors balanced tier",
    "Projected cost $0.00045 within budget $1.50",
    "Final model selected: balanced"
  ]
}
```

## Architecture
The architecture is structured into strictly isolated layers:
- **Interface Layer**: React/Next.js dashboard for visualization and simulation control.
- **Orchestration Layer**: API routes (`/api/run`) managing the communication between UI and System logic.
- **Domain Engine**: Pure deterministic logic (`lib/system`) for policy and constraint resolution.
- **System Kernel**: Core utilities for cost calculation, type definitions, and invariant validation.

## Project Structure
```text
├── app/
│   ├── api/run/         # API Endpoint (Contract Layer)
│   ├── architecture/    # Explorer Dashboard
│   └── components/      # UI Layer (Strictly isolated from lib/system)
├── lib/system/
│   ├── _audit_/         # Deterministic Verification (Audit Layer)
│   ├── policyEngine.ts  # Strategy Arbitration
│   ├── constraintEngine.ts # Budget Enforcement
│   └── topologyDerivationEngine.ts # Boundary Analysis
└── public/              # Static Assets
```

## Development Setup
**Prerequisites**: Node.js 18+

1.  **Installation**
    ```bash
    npm install
    ```

2.  **Start Development Server**
    ```bash
    npm run dev
    ```

3.  **Run Production Build**
    ```bash
    npm run build
    npm run start
    ```

