"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { routeModel } from "@/lib/system/routeModel";
import { calculateCost } from "@/lib/system/calculateCost";

const layers = [
  {
    id: "interface",
    title: "Interface Layer",
    description: "Handles user interaction and API entry.",
    archParagraph: "The Interface layer serves as the primary gateway for all user interactions. It manages state synchronization between the React frontend and the backend API routes, ensuring a seamless chat experience.",
    nodes: [
      {
        id: "chatUI",
        label: "chatUI",
        title: "Chat Interface Component",
        description: "Main React component for message rendering and user input.",
        code: "const ChatUI = () => {\n  const [input, setInput] = useState('');\n  return <Viewport messages={messages} />;\n};",
        signals: ["input_event: captured", "stream_state: active", "focus_lock: true"],
      },
      {
        id: "apiRoute",
        label: "apiRoute",
        title: "API Edge Route",
        description: "Serverless function handling incoming POST requests.",
        code: "export async function POST(req: Request) {\n  const body = await req.json();\n  return NextResponse.json({ status: 'ok' });\n}",
        signals: ["req_auth: verified", "latency: 42ms", "method: POST"],
      },
    ],
  },
  {
    id: "orchestration",
    title: "Orchestration Layer",
    description: "Coordinates the full request lifecycle.",
    archParagraph: "This layer acts as the system's brain, directing the flow of data between cognitive analysis and execution. It maintains the session context and manages the transition between different processing stages.",
    nodes: [
      {
        id: "runSystem",
        label: "runSystem()",
        title: "System Runner",
        description: "Core execution manager that initiates the processing pipeline.",
        code: "async function runSystem(context) {\n  await analyze(context);\n  return execute(context);\n}",
        signals: ["pipeline_id: 8b2f", "step: initialization", "priority: high"],
      },
      {
        id: "routeModel",
        label: "routeModel()",
        title: "Model Router",
        description: "Determines which specific model instance should handle the request.",
        code: "function routeModel(query) {\n  return query.isComplex ? 'gpt-4' : 'gpt-3.5-turbo';\n}",
        signals: ["route_decision: deep_seek", "confidence: 0.98", "load_balance: 0.12"],
      },
      {
        id: "assemblePrompt",
        label: "assemblePrompt()",
        title: "Prompt Assembler",
        description: "Combines system instructions, context, and user input.",
        code: "function assemblePrompt(nodes) {\n  return nodes.map(n => n.content).join('\\n---\\n');\n}",
        signals: ["tokens: 1240", "template_id: chatbot_v2", "context_window: 8k"],
      },
    ],
  },
  {
    id: "cognitive",
    title: "Cognitive Control Layer",
    description: "Performs query analysis and adaptive routing decisions.",
    archParagraph: "The Cognitive Control layer uses semantic analysis to understand user intent. It filters queries and prepares the retrieval strategy to optimize for accuracy and relevance.",
    nodes: [
      {
        id: "analyzeQuery",
        label: "analyzeQuery()",
        title: "Semantic Analyzer",
        description: "Extracts entities and intent from the raw input string.",
        code: "async function analyzeQuery(text) {\n  return await nlp.parse(text);\n}",
        signals: ["intent: technical_depth", "entities: [\"React\", \"Rust\"]", "sentiment: neutral"],
      },
      {
        id: "routeModel_cog",
        label: "routeModel()",
        title: "Adaptive Router",
        description: "Refines routing decisions based on cognitive load analysis.",
        code: "function adaptiveRoute(metrics) {\n  return metrics.complexity > 0.8 ? 'pro' : 'base';\n}",
        signals: ["load_index: 0.45", "cache_hit: false", "fallback: none"],
      },
    ],
  },
  {
    id: "memory",
    title: "Memory & Retrieval Layer",
    description: "Manages knowledge ingestion and vector similarity search.",
    archParagraph: "This layer provides persistence and context. It utilizes vector embedding models to perform similarity searches across large datasets, bringing relevant information into the active context.",
    nodes: [
      {
        id: "ingestContent",
        label: "ingestContent()",
        title: "Inclusion Engine",
        description: "Processes and chunks new data for vector storage.",
        code: "function ingest(doc) {\n  const chunks = split(doc);\n  return vectorDb.upsert(chunks);\n}",
        signals: ["write_speed: 1.2MB/s", "chunk_count: 14", "db_status: healthy"],
      },
      {
        id: "retrieveChunks",
        label: "retrieveChunks()",
        title: "Vector Retriever",
        description: "Queries the vector database for top-k similar documents.",
        code: "async function search(vector) {\n  return db.similaritySearch(vector, { k: 5 });\n}",
        signals: ["query_time: 18ms", "top_score: 0.92", "vector_dims: 1536"],
      },
    ],
  },
  {
    id: "execution",
    title: "Execution Layer",
    description: "Handles model invocation and cost computation.",
    archParagraph: "The execution layer interfaces with large language models to generate responses. It monitors token usage and execution time to maintain operational efficiency.",
    nodes: [
      {
        id: "callModel",
        label: "callModel()",
        title: "LLM Interface",
        description: "Executes the final call to the chosen language model API.",
        code: "async function call(prompt) {\n  return await openai.createChatCompletion(prompt);\n}",
        signals: ["status_code: 200", "ttfb: 450ms", "total_tokens: 156"],
      },
      {
        id: "calculateCost",
        label: "calculateCost()",
        title: "Cost Monitor",
        description: "Real-time tracking of financial impact based on token usage.",
        code: "function getCost(usage) {\n  return usage.total * rates.current;\n}",
        signals: ["est_cost: $0.0031", "budget_remaining: $45.20", "threshold: ok"],
      },
    ],
  },
  {
    id: "observability",
    title: "Observability & Evolution Layer",
    description: "Logs runtime metrics and supports system refinement.",
    archParagraph: "This layer ensures system health through comprehensive logging and metric tracking. It provides the data necessary for continuous improvement and error tracing.",
    nodes: [
      {
        id: "logRun",
        label: "logRun()",
        title: "System Logger",
        description: "Captures full request/response cycles for audit and debugging.",
        code: "function log(entry) {\n  cloudWatch.putLogs(entry);\n}",
        signals: ["log_level: info", "storage: s3", "retention: 30d"],
      },
      {
        id: "trackTokens",
        label: "trackTokens()",
        title: "Usage Tracker",
        description: "Aggregates token consumption across all system components.",
        code: "function track(id, count) {\n  redis.incrBy(`usage:${id}`, count);\n}",
        signals: ["daily_total: 42k", "peak_usage: 120/min", "quota_status: 12%"],
      },
    ],
  },
];

