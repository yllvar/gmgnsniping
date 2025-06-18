import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { address: string } }) {
  try {
    const { address } = params

    // Mock token data for testing
    const mockTokenData = {
      address,
      name: address === "So11111111111111111111111111111111111111112" ? "Solana" : "Unknown Token",
      symbol: address === "So11111111111111111111111111111111111111112" ? "SOL" : "UNK",
      price: Math.random() * 100,
      marketCap: Math.random() * 1000000,
      volume24h: Math.random() * 50000,
      priceChange24h: (Math.random() - 0.5) * 20,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(mockTokenData)
  } catch (error) {
    console.error("Token data fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch token data" }, { status: 500 })
  }
}
