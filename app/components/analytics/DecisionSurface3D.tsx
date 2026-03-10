"use client";

import { useEffect, useRef, memo } from "react";
import { Card } from "../ui/Card";

/**
 * DecisionSurface3D component.
 * Renders an isometric 3D visualization of the policy decision landscape.
 * Projection: 
 *   X (Width) -> Complexity [0, 1]
 *   Y (Depth) -> Budget Pressure [0, 1]
 *   Z (Height) -> Model Tier [Fast (Low) | Balanced (High)]
 */

interface DecisionSurface3DProps {
    data?: {
        regions?: Array<{
            strategy: string;
            range: [number, number];
            decision: string;
        }>;
    };
}

export const DecisionSurface3D = memo(({ data }: DecisionSurface3DProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!data) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Constants for projection
        const GRID_SIZE = 15; // Number of segments
        const ISO_ANGLE = Math.PI / 6; // 30 degrees
        const RADIUS = 180;
        const SCALE_H = 40; // Max height for "Balanced" tier

        const render = () => {
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);

            ctx.save();
            ctx.translate(width / 2, height / 2 + 50);

            // Draw Grid from back to front
            for (let y = 0; y < GRID_SIZE; y++) {
                for (let x = 0; x < GRID_SIZE; x++) {
                    const complexity = x / (GRID_SIZE - 1);
                    const budget = y / (GRID_SIZE - 1);

                    // Determine "Height" (Model Tier) 
                    // Logic: Normally we'd sample real policies, but for visualization we'll 
                    // use a simplified "Balanced if complexity > 0.5 - budget*0.3" approximation
                    // or use the 'threshold' strategy from data as a reference.
                    let isBalanced = false;
                    if (data?.regions) {
                        const region = data.regions.find(r =>
                            r.strategy === 'threshold' &&
                            complexity >= r.range[0] &&
                            complexity <= r.range[1]
                        );
                        isBalanced = region?.decision === 'balanced';
                    } else {
                        // Fallback/Simulated shape
                        isBalanced = complexity > (0.6 - budget * 0.4);
                    }

                    const z = isBalanced ? -SCALE_H : 0;

                    // Projected coordinates
                    const px = (x - y) * Math.cos(ISO_ANGLE) * (RADIUS / GRID_SIZE);
                    const py = (x + y) * Math.sin(ISO_ANGLE) * (RADIUS / GRID_SIZE) + z;

                    // Point Color
                    const color = isBalanced ? '#6366f1' : '#38bdf8';

                    // Draw cell top (Polygon)
                    ctx.beginPath();

                    // Vertex calculation
                    const getPt = (ix: number, iy: number, iz: number) => {
                        return {
                            x: (ix - iy) * Math.cos(ISO_ANGLE) * (RADIUS / GRID_SIZE),
                            y: (ix + iy) * Math.sin(ISO_ANGLE) * (RADIUS / GRID_SIZE) + iz
                        };
                    };

                    const p1 = getPt(x, y, z);
                    const p2 = getPt(x + 1, y, z);
                    const p3 = getPt(x + 1, y + 1, z);
                    const p4 = getPt(x, y + 1, z);

                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.lineTo(p3.x, p3.y);
                    ctx.lineTo(p4.x, p4.y);
                    ctx.closePath();

                    ctx.fillStyle = `${color}${isBalanced ? '55' : '33'}`;
                    ctx.fill();
                    ctx.strokeStyle = `${color}88`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();

                    // Draw vertical edges if height exists
                    if (isBalanced) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p1.x, p1.y + SCALE_H);
                        ctx.strokeStyle = `${color}22`;
                        ctx.stroke();
                    }
                }
            }

            // Draw Axes
            ctx.beginPath();
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1;
            // X-AXIS (Complexity)
            ctx.moveTo(0, 0); ctx.lineTo(RADIUS * Math.cos(ISO_ANGLE), RADIUS * Math.sin(ISO_ANGLE));
            // Y-AXIS (Budget)
            ctx.moveTo(0, 0); ctx.lineTo(-RADIUS * Math.cos(ISO_ANGLE), RADIUS * Math.sin(ISO_ANGLE));
            ctx.stroke();

            // Labels
            ctx.font = '8px monospace';
            ctx.fillStyle = '#64748b';
            ctx.fillText('COMPLEXITY →', RADIUS * Math.cos(ISO_ANGLE) + 10, RADIUS * Math.sin(ISO_ANGLE));
            ctx.fillText('← BUDGET PRESSURE', -RADIUS * Math.cos(ISO_ANGLE) - 80, RADIUS * Math.sin(ISO_ANGLE));

            ctx.restore();
        };

        render();
    }, [data]);

    if (!data) {
        return (
            <Card className="flex flex-col items-center justify-center h-[400px] border-slate-800 bg-slate-950/20 p-6 text-center text-slate-400 text-sm">
                <p>No execution data yet.</p>
                <p>Run a simulation to generate results.</p>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col border-slate-800 bg-slate-950/40 p-0 overflow-hidden h-[400px]">
            <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/30 flex justify-between items-center">
                <div className="flex flex-col" title="Visualizes performance boundaries across complexity and budget.">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Decision Landscape 3D</h3>
                    <span className="text-[8px] text-slate-400 font-mono mt-0.5">TOPOLOGY_ISOMETRIC_RENDER</span>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-sm bg-sky-400/50 border border-sky-400" />
                        <span className="text-[9px] text-slate-400 uppercase font-mono">Fast</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-sm bg-indigo-500/50 border border-indigo-500" />
                        <span className="text-[9px] text-slate-400 uppercase font-mono">Balanced</span>
                    </div>
                </div>
            </div>
            <div className="relative flex-1 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0.4)_0%,transparent_100%)]">
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={350}
                    className="w-full h-full cursor-default"
                />

                {/* Overlay Metadata */}
                <div className="absolute bottom-4 left-6 flex flex-col gap-1 text-[8px] font-mono text-slate-400 uppercase">
                    <span>Z: Model_Resolution</span>
                    <span>X: Input_Complexity</span>
                    <span>Y: Budget_Constraint</span>
                </div>
            </div>
        </Card>
    );
});
