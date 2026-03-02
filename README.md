# Cognitive Engine Explorer

A high-fidelity inspection tool for deconstructing layered AI orchestration systems. This project provides a visual and interactive environment to explore how complex AI request lifecycles are managed across multiple architectural layers.

## 🏗️ Architecture: The Cognitive Stack

The system is organized into a vertical stack of six distinct layers, each with a specific responsibility in the request pipeline:

1.  **Interface Layer**: Entry point for API requests and user interaction state.
2.  **Orchestration Layer**: The "brain" of the system, coordinating data flow between layers.
3.  **Cognitive Control**: Semantic analysis and adaptive routing decisions.
4.  **Memory & Retrieval**: Vector similarity search and knowledge ingestion.
5.  **Execution Layer**: Model invocation (LLM) and deterministic cost computation.
6.  **Observability & Evolution**: Logging, metric tracking, and system telemetry.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm / yarn / pnpm

### Installation
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page, then navigate to `/architecture` to launch the explorer.

## 🛠️ Tech Stack
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Language**: TypeScript

## 🛡️ Design Philosophy
The explorer is built with **Architectural Discipline** in mind:
- **Deterministic Domain**: Core logic is side-effect free and isolated in `@/lib/system`.
- **Validation Boundaries**: Strict API input validation.
- **Visual Clarity**: High-fidelity UI that reflects the underlying system state.

---
Created by [oyaon](https://github.com/oyaon).
