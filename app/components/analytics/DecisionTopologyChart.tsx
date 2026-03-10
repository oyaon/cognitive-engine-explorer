"use client";

import { useMemo, memo } from 'react';
import { Card } from '../ui/Card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

// Local Interface Redefinitions (Architectural Isolation)
interface DecisionRegion {
    complexityRange: [number, number];
    strategyDecisions: Record<string, {
        resolvedModel: string;
    }>;
}

interface DecisionTopology {
    regions: DecisionRegion[];
    divergencePoint?: number;
}

interface DecisionTopologyChartProps {
    data?: DecisionTopology;
}

const mapModelToValue = (model: string) => (model === 'balanced' ? 1 : 0);

/**
 * DecisionTopologyChart
 * Purely visual representation of policy behavior across complexity [0, 1].
 */
export const DecisionTopologyChart = memo(({ data }: DecisionTopologyChartProps) => {
    const chartData = useMemo(() => {
        if (!data || !data.regions || data.regions.length === 0) return [];

        interface ChartPoint {
            complexity: number;
            [key: string]: number;
        }

        const points: ChartPoint[] = [];

        data.regions.forEach((region: DecisionRegion) => {
            const [min, max] = region.complexityRange;

            // Helper to get decisions for all strategies in this region
            const getDecisions = () => {
                const results: ChartPoint = { complexity: min };
                Object.entries(region.strategyDecisions).forEach(([strategy, decision]) => {
                    results[strategy] = mapModelToValue(decision.resolvedModel);
                });
                return results;
            };

            // Start of region
            points.push({ ...getDecisions(), complexity: min });

            // End of region (to create step effect)
            points.push({ ...getDecisions(), complexity: max });
        });

        return points;
    }, [data]);

    if (!data) {
        return (
            <Card className="h-64 flex flex-col items-center justify-center border-slate-800 bg-slate-950/20 p-6 text-center text-slate-400 text-sm">
                <p>No execution data yet. Run a simulation.</p>
            </Card>
        );
    }

    return (
        <Card className="p-0 overflow-hidden border-slate-800/50">
            <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/30 flex justify-between items-center">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]" title="Maps behavior transition regions in policy execution.">Decision Topology Spectrum</h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-0.5 bg-sky-400" />
                        <span className="text-[9px] text-slate-400 uppercase font-mono">Threshold</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-0.5 bg-indigo-500" />
                        <span className="text-[9px] text-slate-400 uppercase font-mono">Cost Aware</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-0.5 bg-emerald-500" />
                        <span className="text-[9px] text-slate-400 uppercase font-mono">Retrieval</span>
                    </div>
                </div>
            </div>

            <div className="h-48 w-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis
                            dataKey="complexity"
                            type="number"
                            domain={[0, 1]}
                            tickCount={6}
                            tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }}
                            stroke="#475569"
                        />
                        <YAxis
                            domain={[0, 1.1]}
                            ticks={[0, 1]}
                            tickFormatter={(val) => (val === 1 ? 'BALANCED' : 'FAST')}
                            tick={{ fontSize: 8, fill: '#94a3b8', fontWeight: 'bold' }}
                            stroke="#475569"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#020617',
                                border: '1px solid #1e293b',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontFamily: 'monospace'
                            }}
                            itemStyle={{ padding: '0px' }}
                            labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                            labelFormatter={(val) => `COMPLEXITY: ${Number(val).toFixed(2)}`}
                        />

                        {/* Threshold Line */}
                        <Line
                            type="stepAfter"
                            dataKey="threshold"
                            stroke="#38bdf8"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: '#38bdf8' }}
                            isAnimationActive={false}
                        />

                        {/* Cost Aware Line */}
                        <Line
                            type="stepAfter"
                            dataKey="costAware"
                            stroke="#6366f1"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: '#6366f1' }}
                            isAnimationActive={false}
                        />

                        {/* Retrieval Weighted Line */}
                        <Line
                            type="stepAfter"
                            dataKey="retrievalWeighted"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: '#10b981' }}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="px-6 py-2 bg-slate-950/40 border-t border-slate-800/50 flex justify-between items-center">
                <span className="text-[9px] text-slate-400 font-mono uppercase tracking-tighter">
                    {data.divergencePoint !== undefined ? `DIVERGENCE_AT: ${data.divergencePoint}` : 'STABLE_TOPOLOGY'}
                </span>
                <span className="text-[9px] text-slate-400 font-mono uppercase tracking-tighter">
                    V2_PARTITIONS: {data.regions.length}
                </span>
            </div>
        </Card>
    );
});

