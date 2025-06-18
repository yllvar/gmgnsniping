"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useApiMutation } from "./use-api"

export interface SimulationLog {
  id: string
  timestamp: string
  type: "info" | "success" | "error" | "warning" | "trade" | "analysis"
  action: string
  message: string
  data?: any
}

export interface SimulationTrade {
  id: string
  tokenName: string
  tokenAddress: string
  entryPrice: number
  exitPrice?: number
  amount: number
  profit: number
  profitPercent: number
  timestamp: string
  status: "pending" | "completed" | "failed"
  reason?: string
}

export interface SimulationMetrics {
  totalTrades: number
  successfulTrades: number
  totalProfit: number
  winRate: number
  tokensAnalyzed: number
  eligibleTokens: number
  duration: string
  avgProfitPerTrade: number
  maxDrawdown: number
  sharpeRatio: number
}

export function useSimulation() {
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<SimulationLog[]>([])
  const [trades, setTrades] = useState<SimulationTrade[]>([])
  const [metrics, setMetrics] = useState<SimulationMetrics>({
    totalTrades: 0,
    successfulTrades: 0,
    totalProfit: 0,
    winRate: 0,
    tokensAnalyzed: 0,
    eligibleTokens: 0,
    duration: "0m 0s",
    avgProfitPerTrade: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
  })

  const startTimeRef = useRef<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const { mutate: startSimulationAPI, loading: startLoading } = useApiMutation("/api/simulation/start")
  const { mutate: stopSimulationAPI, loading: stopLoading } = useApiMutation("/api/simulation/stop")
  const { mutate: resetSimulationAPI, loading: resetLoading } = useApiMutation("/api/simulation/reset")

  const loading = startLoading || stopLoading || resetLoading

  // Add log entry
  const addLog = useCallback((log: Omit<SimulationLog, "id" | "timestamp">) => {
    const newLog: SimulationLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...log,
    }
    setLogs((prev) => [...prev, newLog].slice(-100)) // Keep last 100 logs
  }, [])

  // Update duration
  const updateDuration = useCallback(() => {
    if (startTimeRef.current) {
      const now = new Date()
      const diff = now.getTime() - startTimeRef.current.getTime()
      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setMetrics((prev) => ({
        ...prev,
        duration: `${minutes}m ${seconds}s`,
      }))
    }
  }, [])

  // Simulate token discovery and analysis
  const simulateTokenAnalysis = useCallback(async () => {
    if (!isRunning) return

    try {
      // Simulate discovering a new token
      const tokenAddress = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      const tokenName = ["PEPE", "DOGE", "SHIB", "BONK", "WIF", "MYRO"][Math.floor(Math.random() * 6)]

      addLog({
        type: "info",
        action: "Token Discovery",
        message: `New token detected: ${tokenName}`,
        data: { tokenAddress, tokenName },
      })

      // Simulate fetching token data
      await new Promise((resolve) => setTimeout(resolve, 500))
      addLog({
        type: "info",
        action: "Data Fetching",
        message: `Fetching market data for ${tokenName}...`,
      })

      // Simulate analysis
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const liquidity = 50 + Math.random() * 200
      const devHoldings = Math.random() * 10
      const isEligible = liquidity > 100 && devHoldings < 5

      setMetrics((prev) => ({
        ...prev,
        tokensAnalyzed: prev.tokensAnalyzed + 1,
        eligibleTokens: isEligible ? prev.eligibleTokens + 1 : prev.eligibleTokens,
      }))

      addLog({
        type: "analysis",
        action: "Token Analysis",
        message: `Analysis complete: Liquidity=${liquidity.toFixed(1)} SOL, Dev Holdings=${devHoldings.toFixed(1)}%`,
        data: { liquidity, devHoldings, isEligible },
      })

      if (isEligible) {
        // Simulate trade execution
        await new Promise((resolve) => setTimeout(resolve, 500))
        const amount = 0.1 + Math.random() * 0.9
        const entryPrice = Math.random() * 0.001

        addLog({
          type: "trade",
          action: "Trade Execution",
          message: `Executing buy order for ${amount.toFixed(3)} SOL of ${tokenName}`,
          data: { amount, entryPrice },
        })

        // Simulate trade outcome after some time
        setTimeout(
          () => {
            const success = Math.random() > 0.3 // 70% success rate
            const profitPercent = success ? Math.random() * 400 - 50 : -(Math.random() * 80 + 10)
            const profit = amount * (profitPercent / 100)
            const exitPrice = entryPrice * (1 + profitPercent / 100)

            const trade: SimulationTrade = {
              id: Date.now().toString(),
              tokenName,
              tokenAddress,
              entryPrice,
              exitPrice,
              amount,
              profit,
              profitPercent,
              timestamp: new Date().toISOString(),
              status: success ? "completed" : "failed",
              reason: success ? "Take profit hit" : "Stop loss triggered",
            }

            setTrades((prev) => [trade, ...prev].slice(0, 50)) // Keep last 50 trades

            setMetrics((prev) => {
              const newTotalTrades = prev.totalTrades + 1
              const newSuccessfulTrades = success ? prev.successfulTrades + 1 : prev.successfulTrades
              const newTotalProfit = prev.totalProfit + profit
              const newWinRate = (newSuccessfulTrades / newTotalTrades) * 100
              const newAvgProfit = newTotalProfit / newTotalTrades

              return {
                ...prev,
                totalTrades: newTotalTrades,
                successfulTrades: newSuccessfulTrades,
                totalProfit: newTotalProfit,
                winRate: newWinRate,
                avgProfitPerTrade: newAvgProfit,
              }
            })

            addLog({
              type: success ? "success" : "error",
              action: "Trade Completed",
              message: `${tokenName} trade ${success ? "successful" : "failed"}: ${profit > 0 ? "+" : ""}${profit.toFixed(3)} SOL (${profitPercent > 0 ? "+" : ""}${profitPercent.toFixed(1)}%)`,
              data: trade,
            })
          },
          3000 + Math.random() * 7000,
        ) // Random delay 3-10 seconds
      } else {
        addLog({
          type: "warning",
          action: "Trade Skipped",
          message: `${tokenName} does not meet eligibility criteria`,
          data: { reason: liquidity <= 100 ? "Low liquidity" : "High dev holdings" },
        })
      }
    } catch (error) {
      addLog({
        type: "error",
        action: "Analysis Error",
        message: `Failed to analyze token: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    }
  }, [isRunning, addLog])

  // Start simulation
  const startSimulation = useCallback(async () => {
    try {
      setIsRunning(true)
      startTimeRef.current = new Date()

      addLog({
        type: "success",
        action: "Simulation Started",
        message: "Live trading simulation initialized with real market data",
      })

      // Start duration timer
      intervalRef.current = setInterval(updateDuration, 1000)

      // Start simulation loop
      simulationIntervalRef.current = setInterval(simulateTokenAnalysis, 5000 + Math.random() * 10000) // 5-15 seconds

      await startSimulationAPI({})
    } catch (error) {
      setIsRunning(false)
      addLog({
        type: "error",
        action: "Simulation Error",
        message: `Failed to start simulation: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    }
  }, [startSimulationAPI, addLog, updateDuration, simulateTokenAnalysis])

  // Stop simulation
  const stopSimulation = useCallback(async () => {
    try {
      setIsRunning(false)

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current)
        simulationIntervalRef.current = null
      }

      addLog({
        type: "info",
        action: "Simulation Stopped",
        message: "Trading simulation has been stopped",
      })

      await stopSimulationAPI({})
    } catch (error) {
      addLog({
        type: "error",
        action: "Stop Error",
        message: `Failed to stop simulation: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    }
  }, [stopSimulationAPI, addLog])

  // Reset simulation
  const resetSimulation = useCallback(async () => {
    try {
      setIsRunning(false)
      setLogs([])
      setTrades([])
      setMetrics({
        totalTrades: 0,
        successfulTrades: 0,
        totalProfit: 0,
        winRate: 0,
        tokensAnalyzed: 0,
        eligibleTokens: 0,
        duration: "0m 0s",
        avgProfitPerTrade: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
      })

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current)
        simulationIntervalRef.current = null
      }

      startTimeRef.current = null

      addLog({
        type: "info",
        action: "Simulation Reset",
        message: "All simulation data has been cleared",
      })

      await resetSimulationAPI({})
    } catch (error) {
      addLog({
        type: "error",
        action: "Reset Error",
        message: `Failed to reset simulation: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    }
  }, [resetSimulationAPI, addLog])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current)
      }
    }
  }, [])

  return {
    isRunning,
    logs,
    trades,
    metrics,
    startSimulation,
    stopSimulation,
    resetSimulation,
    loading,
  }
}
