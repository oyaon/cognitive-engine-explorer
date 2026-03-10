"use client";



interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    className?: string;
}

export const SectionHeader = ({ title, subtitle, className = "" }: SectionHeaderProps) => {
    return (
        <div className={`mb-8 ${className}`}>
            <h2 className="text-2xl font-bold tracking-tight text-slate-200">{title}</h2>
            {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
            <div className="h-px w-full bg-gradient-to-r from-slate-800 to-transparent mt-4" />
        </div>
    );
};
