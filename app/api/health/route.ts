import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check environment variables
    const envStatus = {
      walletConfigured: !!process.env.WALLET_PRIVATE_KEY_ENCRYPTED,
      rpcConfigured: !!process.env.SOLANA_RPC,
      apiKeyConfigured: !!process.env.API_SECRET_KEY,
      encryptionKeyConfigured: !!process.env.ENCRYPTION_KEY,
    }

    const allConfigured = Object.values(envStatus).every(Boolean)

    return NextResponse.json({
      status: allConfigured ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      services: {
        environment: envStatus,
      },
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }
}

export const dynamic = "force-dynamic"
