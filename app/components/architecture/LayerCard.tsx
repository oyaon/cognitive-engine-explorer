"use client";


import { Card } from '../ui/Card';

interface LayerCardProps {
    name: string;
    description: string;
    status: 'active' | 'idle' | 'warning';
}

export const LayerCard = ({ name, description, status }: LayerCardProps) => {
    const statusColor = {
        active: 'bg-emerald-500',
        idle: 'bg-slate-500',
        warning: 'bg-amber-500'
    };

    return (
        <Card className="group hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <h4 className="text-md font-bold text-white">{name}</h4>
                <div className={`w-2 h-2 rounded-full ${statusColor[status]} animate-pulse`} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {description}
            </p>
            <div className="flex gap-2">
                <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${statusColor[status]} w-2/3`} />
                </div>
            </div>
        </Card>
    );
};
