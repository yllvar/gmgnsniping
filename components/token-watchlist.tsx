"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react"

interface WatchedToken {
  id: string
  name: string
  address: string
  price: number
  change24h: number
  liquidity: number
  marketCap: number
  holders: number
  isEligible: boolean
}

const mockTokens: WatchedToken[] = [
  {
    id: "1",
    name: "BONK",
    address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    price: 0.000012,
    change24h: 15.6,
    liquidity: 245.8,
    marketCap: 890000,
    holders: 12450,
    isEligible: true,
  },
  {
    id: "2",
    name: "MYRO",
    address: "HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4",
    price: 0.045,
    change24h: -8.2,
    liquidity: 156.3,
    marketCap: 450000,
    holders: 8920,
    isEligible: true,
  },
  {
    id: "3",
    name: "WIF",
    address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    price: 1.23,
    change24h: 22.4,
    liquidity: 89.7,
    marketCap: 1200000,
    holders: 15670,
    isEligible: false,
  },
]

export function TokenWatchlist() {
  const [tokens, setTokens] = useState<WatchedToken[]>(mockTokens)
  const [newTokenAddress, setNewTokenAddress] = useState("")

  const addToken = () => {
    if (newTokenAddress.trim()) {
      // In a real app, this would fetch token data from an API
      const newToken: WatchedToken = {
        id: Date.now().toString(),
        name: "NEW TOKEN",
        address: newTokenAddress,
        price: 0,
        change24h: 0,
        liquidity: 0,
        marketCap: 0,
        holders: 0,
        isEligible: false,
      }
      setTokens([...tokens, newToken])
      setNewTokenAddress("")
    }
  }

  const removeToken = (id: string) => {
    setTokens(tokens.filter((token) => token.id !== id))
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Token Watchlist
        </CardTitle>
        <CardDescription className="text-gray-400">Monitor potential trading opportunities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Token */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter token address..."
            value={newTokenAddress}
            onChange={(e) => setNewTokenAddress(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <Button onClick={addToken} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        {/* Token List */}
        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {tokens.map((token) => (
              <div
                key={token.id}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {token.name.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{token.name}</h3>
                      <Badge
                        variant={token.isEligible ? "default" : "secondary"}
                        className={
                          token.isEligible
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                        }
                      >
                        {token.isEligible ? "Eligible" : "Not Eligible"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">
                      {token.address.slice(0, 8)}...{token.address.slice(-8)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">${token.price.toFixed(6)}</span>
                    {token.change24h !== 0 &&
                      (token.change24h > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      ))}
                  </div>
                  <div
                    className={`text-sm ${
                      token.change24h > 0 ? "text-green-400" : token.change24h < 0 ? "text-red-400" : "text-gray-400"
                    }`}
                  >
                    {token.change24h > 0 ? "+" : ""}
                    {token.change24h.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">Liq: {token.liquidity.toFixed(1)} SOL</div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeToken(token.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
