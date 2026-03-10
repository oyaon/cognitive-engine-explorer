"use client";


import { motion } from 'framer-motion';

interface RunButtonProps {
    onClick: () => void;
    isLoading: boolean;
    disabled?: boolean;
}

export const RunButton = ({ onClick, isLoading, disabled }: RunButtonProps) => {
    return (
        <motion.button
            whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
            whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`w-full h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] ${isLoading || disabled
                ? 'bg-slate-800 text-slate-500 shadow-none cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    PROCESSING...
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                    EXECUTE SEQUENCE
                </>
            )}
        </motion.button>
    );
};
