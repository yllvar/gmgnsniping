"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useApiMutation } from "@/hooks/use-api"
import { Zap, CheckCircle, XCircle, RefreshCw, ExternalLink } from "lucide-react"

interface TradeResult {
  success: boolean
  signature?: string
  error?: string
  details?: {
    liquidity: number
    devHoldings: number
  }
}

export function GMGNApiTest() {
  const [tokenAddress, setTokenAddress] = useState("")
  const [amount, setAmount] = useState("0.1")
  const [slippage, setSlippage] = useState("50")
  const [lastResult, setLastResult] = useState<TradeResult | null>(null)
  const { toast } = useToast()

  const { mutate: executeTrade, loading: tradeLoading } = useApiMutation<TradeResult>("/api/trades/execute")

  const handleExecuteTrade = async () => {
    if (!tokenAddress || !amount) {
      toast({
        title: "Missing Information",
        description: "Please provide both token address and amount",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await executeTrade({
        tokenAddress,
        amount: Number.parseFloat(amount),
        slippage: Number.parseFloat(slippage) / 100, // Convert percentage to decimal
      })

      setLastResult(result)

      if (result.success) {
        toast({
          title: "Trade Executed Successfully",
          description: `Transaction signature: ${result.signature?.slice(0, 8)}...`,
        })
      } else {
        toast({
          title: "Trade Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "API Error",
        description: "Failed to execute trade via GMGN API",
        variant: "destructive",
      })
    }
  }

  const popularTokens = [
    { name: "BONK", address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" },
    { name: "WIF", address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm" },
    { name: "MYRO", address: "HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Trade Execution Panel */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            GMGN API Test
          </CardTitle>
          <CardDescription className="text-gray-400">
            Test trading functionality using GMGN's Solana Trading API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-white">Token Address</Label>
            <Input
              placeholder="Enter token contract address..."
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Amount (SOL)</Label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Slippage (%)</Label>
              <Input
                type="number"
                step="1"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <Separator className="bg-gray-600" />

          <div className="space-y-3">
            <Label className="text-white">Popular Tokens (Click to use)</Label>
            <div className="flex flex-wrap gap-2">
              {popularTokens.map((token) => (
                <Button
                  key={token.address}
                  variant="outline"
                  size="sm"
                  onClick={() => setTokenAddress(token.address)}
                  className="text-xs"
                >
                  {token.name}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleExecuteTrade}
            disabled={tradeLoading || !tokenAddress || !amount}
            className="w-full flex items-center gap-2"
            size="lg"
          >
            {tradeLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {tradeLoading ? "Executing Trade..." : "Execute Trade"}
          </Button>

          <div className="text-xs text-gray-400 space-y-1">
            <p>• This uses GMGN's official API endpoints</p>
            <p>• Minimum priority fee: 0.002 SOL</p>
            <p>• Trades are executed on Solana mainnet</p>
          </div>
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">API Response</CardTitle>
          <CardDescription className="text-gray-400">Latest trade execution result</CardDescription>
        </CardHeader>
        <CardContent>
          {lastResult ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {lastResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <Badge
                  variant={lastResult.success ? "default" : "destructive"}
                  className={
                    lastResult.success
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }
                >
                  {lastResult.success ? "Success" : "Failed"}
                </Badge>
              </div>

              {lastResult.success && lastResult.signature && (
                <div className="space-y-2">
                  <Label className="text-white">Transaction Signature</Label>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-700 px-2 py-1 rounded text-xs text-green-400 flex-1">
                      {lastResult.signature}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`https://solscan.io/tx/${lastResult.signature}`, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {lastResult.error && (
                <div className="space-y-2">
                  <Label className="text-white">Error Message</Label>
                  <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                    <p className="text-red-400 text-sm">{lastResult.error}</p>
                  </div>
                </div>
              )}

              {lastResult.details && (
                <div className="space-y-2">
                  <Label className="text-white">Token Details</Label>
                  <div className="bg-gray-700/50 rounded p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Liquidity:</span>
                      <span className="text-white">{lastResult.details.liquidity.toFixed(2)} SOL</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Dev Holdings:</span>
                      <span className="text-white">{lastResult.details.devHoldings.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No trade executed yet</p>
              <p className="text-sm text-gray-500 mt-2">Execute a trade to see the API response</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
