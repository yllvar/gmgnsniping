import { NextResponse } from "next/server"
import { getBotConfig, updateBotConfig } from "@/lib/bot-service"

export async function GET() {
  try {
    const config = await getBotConfig()
    return NextResponse.json({
      config,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching bot config:", error)
    return NextResponse.json({ error: "Failed to fetch bot config" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const config = await request.json()

    const updatedConfig = await updateBotConfig(config)

    return NextResponse.json({
      success: true,
      config: updatedConfig,
      message: "Bot configuration updated",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating bot config:", error)
    return NextResponse.json({ error: "Failed to update bot config" }, { status: 500 })
  }
}

// Mark as dynamic to prevent static generation issues
export const dynamic = "force-dynamic"
