"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

const data = [
  { time: "00:00", profit: 0, cumulative: 0 },
  { time: "04:00", profit: 2.3, cumulative: 2.3 },
  { time: "08:00", profit: -0.5, cumulative: 1.8 },
  { time: "12:00", profit: 4.2, cumulative: 6.0 },
  { time: "16:00", profit: 1.8, cumulative: 7.8 },
  { time: "20:00", profit: 3.1, cumulative: 10.9 },
  { time: "24:00", profit: 2.4, cumulative: 13.3 },
]

export function ProfitChart() {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Profit Over Time
        </CardTitle>
        <CardDescription className="text-gray-400">24-hour profit tracking with cumulative gains</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `${value} SOL`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#F9FAFB",
              }}
              formatter={(value: number, name: string) => [
                `${value.toFixed(2)} SOL`,
                name === "profit" ? "Profit" : "Cumulative",
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
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#3B82F6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
