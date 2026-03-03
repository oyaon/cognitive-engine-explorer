import { runSystem } from "@/lib/system/runSystem"
import { comparePolicies } from "@/lib/system/comparePolicies"
import { SystemInput, PolicyStrategy } from "@/lib/system/types"

/**
 * Validation boundary + domain delegation.
 * Enforces strict input validation before executing domain logic.
 */
export async function POST(req: Request) {
    const body = await req.json()
    const { message, complexity, retrievalEnabled, compare, strategy } = body

    // Strict Validation
    const isBaseValid =
        typeof message === "string" && message.trim().length > 0 &&
        typeof complexity === "number" && !Number.isNaN(complexity) &&
        complexity >= 0 && complexity <= 1 &&
        typeof retrievalEnabled === "boolean"

    if (!isBaseValid) {
        return Response.json(
            { error: "Invalid input" },
            { status: 400 }
        )
    }

    // Optional validation for comparison/strategy
    if (compare !== undefined && typeof compare !== "boolean") {
        return Response.json({ error: "Invalid compare flag" }, { status: 400 })
    }

    const validStrategies: PolicyStrategy[] = ["threshold", "costAware", "retrievalWeighted"]
    if (strategy !== undefined && !validStrategies.includes(strategy)) {
        return Response.json({ error: "Invalid strategy" }, { status: 400 })
    }

    const input: SystemInput = {
        message,
        complexity,
        retrievalEnabled
    }

    // Comparison Mode
    if (compare === true) {
        const comparisons = comparePolicies(input, validStrategies)
        return Response.json({ comparisons }, { status: 200 })
    }

    // Single Logic Execution (Backward Compatible)
    const result = runSystem(input, strategy as PolicyStrategy | undefined)

    return Response.json(
        {
            response: result.response,
            metadata: result.metadata
        },
        { status: 200 }
    )
}
