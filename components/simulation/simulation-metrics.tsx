"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target, BarChart3 } from "lucide-react"
import type { SimulationMetrics } from "@/hooks/use-simulation"

interface SimulationMetricsProps {
  metrics: SimulationMetrics | null
}

export function SimulationMetrics({ metrics }: SimulationMetricsProps) {
  if (!metrics) return null

  return (
    <div className="space-y-4">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance Metrics
          </CardTitle>
          <CardDescription className="text-gray-400">Real-time simulation statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Trades</span>
              <span className="font-semibold text-white">{metrics.totalTrades}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Win Rate</span>
              <div className="text-right">
                <span className="font-semibold text-blue-400">{metrics.winRate.toFixed(1)}%</span>
                <Progress value={metrics.winRate} className="w-20 h-2 mt-1" />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Avg Profit/Trade</span>
              <span className={`font-semibold ${metrics.avgProfitPerTrade >= 0 ? "text-green-400" : "text-red-400"}`}>
                {metrics.avgProfitPerTrade >= 0 ? "+" : ""}
                {metrics.avgProfitPerTrade.toFixed(3)} SOL
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Tokens Analyzed</span>
              <span className="font-semibold text-purple-400">{metrics.tokensAnalyzed}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Eligible Tokens</span>
              <span className="font-semibold text-green-400">{metrics.eligibleTokens}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Success Rate</span>
              <span className="font-semibold text-blue-400">
                {metrics.tokensAnalyzed > 0
                  ? ((metrics.eligibleTokens / metrics.tokensAnalyzed) * 100).toFixed(1)
                  : "0.0"}
                %
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Risk Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Max Drawdown</span>
            <span className="font-semibold text-red-400">-{metrics.maxDrawdown.toFixed(3)} SOL</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Sharpe Ratio</span>
            <span className="font-semibold text-yellow-400">{metrics.sharpeRatio.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Risk/Reward</span>
            <span className="font-semibold text-blue-400">1:2.5</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
