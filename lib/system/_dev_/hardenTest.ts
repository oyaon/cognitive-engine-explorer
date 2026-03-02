import { calculateCost } from "./calculateCost"
import { routeModel } from "./routeModel"

console.log("--- Starting Hardening Logic Verification ---")

// Test precision
const c1 = calculateCost("balanced", "1234") // 1 token, rate 0.000006
console.log("Test 1 (Balanced, 4 chars):", JSON.stringify(c1))
if (c1.estimatedCost === 0.000006) console.log("PASSED: Precision stable.")

const c2 = calculateCost("fast", "12345678") // 2 tokens, rate 0.000002
console.log("Test 2 (Fast, 8 chars):", JSON.stringify(c2))
if (c2.estimatedCost === 0.000004) console.log("PASSED: Precision stable.")

// Test max(0)
const c3 = calculateCost("fast", "")
console.log("Test 3 (Empty message):", JSON.stringify(c3))
if (c3.tokensUsed === 0) console.log("PASSED: tokensUsed is 0.")

console.log("--- Hardening Logic Verification Complete ---")
