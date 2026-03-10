"use client";

import { Card } from '../ui/Card';

interface LayerCardProps {
    name: string;
    description: string;
    status: 'active' | 'idle' | 'warning';
}

export const LayerCard = ({ name, description, status }: LayerCardProps) => {
    const statusDot = {
        active: 'bg-emerald-500',
        idle: 'bg-slate-400',
        warning: 'bg-amber-500'
    };
    const statusBar = {
        active: 'bg-emerald-500',
        idle: 'bg-slate-800',
        warning: 'bg-amber-500'
    };

    return (
        <Card className="group hover:border-slate-700 hover:bg-slate-800/50 transition-colors">
            <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-semibold text-slate-200">{name}</h4>
                <div className={`w-2 h-2 rounded-full ${statusDot[status]} animate-pulse`} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {description}
            </p>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${statusBar[status]} w-2/3 rounded-full`} />
            </div>
        </Card>
    );
};
