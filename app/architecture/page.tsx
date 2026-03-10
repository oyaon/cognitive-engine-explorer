"use client";

import { useState, useCallback } from "react";

// UI Components
import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { Card } from "@/app/components/ui/Card";

// Feature Components
import { ArchitectureStack } from "@/app/components/architecture/ArchitectureStack";
import { RuntimeInspector } from "@/app/components/runtime/RuntimeInspector";
import { SimulationControls } from "@/app/components/runtime/SimulationControls";
import { SimulationStatus } from "@/app/components/runtime/SimulationStatus";

import { DecisionFlow } from "@/app/components/DecisionFlow";
import { DecisionSummary } from "@/app/components/DecisionSummary";
import { DecisionTrace } from "@/app/components/execution/DecisionTrace";
import { ExecutionMetadata } from "@/app/components/execution/ExecutionMetadata";
import { ExecutionHistory } from "@/app/components/execution/ExecutionHistory";

import { PolicyComparisonTable } from "@/app/components/analytics/PolicyComparisonTable";
import { DecisionTopologyChart } from "@/app/components/analytics/DecisionTopologyChart";
import { ConstraintIndicator } from "@/app/components/analytics/ConstraintIndicator";
import { SystemIntegrityPanel } from "@/app/components/analytics/SystemIntegrityPanel";
import { PolicyDivergenceExplorer } from "@/app/components/analytics/PolicyDivergenceExplorer";
import { DecisionSurface3D } from "@/app/components/analytics/DecisionSurface3D";

// Local Type Definitions for Stability
interface SystemResult {
  metadata?: {
    policyDecision: string;
    resolvedModel: string;
    projectedCost: number;
    tokenEstimate: number;
    reasoning: string[];
    constraintState?: string;
    retrievalUsed?: boolean;
  };
  comparisons?: ComparisonResult[];
  topology?: DecisionTopology;
  response?: string;
}

interface ComparisonResult {
  strategy: "threshold" | "costAware" | "retrievalWeighted";
  policyDecision: string;
  projectedCost: number;
  tokenEstimate: number;
  constraintState?: string;
  resolvedModel?: string;
}

interface DecisionTopology {
  regions: any[];
  divergencePoint?: number;
}

interface HistoryEntry {
  id: number;
  model: string;
  cost: number;
  tokens: number;
  strategy: string;
  timestamp: string;
}

