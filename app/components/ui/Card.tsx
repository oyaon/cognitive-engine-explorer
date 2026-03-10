"use client";


import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 shadow-sm ${className}`}
        >
            {children}
        </motion.div>
    );
};
