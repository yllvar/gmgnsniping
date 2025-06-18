"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import {
  Play,
  Pause,
  RotateCcw,
  Activity,
  TrendingUp,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  BarChart3,
} from "lucide-react"
import { SimulationMetrics } from "@/components/simulation/simulation-metrics"
import { SimulationChart } from "@/components/simulation/simulation-chart"
import { SimulationTrades } from "@/components/simulation/simulation-trades"
import { useSimulation } from "@/hooks/use-simulation"

export default function SimulationPage() {
  const { toast } = useToast()
  const { isRunning, metrics, logs, trades, startSimulation, stopSimulation, resetSimulation, loading } =
    useSimulation()

  const [autoScroll, setAutoScroll] = useState(true)
  const logsEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of logs
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs, autoScroll])

  const handleStart = async () => {
    try {
      await startSimulation()
      toast({
        title: "Simulation Started",
        description: "Live trading simulation is now running with real market data.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start simulation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleStop = async () => {
    try {
      await stopSimulation()
      toast({
        title: "Simulation Stopped",
        description: "Trading simulation has been stopped.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop simulation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReset = async () => {
    try {
      await resetSimulation()
      toast({
        title: "Simulation Reset",
        description: "All simulation data has been cleared.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset simulation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getLogIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case "trade":
        return <Zap className="w-4 h-4 text-blue-400" />
      case "analysis":
        return <Eye className="w-4 h-4 text-purple-400" />
      default:
        return <Activity className="w-4 h-4 text-gray-400" />
    }
  }

  const getLogColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-400"
      case "error":
        return "text-red-400"
      case "warning":
        return "text-yellow-400"
      case "trade":
        return "text-blue-400"
      case "analysis":
        return "text-purple-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Trading Simulation</h1>
              <p className="text-gray-400">Live market data with simulated trading execution</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              disabled={loading || isRunning}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button
              onClick={isRunning ? handleStop : handleStart}
              variant={isRunning ? "destructive" : "default"}
              size="lg"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? "Stop Simulation" : "Start Simulation"}
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Simulation Status</CardTitle>
              <Activity className={`h-4 w-4 ${isRunning ? "text-green-400" : "text-gray-400"}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge
                  variant={isRunning ? "default" : "secondary"}
                  className={isRunning ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                >
                  {isRunning ? "Running" : "Stopped"}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">Duration: {metrics?.duration || "0m 0s"}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Simulated Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{metrics?.totalProfit?.toFixed(3) || "0.000"} SOL</div>
              <p className="text-xs text-gray-500">${((metrics?.totalProfit || 0) * 180).toFixed(2)} USD</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Win Rate</CardTitle>
              <Target className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{metrics?.winRate?.toFixed(1) || "0.0"}%</div>
              <Progress value={metrics?.winRate || 0} className="mt-2 h-2" />
              <p className="text-xs text-gray-500 mt-1">
                {metrics?.successfulTrades || 0}/{metrics?.totalTrades || 0} trades
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Tokens Analyzed</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{metrics?.tokensAnalyzed || 0}</div>
              <p className="text-xs text-gray-500">{metrics?.eligibleTokens || 0} eligible for trading</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Logs */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    <CardTitle className="text-white">Live Activity Logs</CardTitle>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{logs.length} entries</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Auto-scroll</span>
                    <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
                  </div>
                </div>
                <CardDescription className="text-gray-400">
                  Real-time simulation activity and market analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-2">
                    {logs.length === 0 ? (
                      <div className="text-center py-8">
                        <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No activity logs yet</p>
                        <p className="text-sm text-gray-500 mt-2">Start the simulation to see live trading activity</p>
                      </div>
                    ) : (
                      logs.map((log, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:bg-gray-700/50 transition-colors"
                        >
                          {getLogIcon(log.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-medium ${getLogColor(log.type)}`}>{log.action}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300">{log.message}</p>
                            {log.data && (
                              <div className="mt-2 p-2 bg-gray-800/50 rounded text-xs font-mono text-gray-400">
                                {typeof log.data === "string" ? log.data : JSON.stringify(log.data, null, 2)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={logsEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Simulation Metrics */}
          <div className="space-y-6">
            <SimulationMetrics metrics={metrics} />

            {/* Current Market Status */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Market Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">SOL Price</span>
                  <span className="font-semibold text-green-400">$180.45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Network Status</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Healthy</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Gas Price</span>
                  <span className="font-semibold">0.002 SOL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active Pools</span>
                  <span className="font-semibold text-blue-400">1,247</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts and Trades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SimulationChart trades={trades} />
          <SimulationTrades trades={trades} />
        </div>
      </div>
    </div>
  )
}
