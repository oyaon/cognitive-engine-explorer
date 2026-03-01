import { runSystem } from "../runSystem"

console.log("--- Starting Engine Verification ---")

// Test 1: Simple input, low complexity, no retrieval
const test1 = {
    message: "Hello",
    complexity: 0.3,
    retrievalEnabled: false
}
console.log("\nTest 1 Result:")
console.log(JSON.stringify(runSystem(test1), null, 2))

// Test 2: Complex input, high complexity, retrieval enabled
const test2 = {
    message: "Explain quantum computing briefly.",
    complexity: 0.8,
    retrievalEnabled: true
}
console.log("\nTest 2 Result:")
console.log(JSON.stringify(runSystem(test2), null, 2))

console.log("\n--- Verification Complete ---")