export default function ArchitecturePage() {
  const [executionResult, setExecutionResult] = useState<SystemResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [simMetadata, setSimMetadata] = useState<{ time: string; policy: string } | null>(null);

  const handleNewResult = useCallback((result: SystemResult) => {
    setExecutionResult(result);

    // Extract metadata for history
    if (result.metadata) {
      const newEntry: HistoryEntry = {
        id: history.length + 1,
        model: result.metadata.resolvedModel,
        cost: result.metadata.projectedCost,
        tokens: result.metadata.tokenEstimate,
        strategy: result.response?.split('Policy: ')[1]?.split('.')[0] || 'unknown',
        timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false })
      };

      setHistory(prev => [newEntry, ...prev].slice(0, 50));
    }
  }, [history.length]);

  /**
   * Executes a policy-driven simulation based on current workspace parameters.
   * Communicates strictly with /api/run to maintain architectural boundaries.
   */
  const handleSimulation = useCallback(async (config: {
    complexity: number;
    budget: number;
    retrieval: boolean;
    strategy: string;
  }) => {
    // Construct simulation payload
    const payload = {
      message: "System simulation probe: Automated boundary analysis.",
      complexity: config.complexity,
      retrievalEnabled: config.retrieval,
      strategy: config.strategy,
      budgetLimit: config.budget,
      compare: true // Enable multi-policy comparison for the explorer views
    };

    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Update shared execution state across dashboard components
        setExecutionResult(data);

        // Update simulation status metadata
        const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
        setSimMetadata({
          time: timestamp,
          policy: data.metadata?.policyDecision || config.strategy
        });

        // Log successful simulation event to history if metadata is present
        if (data.metadata) {
          const newEntry: HistoryEntry = {
            id: history.length + 1,
            model: data.metadata.resolvedModel,
            cost: data.metadata.projectedCost,
            tokens: data.metadata.tokenEstimate,
            strategy: data.metadata.policyDecision || 'simulation',
            timestamp: timestamp
          };
          setHistory(prev => [newEntry, ...prev].slice(0, 50));
        }
      }
    } catch (error) {
      // Deterministic error handling for simulation failures
      console.error("SIMULATION_ERROR: Communication link severed during probe.");
    }
  }, [history.length]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-16 px-6 lg:px-12 selection:bg-indigo-500/30">
      {/* Background Effect */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(51,65,85,0.15)_0%,rgba(2,6,23,1)_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeader
            title="Cognitive Engine Explorer"
            subtitle="Deterministic Policy-Driven Architecture & Topology Inspection"
          />
          <SimulationStatus
            isActive={!!executionResult?.topology}
            lastExecutionTime={simMetadata?.time}
            activePolicy={simMetadata?.policy}
          />
        </header>

        {/* Main Section Stack */}
        <main className="space-y-16">

          {/* SYSTEM OVERVIEW */}
          <section>
            <h2 className="text-xs tracking-widest text-slate-400 mb-3 uppercase">SYSTEM OVERVIEW</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-6">
                <ArchitectureStack />
                <Card className="border-slate-800/50 bg-slate-900/20">
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    The architecture employs a strictly isolated, layered approach where each tier maintains its own deterministic state and boundary constraints.
                  </p>
                </Card>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <ConstraintIndicator label="System Lock Integrity" satisfied={true} />
                  <ConstraintIndicator metadata={executionResult?.metadata} />
                </div>
              </div>
            </div>
          </section>

          {/* EXECUTION CONTROLS */}
          <section>
            <h2 className="text-xs tracking-widest text-slate-400 mb-3 uppercase">EXECUTION CONTROLS</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-6">
                <RuntimeInspector onResult={handleNewResult} />
              </div>
              <div className="space-y-6">
                <SimulationControls onUpdate={handleSimulation} />
              </div>
            </div>
          </section>

          {/* DECISION ANALYSIS */}
          <section>
            <h2 className="text-xs tracking-widest text-slate-400 mb-3 uppercase">DECISION ANALYSIS</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-6">
                <DecisionSummary data={executionResult?.metadata ? {
                  resolvedModel: executionResult.metadata.resolvedModel,
                  policyDecision: executionResult.metadata.policyDecision,
                  projectedCost: executionResult.metadata.projectedCost,
                  tokenEstimate: executionResult.metadata.tokenEstimate,
                  constraintState: executionResult.metadata.constraintState || 'SATISFIED',
                  retrievalUsed: executionResult.metadata.retrievalUsed || false
                } : undefined} />
                <DecisionFlow />
              </div>
              <div className="space-y-6">
                <DecisionTrace
                  reasoning={executionResult?.metadata?.reasoning}
                  finalModel={executionResult?.metadata?.resolvedModel || executionResult?.metadata?.policyDecision}
                />
                <ExecutionMetadata data={executionResult?.metadata ? {
                  policyDecision: executionResult.metadata.policyDecision,
                  resolvedModel: executionResult.metadata.resolvedModel,
                  projectedCost: executionResult.metadata.projectedCost,
                  tokenEstimate: executionResult.metadata.tokenEstimate,
                  constraintState: executionResult.metadata.constraintState || 'SATISFIED'
                } : undefined} />
              </div>
            </div>
          </section>

          {/* SYSTEM ANALYTICS */}
          <section>
            <h2 className="text-xs tracking-widest text-slate-400 mb-3 uppercase">SYSTEM ANALYTICS</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-6">
                <PolicyComparisonTable comparisonResults={executionResult?.comparisons || []} />
                <ExecutionHistory history={history} />
                <SystemIntegrityPanel />
              </div>
              <div className="space-y-6">
                <DecisionTopologyChart data={executionResult?.topology} />
                <PolicyDivergenceExplorer data={executionResult?.topology} />
                <DecisionSurface3D data={executionResult?.topology} />
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
