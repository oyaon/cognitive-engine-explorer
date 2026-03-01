import { SystemInput } from "./types"

/**
 * Assembles a structured prompt string.
 * @param input - System input containing message and retrieval status.
 */
export function assemblePrompt(input: SystemInput): string {
    const systemPrompt = "System:\n\"You are a structured AI assistant.\"\n\n"
    const retrievalInfo = input.retrievalEnabled
        ? "Retrieval is enabled. Use external knowledge context if available."
        : "Respond using only internal reasoning."

    return `${systemPrompt}${retrievalInfo}\n\nUser:\n${input.message}`
}
