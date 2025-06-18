"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"
import type { SimulationTrade } from "@/hooks/use-simulation"

interface SimulationChartProps {
  trades: SimulationTrade[]
}

export function SimulationChart({ trades }: SimulationChartProps) {
  // Calculate cumulative profit over time
  const chartData = trades
    .slice()
    .reverse()
    .reduce((acc, trade, index) => {
      const cumulative = index === 0 ? trade.profit : acc[index - 1].cumulative + trade.profit
      acc.push({
        index: index + 1,
        profit: trade.profit,
        cumulative,
        timestamp: new Date(trade.timestamp).toLocaleTimeString(),
      })
      return acc
    }, [] as any[])

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Profit Curve
        </CardTitle>
        <CardDescription className="text-gray-400">Cumulative profit over simulation time</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="index" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `${value.toFixed(2)} SOL`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(3)} SOL`,
                  name === "cumulative" ? "Cumulative Profit" : "Trade Profit",
                ]}
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No trades yet</p>
              <p className="text-sm mt-2">Start simulation to see profit curve</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
