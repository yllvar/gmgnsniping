"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, TrendingUp, TrendingDown } from "lucide-react"
import type { SimulationTrade } from "@/hooks/use-simulation"

interface SimulationTradesProps {
  trades: SimulationTrade[]
}

export function SimulationTrades({ trades }: SimulationTradesProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Trades
        </CardTitle>
        <CardDescription className="text-gray-400">Latest simulated trading activity</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {trades.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No trades executed yet</p>
              <p className="text-sm text-gray-500 mt-2">Start simulation to see trading activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {trades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {trade.tokenName.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{trade.tokenName}</h3>
                        <Badge
                          variant={
                            trade.status === "completed"
                              ? "default"
                              : trade.status === "failed"
                                ? "destructive"
                                : "secondary"
                          }
                          className={
                            trade.status === "completed"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : trade.status === "failed"
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          }
                        >
                          {trade.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(trade.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{trade.amount.toFixed(3)} SOL</span>
                      {trade.profit !== 0 &&
                        (trade.profit > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        ))}
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        trade.profit > 0 ? "text-green-400" : trade.profit < 0 ? "text-red-400" : "text-gray-400"
                      }`}
                    >
                      {trade.profit !== 0 && (trade.profit > 0 ? "+" : "")}
                      {trade.profit.toFixed(3)} SOL
                    </div>
                    <div
                      className={`text-xs ${
                        trade.profitPercent > 0
                          ? "text-green-400"
                          : trade.profitPercent < 0
                            ? "text-red-400"
                            : "text-gray-400"
                      }`}
                    >
                      {trade.profitPercent !== 0 && (trade.profitPercent > 0 ? "+" : "")}
                      {trade.profitPercent.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
