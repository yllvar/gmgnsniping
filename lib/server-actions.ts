import "server-only"

// Server-only functions that can access environment variables
export async function getBotStatus() {
  try {
    // This runs on the server and can access environment variables
    const walletAddress = process.env.WALLET_ADDRESS || "Not configured"

    return {
      isRunning: false,
      lastActivity: new Date().toISOString(),
      walletAddress,
      walletBalance: 0,
      activePositions: 0,
      totalTrades: 0,
      successfulTrades: 0,
      totalProfit: 0,
      totalVolume: 0,
      avgProfitPerTrade: 0,
      winRate: 0,
      todayTrades: 0,
      todayProfit: 0,
    }
  } catch (error) {
    console.error("Error getting bot status:", error)
    return {
      isRunning: false,
      lastActivity: new Date().toISOString(),
      walletAddress: "Error loading",
      walletBalance: 0,
      activePositions: 0,
      totalTrades: 0,
      successfulTrades: 0,
      totalProfit: 0,
      totalVolume: 0,
      avgProfitPerTrade: 0,
      winRate: 0,
      todayTrades: 0,
      todayProfit: 0,
    }
  }
}
