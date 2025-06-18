"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BarChart3 } from "lucide-react"

const data = [
  { hour: "00", volume: 12.5, trades: 3 },
  { hour: "04", volume: 8.2, trades: 2 },
  { hour: "08", volume: 25.7, trades: 6 },
  { hour: "12", volume: 18.9, trades: 4 },
  { hour: "16", volume: 32.1, trades: 8 },
  { hour: "20", volume: 15.3, trades: 3 },
]

export function TradeVolumeChart() {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          Trading Volume
        </CardTitle>
        <CardDescription className="text-gray-400">Hourly trading volume and trade count</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `${value}:00`} />
            <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `${value} SOL`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#F9FAFB",
              }}
              formatter={(value: number, name: string) => [
                name === "volume" ? `${value.toFixed(1)} SOL` : `${value} trades`,
                name === "volume" ? "Volume" : "Trades",
              ]}
            />
            <Bar dataKey="volume" fill="#3B82F6" radius={[4, 4, 0, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
