"use client";

import { useState } from 'react';
import { Card } from '../ui/Card';
import { MessageInput } from './MessageInput';
import { ComplexitySlider } from './ComplexitySlider';
import { StrategySelector } from './StrategySelector';
import { RunButton } from './RunButton';
import { RetrievalToggle } from './RetrievalToggle';
import { CompareModeToggle } from './CompareModeToggle';

interface RuntimeInspectorProps {
    onResult?: (result: any) => void;
}

export const RuntimeInspector = ({ onResult }: RuntimeInspectorProps) => {
    // Input State
    const [message, setMessage] = useState('');
    const [complexity, setComplexity] = useState(0.5);
    const [retrievalEnabled, setRetrievalEnabled] = useState(true);
    const [strategy, setStrategy] = useState('threshold');
    const [compareMode, setCompareMode] = useState(false);

    // Execution State
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<string[]>([
        '[02:13:55] KERNEL_IDLE: Awaiting cognitive sequence...',
        '[02:13:55] SYSTEM_READY: Deterministic boundaries established.'
    ]);

    const addLog = (msg: string) => {
        const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
        setLogs(prev => [...prev, `[${timestamp}] ${msg}`].slice(-50));
    };

    const handleRun = async () => {
        if (!message.trim()) return;

        setIsRunning(true);
        addLog(`INITIATING_SEQUENCE: "${message.substring(0, 20)}..."`);

        try {
            const response = await fetch('/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    complexity,
                    retrievalEnabled,
                    strategy: compareMode ? undefined : strategy,
                    compare: compareMode
                })
            });

            const data = await response.json();

            if (response.ok) {
                addLog(`SEQUENCE_COMPLETE: ${compareMode ? 'MULTI_STRATEGY_SYNC' : 'SINGLE_PATH_RESOLVED'}`);
                if (!compareMode && data.metadata) {
                    addLog(`POLICY_DECISION: ${data.metadata.policyDecision.toUpperCase()}`);
                }
                if (onResult) onResult(data);
            } else {
                addLog(`SEQUENCE_FAILED: ${data.error || 'UNKNOWN_ERROR'}`);
            }
        } catch (err) {
            addLog(`NETWORK_ERROR: Communication link severed.`);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Log Monitor Section */}
            <Card className="font-mono text-[11px] border-slate-800 bg-slate-950/80">
                <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                    <span className="text-slate-500 uppercase tracking-tighter">System Log Monitor</span>
                    <span className={isRunning ? "text-amber-500 animate-pulse" : "text-emerald-500"}>
                        {isRunning ? 'EXECUTING' : 'IDLE'}
                    </span>
                </div>
                <div className="space-y-1 h-32 overflow-y-auto custom-scrollbar">
                    {logs.map((log, i) => (
                        <div key={i} className={log.includes('FAILED') || log.includes('ERROR') ? 'text-red-400' : 'text-slate-400'}>
                            {log}
                        </div>
                    ))}
                    {isRunning && <div className="text-white animate-pulse">{">_ PROCESSING_CORE_LOGIC..."}</div>}
                </div>
            </Card>

            {/* Control Panel Section */}
            <Card className="space-y-6 border-slate-800 bg-slate-900/40">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Execution Controls</h4>
                        <CompareModeToggle active={compareMode} onToggle={setCompareMode} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <StrategySelector
                            selected={strategy}
                            onSelect={setStrategy}
                            disabled={compareMode || isRunning}
                        />
                        <RetrievalToggle
                            enabled={retrievalEnabled}
                            onToggle={setRetrievalEnabled}
                            disabled={isRunning}
                        />
                    </div>

                    <ComplexitySlider
                        value={complexity}
                        onChange={setComplexity}
                        disabled={isRunning}
                    />

                    <MessageInput
                        value={message}
                        onChange={setMessage}
                        onRun={handleRun}
                        disabled={isRunning}
                    />

                    <RunButton
                        onClick={handleRun}
                        isLoading={isRunning}
                        disabled={!message.trim()}
                    />
                </div>
            </Card>
        </div>
    );
};
