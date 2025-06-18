import { NextResponse } from "next/server"
import { executeTrade, checkTokenEligibility } from "@/lib/bot-service"

export async function POST(request: Request) {
  try {
    const { tokenAddress, amount, slippage } = await request.json()

    if (!tokenAddress || !amount) {
      return NextResponse.json({ error: "Token address and amount are required" }, { status: 400 })
    }

    // Check token eligibility first
    const eligibility = await checkTokenEligibility(tokenAddress)

    if (!eligibility.eligible) {
      return NextResponse.json(
        {
          error: "Token not eligible for trading",
          details: {
            liquidity: eligibility.liquidity,
            devHoldings: eligibility.devHoldings,
          },
        },
        { status: 400 },
      )
    }

    // Execute the trade
    const signature = await executeTrade(tokenAddress, amount, slippage || 0.5)

    if (signature) {
      return NextResponse.json({
        success: true,
        signature,
        message: "Trade executed successfully",
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json({ error: "Trade execution failed" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error executing trade:", error)
    return NextResponse.json({ error: "Failed to execute trade" }, { status: 500 })
  }
}

// Mark as dynamic to prevent static generation issues
export const dynamic = "force-dynamic"
