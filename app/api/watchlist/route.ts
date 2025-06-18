import { NextResponse } from "next/server"
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/bot-service"

export async function GET() {
  try {
    const watchlist = await getWatchlist()
    return NextResponse.json({
      tokens: watchlist,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching watchlist:", error)
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { tokenAddress, tokenName } = await request.json()

    if (!tokenAddress) {
      return NextResponse.json({ error: "Token address is required" }, { status: 400 })
    }

    const token = await addToWatchlist(tokenAddress, tokenName)

    return NextResponse.json({
      success: true,
      token,
      message: "Token added to watchlist",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error adding to watchlist:", error)
    return NextResponse.json({ error: "Failed to add token to watchlist" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    // Parse URL parameters safely
    const url = new URL(request.url)
    const tokenId = url.searchParams.get("id")

    if (!tokenId) {
      return NextResponse.json({ error: "Token ID is required" }, { status: 400 })
    }

    await removeFromWatchlist(tokenId)

    return NextResponse.json({
      success: true,
      message: "Token removed from watchlist",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error removing from watchlist:", error)
    return NextResponse.json({ error: "Failed to remove token from watchlist" }, { status: 500 })
  }
}

// Mark as dynamic to prevent static generation issues
export const dynamic = "force-dynamic"
