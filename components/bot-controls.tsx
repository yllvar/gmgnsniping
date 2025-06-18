"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Settings, Save, RotateCcw, RefreshCw } from "lucide-react"
import { useApi, useApiMutation } from "@/hooks/use-api"

interface BotConfig {
  minLiquidity: number
  maxDevHoldings: number
  defaultAmount: number
  defaultSlippage: number
  priorityFee: number
  autoTrade: boolean
  maxDailyTrades: number
  stopLossPercent: number
  takeProfitPercent: number
}

export function BotControls() {
  const { toast } = useToast()
  const {
    data: configData,
    loading: configLoading,
    refetch: refetchConfig,
  } = useApi<{ config: BotConfig }>("/api/config")
  const { mutate: updateConfig, loading: updateLoading } = useApiMutation<{ config: BotConfig }, BotConfig>(
    "/api/config",
    "PUT",
  )

  const [config, setConfig] = useState<BotConfig>({
    minLiquidity: 100,
    maxDevHoldings: 5,
    defaultAmount: 0.5,
    defaultSlippage: 50,
    priorityFee: 0.002,
    autoTrade: true,
    maxDailyTrades: 20,
    stopLossPercent: 20,
    takeProfitPercent: 300,
  })

  const [walletAddress] = useState("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU")

  // Update local config when API data loads
  useEffect(() => {
    if (configData?.config) {
      setConfig(configData.config)
    }
  }, [configData])

  const saveConfig = async () => {
    try {
      await updateConfig(config)
      toast({
        title: "Configuration Saved",
        description: "Bot configuration has been updated successfully.",
      })
      refetchConfig()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetConfig = () => {
    const defaultConfig: BotConfig = {
      minLiquidity: 100,
      maxDevHoldings: 5,
      defaultAmount: 0.5,
      defaultSlippage: 50,
      priorityFee: 0.002,
      autoTrade: true,
      maxDailyTrades: 20,
      stopLossPercent: 20,
      takeProfitPercent: 300,
    }
    setConfig(defaultConfig)
    toast({
      title: "Configuration Reset",
      description: "Configuration has been reset to default values.",
    })
  }

  if (configLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Trading Parameters */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Trading Parameters
          </CardTitle>
          <CardDescription className="text-gray-400">Configure bot trading behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-white">Minimum Liquidity (SOL)</Label>
            <Input
              type="number"
              value={config.minLiquidity}
              onChange={(e) => setConfig({ ...config, minLiquidity: Number(e.target.value) })}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <p className="text-xs text-gray-400">Only trade tokens with liquidity above this threshold</p>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Max Dev Holdings (%)</Label>
            <Input
              type="number"
              value={config.maxDevHoldings}
              onChange={(e) => setConfig({ ...config, maxDevHoldings: Number(e.target.value) })}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <p className="text-xs text-gray-400">Avoid tokens where dev holds more than this percentage</p>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Default Trade Amount (SOL)</Label>
            <Input
              type="number"
              step="0.1"
              value={config.defaultAmount}
              onChange={(e) => setConfig({ ...config, defaultAmount: Number(e.target.value) })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-white">Default Slippage: {config.defaultSlippage}%</Label>
            <Slider
              value={[config.defaultSlippage]}
              onValueChange={(value) => setConfig({ ...config, defaultSlippage: value[0] })}
              max={100}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Priority Fee (SOL)</Label>
            <Input
              type="number"
              step="0.001"
              value={config.priorityFee}
              onChange={(e) => setConfig({ ...config, priorityFee: Number(e.target.value) })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Risk Management */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Risk Management</CardTitle>
          <CardDescription className="text-gray-400">Configure risk parameters and limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Auto Trading</Label>
              <p className="text-sm text-gray-400">Enable automatic trade execution</p>
            </div>
            <Switch
              checked={config.autoTrade}
              onCheckedChange={(checked) => setConfig({ ...config, autoTrade: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Max Daily Trades</Label>
            <Input
              type="number"
              value={config.maxDailyTrades}
              onChange={(e) => setConfig({ ...config, maxDailyTrades: Number(e.target.value) })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-white">Stop Loss: {config.stopLossPercent}%</Label>
            <Slider
              value={[config.stopLossPercent]}
              onValueChange={(value) => setConfig({ ...config, stopLossPercent: value[0] })}
              max={50}
              min={5}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-white">Take Profit: {config.takeProfitPercent}%</Label>
            <Slider
              value={[config.takeProfitPercent]}
              onValueChange={(value) => setConfig({ ...config, takeProfitPercent: value[0] })}
              max={1000}
              min={50}
              step={50}
              className="w-full"
            />
          </div>

          <Separator className="bg-gray-600" />

          <div className="space-y-2">
            <Label className="text-white">Wallet Address</Label>
            <Input
              value={walletAddress}
              className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
              readOnly
            />
            <p className="text-xs text-gray-400">Current trading wallet address</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={saveConfig} className="flex-1 flex items-center gap-2" disabled={updateLoading}>
              {updateLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {updateLoading ? "Saving..." : "Save Config"}
            </Button>
            <Button onClick={resetConfig} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
