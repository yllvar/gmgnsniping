import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock trending tokens data
    const mockTrendingData = {
      trending: [
        {
          address: "So11111111111111111111111111111111111111112",
          name: "Solana",
          symbol: "SOL",
          price: 25.67,
          priceChange24h: 5.23,
          volume24h: 125000,
          marketCap: 12500000,
        },
        {
          address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          name: "USD Coin",
          symbol: "USDC",
          price: 1.0,
          priceChange24h: 0.01,
          volume24h: 85000,
          marketCap: 25000000,
        },
      ],
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(mockTrendingData)
  } catch (error) {
    console.error("Market data fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}
