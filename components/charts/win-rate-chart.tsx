"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Target } from "lucide-react"

const data = [
  { date: "Mon", winRate: 72, trades: 15 },
  { date: "Tue", winRate: 78, trades: 18 },
  { date: "Wed", winRate: 65, trades: 12 },
  { date: "Thu", winRate: 82, trades: 22 },
  { date: "Fri", winRate: 76, trades: 19 },
  { date: "Sat", winRate: 88, trades: 25 },
  { date: "Sun", winRate: 74, trades: 16 },
]

export function WinRateChart() {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          Weekly Win Rate Trend
        </CardTitle>
        <CardDescription className="text-gray-400">Success rate over the past 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="winRateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#F9FAFB",
              }}
              formatter={(value: number, name: string) => [
                name === "winRate" ? `${value}%` : `${value} trades`,
                name === "winRate" ? "Win Rate" : "Total Trades",
              ]}
            />
            <Area
              type="monotone"
              dataKey="winRate"
              stroke="#8B5CF6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#winRateGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