export default function ArchitecturePage() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const layerThemeMap: Record<string, string> = {
    interface: "border-gray-300",
    orchestration: "border-slate-400",
    cognitive: "border-indigo-400",
    memory: "border-teal-400",
    execution: "border-amber-400",
    observability: "border-violet-400",
  };

  const [complexity, setComplexity] = useState(0.45);
  const [retrievalEnabled, setRetrievalEnabled] = useState(true);

  // Sync with domain logic
  const selectedModelTier = routeModel(complexity);
  const { estimatedCost } = calculateCost(selectedModelTier, "simulation_placeholder"); // Using a placeholder for stable length

  const toggleLayer = (id: string) => {
    setActiveLayer(activeLayer === id ? null : id);
    setActiveNode(null);
  };

  const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setActiveNode(nodeId);
  };

  const currentLayer = layers.find((l) => l.id === activeLayer);
  const currentNode = currentLayer?.nodes.find((n) => n.id === activeNode);

  return (
    <div className="min-h-screen max-w-6xl mx-auto py-16 px-6">
      {/* Header Section */}
      <header className="mb-16">
        <h1 className="text-4xl font-semibold tracking-tight">
          Cognitive Engine Explorer
        </h1>
        <p className="text-sm text-gray-500 mt-3">
          Interactive inspection of a layered AI system architecture.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left Section (Cognitive Stack) */}
        <section className={`lg:col-span-3 rounded-2xl border shadow-sm p-8 transition-colors duration-200 ${activeLayer ? layerThemeMap[activeLayer] : "border-gray-200 dark:border-gray-700"
          }`}>
          <h2 className="text-xl font-semibold text-zinc-900 mb-6">Cognitive Stack</h2>
          <div className="space-y-6">
            {layers.map((layer) => {
              const isActive = activeLayer === layer.id;
              return (
                <div
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={`cursor-pointer rounded-2xl border transition-colors duration-200 bg-white dark:bg-gray-900 p-6 shadow-sm ${isActive && !(layer.id === "memory" && !retrievalEnabled)
                    ? "border-gray-400 dark:border-gray-500"
                    : "border-gray-200 dark:border-gray-700"
                    } ${layer.id === "memory" && !retrievalEnabled ? "opacity-50" : ""}`}
                >
                  <h3 className="text-xl font-semibold">{layer.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {layer.description}
                  </p>
                  {layer.id === "execution" && (
                    <p className="text-xs text-gray-400 mt-2">
                      Active Tier: {selectedModelTier}
                    </p>
                  )}

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.2,
                          ease: "easeInOut",
                        }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="space-y-3">
                            {layer.nodes.map((node) => (
                              <div
                                key={node.id}
                                onClick={(e) => handleNodeClick(e, node.id)}
                                className={`rounded-xl border p-3 text-sm font-mono cursor-pointer transition-colors duration-150 ${activeNode === node.id
                                  ? "border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-800"
                                  : "border-gray-200 dark:border-gray-700"
                                  }`}
                              >
                                {node.label}
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                            Internal components will be displayed here.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Section (Runtime Inspector) */}
        <aside className={`lg:col-span-2 rounded-2xl border bg-zinc-50/30 shadow-sm p-8 lg:sticky lg:top-24 transition-colors duration-200 ${activeLayer ? layerThemeMap[activeLayer] : "border-gray-200 dark:border-gray-700"
          }`}>
          <h2 className="text-xl font-semibold text-zinc-900 mb-6">Runtime Inspector</h2>

          <AnimatePresence mode="wait">
            {!activeLayer ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                Select a layer to inspect its internal architecture.
              </motion.p>
            ) : !activeNode ? (
              <motion.div
                key={`layer-${activeLayer}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <h3 className="text-lg font-semibold">{currentLayer?.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {currentLayer?.description}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                  {currentLayer?.archParagraph}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={`node-${activeNode}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <h3 className="text-lg font-semibold font-mono">{currentNode?.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {currentNode?.description}
                </p>

                <div className="mt-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 text-sm font-mono overflow-x-auto">
                  <pre><code>{currentNode?.code}</code></pre>
                </div>

                <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400 list-disc list-inside">
                  {currentNode?.signals.map((signal) => (
                    <li key={signal}>{signal}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold mb-4">
              Runtime Simulation
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={complexity}
                  onChange={(e) => setComplexity(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Complexity: {complexity.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="retrieval-toggle"
                  checked={retrievalEnabled}
                  onChange={(e) => setRetrievalEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="retrieval-toggle"
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer"
                >
                  Retrieval Enabled
                </label>
              </div>

              <div className="pt-4 space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Selected Model Tier: {selectedModelTier}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Estimated Cost: ${estimatedCost.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
