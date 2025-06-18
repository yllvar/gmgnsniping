import { NextResponse } from "next/server"
import { toggleBot, getBotStatus } from "@/lib/bot-service"

export async function POST(request: Request) {
  try {
    const { action } = await request.json()

    if (!action || !["start", "stop"].includes(action)) {
      return NextResponse.json({ error: "Invalid action. Must be 'start' or 'stop'" }, { status: 400 })
    }

    const result = await toggleBot(action)
    const status = await getBotStatus()

    return NextResponse.json({
      success: true,
      action,
      message: `Bot ${action}ed successfully`,
      status: status.isRunning,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error toggling bot:", error)
    return NextResponse.json({ error: "Failed to toggle bot" }, { status: 500 })
  }
}

// Mark as dynamic to prevent static generation issues
export const dynamic = "force-dynamic"
