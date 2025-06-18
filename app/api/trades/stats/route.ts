import { NextResponse } from "next/server"
import { getTradeStats } from "@/lib/bot-service"

export async function GET(request: Request) {
  try {
    // Parse URL parameters safely
    const url = new URL(request.url)
    const period = url.searchParams.get("period") || "24h"

    const stats = await getTradeStats(period)

    return NextResponse.json({
      ...stats,
      period,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching trade stats:", error)
    return NextResponse.json({ error: "Failed to fetch trade stats" }, { status: 500 })
  }
}

// Mark as dynamic to prevent static generation issues
export const dynamic = "force-dynamic"
