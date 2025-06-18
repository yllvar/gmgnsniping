"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, ExternalLink, TrendingUp, TrendingDown } from "lucide-react"

interface Trade {
  id: string
  tokenName: string
  tokenAddress: string
  amount: number
  profit: number
  profitPercent: number
  timestamp: string
  status: "success" | "failed" | "pending"
  txHash: string
}

const mockTrades: Trade[] = [
  {
    id: "1",
    tokenName: "PEPE2.0",
    tokenAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    amount: 0.5,
    profit: 1.25,
    profitPercent: 250,
    timestamp: "2 minutes ago",
    status: "success",
    txHash: "5j7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9",
  },
  {
    id: "2",
    tokenName: "DOGE KILLER",
    tokenAddress: "9yKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    amount: 1.0,
    profit: -0.15,
    profitPercent: -15,
    timestamp: "5 minutes ago",
    status: "failed",
    txHash: "4i6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z",
  },
  {
    id: "3",
    tokenName: "MOON ROCKET",
    tokenAddress: "8zKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    amount: 0.75,
    profit: 0.45,
    profitPercent: 60,
    timestamp: "12 minutes ago",
    status: "success",
    txHash: "3h5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y",
  },
  {
    id: "4",
    tokenName: "SHIB ARMY",
    tokenAddress: "6xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    amount: 0.3,
    profit: 0.0,
    profitPercent: 0,
    timestamp: "18 minutes ago",
    status: "pending",
    txHash: "2g4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X",
  },
]

export function RecentTrades() {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Trades
        </CardTitle>
        <CardDescription className="text-gray-400">Latest trading activity and performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {mockTrades.map((trade) => (
              <div
                key={trade.id}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:bg-gray-700/70 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {trade.tokenName.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{trade.tokenName}</h3>
                      <Badge
                        variant={
                          trade.status === "success"
                            ? "default"
                            : trade.status === "failed"
                              ? "destructive"
                              : "secondary"
                        }
                        className={
                          trade.status === "success"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : trade.status === "failed"
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }
                      >
                        {trade.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">
                      {trade.tokenAddress.slice(0, 8)}...{trade.tokenAddress.slice(-8)}
                    </p>
                    <p className="text-xs text-gray-500">{trade.timestamp}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{trade.amount} SOL</span>
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
                    {trade.profitPercent}%
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={() => window.open(`https://solscan.io/tx/${trade.txHash}`, "_blank")}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
