"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Premium Landing Page for Cognitive Engine Explorer.
 * Designed with a high-contrast, professional aesthetic.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-zinc-800 flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background radial gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(24,24,27,1)_0%,rgba(9,9,11,1)_100%)] pointer-events-none" />

      <main className="relative z-10 max-w-4xl w-full text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-medium text-zinc-400 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse" />
          v1.0.0-alpha • Cognitive Engine
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8"
        >
          Explore the Architecture <br />
          <span className="text-zinc-500">of Intelligence.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          A high-fidelity inspection tools for layered AI orchestration.
          Deconstruct the cognitive stack from interface to execution.
        </motion.p>

        {/* Call to Action Group */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/architecture"
            className="group relative h-14 w-full sm:w-auto px-10 flex items-center justify-center rounded-xl bg-white text-black font-semibold overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative">Launch Explorer</span>
          </Link>

          <a
            href="https://github.com/oyaon/cognitive-engine-explorer"
            className="h-14 w-full sm:w-auto px-10 flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 font-medium transition-colors hover:bg-zinc-900 hover:text-white"
          >
            GitHub Repository
          </a>
        </motion.div>

        {/* Technical Footer Simulation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-24 pt-12 border-t border-zinc-900 flex flex-wrap justify-between gap-6 text-[10px] uppercase tracking-widest text-zinc-600 font-mono"
        >
          <span>{"// STACK: NEXT.JS • REACT • FRAMER-MOTION"}</span>
          <span>{"// STATUS: OPERATIONAL"}</span>
          <span>{"// LOG: SYSTEM_READY"}</span>
        </motion.div>
      </main>
    </div>
  );
}
