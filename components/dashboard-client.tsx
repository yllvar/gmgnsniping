"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Activity, TrendingUp, Play, Pause, Target, Zap, Wallet, RefreshCw } from "lucide-react"
import { ProfitChart } from "@/components/charts/profit-chart"
import { TradeVolumeChart } from "@/components/charts/trade-volume-chart"
import { WinRateChart } from "@/components/charts/win-rate-chart"
import { RecentTrades } from "@/components/recent-trades"
import { BotControls } from "@/components/bot-controls"
import { TokenWatchlist } from "@/components/token-watchlist"
import { AlertsPanel } from "@/components/alerts-panel"
import { GMGNApiTest } from "@/components/gmgn-api-test"

interface BotMetrics {
  isRunning: boolean
  totalTrades: number
  successfulTrades: number
  totalProfit: number
  totalVolume: number
  avgProfitPerTrade: number
  winRate: number
  lastActivity: string
  walletBalance: number
  activePositions: number
  todayTrades: number
  todayProfit: number
  walletAddress: string
}

interface DashboardClientProps {
  initialData: BotMetrics
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const [metrics, setMetrics] = useState<BotMetrics>(initialData)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Client-side data fetching
  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/bot/status")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error("Error fetching metrics:", error)
      toast({
        title: "Error",
        description: "Failed to fetch bot metrics",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh data
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(fetchMetrics, 5000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  const handleToggleBot = async () => {
    try {
      const action = metrics.isRunning ? "stop" : "start"
      const response = await fetch("/api/bot/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error("Failed to toggle bot")
      }

      toast({
        title: `Bot ${action === "start" ? "Started" : "Stopped"}`,
        description: `Trading bot has been ${action === "start" ? "started" : "stopped"} successfully.`,
      })

      // Refresh metrics
      setTimeout(fetchMetrics, 1000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle bot. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">GMGN Trading Bot</h1>
            <p className="text-gray-400">Automated Memecoin Sniping Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Auto Refresh</span>
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={fetchMetrics}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={() => (window.location.href = "/simulation")}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
          >
            <Target className="w-4 h-4" />
            Simulation
          </Button>
          <Button
            onClick={handleToggleBot}
            variant={metrics.isRunning ? "destructive" : "default"}
            size="lg"
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : metrics.isRunning ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {loading ? "Processing..." : metrics.isRunning ? "Stop Bot" : "Start Bot"}
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Bot Status</CardTitle>
            <Activity className={`h-4 w-4 ${metrics.isRunning ? "text-green-400" : "text-gray-400"}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge
                variant={metrics.isRunning ? "default" : "secondary"}
                className={metrics.isRunning ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
              >
                {metrics.isRunning ? "Active" : "Stopped"}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">Last: {new Date(metrics.lastActivity).toLocaleTimeString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{metrics.totalProfit.toFixed(2)} SOL</div>
            <p className="text-xs text-gray-500">${(metrics.totalProfit * 180).toFixed(2)} USD</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{metrics.winRate.toFixed(1)}%</div>
            <Progress value={metrics.winRate} className="mt-2 h-2" />
            <p className="text-xs text-gray-500 mt-1">
              {metrics.successfulTrades}/{metrics.totalTrades} trades
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Wallet</CardTitle>
            <Wallet className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{metrics.walletBalance.toFixed(2)} SOL</div>
            <p className="text-xs text-gray-500 font-mono">
              {metrics.walletAddress.slice(0, 8)}...{metrics.walletAddress.slice(-8)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 border-gray-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProfitChart />
            <TradeVolumeChart />
          </div>
          <WinRateChart />
        </TabsContent>

        <TabsContent value="trades">
          <RecentTrades />
        </TabsContent>

        <TabsContent value="watchlist">
          <TokenWatchlist />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertsPanel />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <BotControls />
          <GMGNApiTest />
        </TabsContent>
      </Tabs>
    </div>
  )
}
