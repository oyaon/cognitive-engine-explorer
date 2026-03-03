import { runSystem } from "../runSystem"

/**
 * Engine Verification Logic.
 * Inert unless called.
 */
export function runVerifyEngine() {
    const test1 = {
        message: "Hello",
        complexity: 0.3,
        retrievalEnabled: false
    }
    runSystem(test1)

    const test2 = {
        message: "Explain quantum computing briefly.",
        complexity: 0.8,
        retrievalEnabled: true
    }
    runSystem(test2)
}

