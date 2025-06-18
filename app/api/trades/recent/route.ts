import { NextResponse } from "next/server"
import { getRecentTrades } from "@/lib/bot-service"

export async function GET(request: Request) {
  try {
    // Parse URL parameters safely
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "20")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    const trades = await getRecentTrades(limit, offset)

    return NextResponse.json({
      trades,
      total: trades.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching recent trades:", error)
    return NextResponse.json({ error: "Failed to fetch recent trades" }, { status: 500 })
  }
}

// Mark as dynamic to prevent static generation issues
export const dynamic = "force-dynamic"
