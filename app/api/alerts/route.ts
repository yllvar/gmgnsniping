import { NextResponse } from "next/server"
import { getAlerts, markAlertAsRead, markAllAlertsAsRead } from "@/lib/bot-service"

export async function GET() {
  try {
    const alerts = await getAlerts()
    return NextResponse.json({
      alerts,
      unreadCount: alerts.filter((alert) => !alert.isRead).length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { alertId, markAll } = await request.json()

    if (markAll) {
      await markAllAlertsAsRead()
    } else if (alertId) {
      await markAlertAsRead(alertId)
    } else {
      return NextResponse.json({ error: "Alert ID or markAll flag is required" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: markAll ? "All alerts marked as read" : "Alert marked as read",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating alerts:", error)
    return NextResponse.json({ error: "Failed to update alerts" }, { status: 500 })
  }
}

// Mark as dynamic to prevent static generation issues
export const dynamic = "force-dynamic"
