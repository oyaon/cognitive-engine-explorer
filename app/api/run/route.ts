import { runSystem } from "@/lib/system/runSystem"
import { SystemInput } from "@/lib/system/types"

/**
 * Validation boundary + domain delegation.
 * Enforces strict input validation before executing domain logic.
 */
export async function POST(req: Request) {
    const body = await req.json()
    const { message, complexity, retrievalEnabled } = body

    // Strict Validation
    const isValid =
        typeof message === "string" && message.trim().length > 0 &&
        typeof complexity === "number" && !Number.isNaN(complexity) &&
        complexity >= 0 && complexity <= 1 &&
        typeof retrievalEnabled === "boolean"

    if (!isValid) {
        return Response.json(
            { error: "Invalid input" },
            { status: 400 }
        )
    }

    const input: SystemInput = {
        message,
        complexity,
        retrievalEnabled
    }

    const result = runSystem(input)

    return Response.json(
        {
            response: result.response,
            metadata: result.metadata
        },
        { status: 200 }
    )
}
