"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, Bell, CheckCircle, XCircle, Clock } from "lucide-react"

interface Alert {
  id: string
  type: "success" | "warning" | "error" | "info"
  title: string
  message: string
  timestamp: string
  isRead: boolean
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "success",
    title: "Successful Trade",
    message: "PEPE2.0 trade completed with +250% profit (1.25 SOL)",
    timestamp: "2 minutes ago",
    isRead: false,
  },
  {
    id: "2",
    type: "warning",
    title: "High Slippage Detected",
    message: "DOGE KILLER trade executed with 45% slippage",
    timestamp: "5 minutes ago",
    isRead: false,
  },
  {
    id: "3",
    type: "error",
    title: "Trade Failed",
    message: "SHIB ARMY transaction failed due to insufficient liquidity",
    timestamp: "12 minutes ago",
    isRead: true,
  },
  {
    id: "4",
    type: "info",
    title: "New Token Detected",
    message: "MOON ROCKET added to watchlist - meets eligibility criteria",
    timestamp: "18 minutes ago",
    isRead: true,
  },
]

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [alertSettings, setAlertSettings] = useState({
    tradeAlerts: true,
    profitAlerts: true,
    errorAlerts: true,
    newTokenAlerts: false,
  })

  const markAsRead = (id: string) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, isRead: true } : alert)))
  }

  const markAllAsRead = () => {
    setAlerts(alerts.map((alert) => ({ ...alert, isRead: true })))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <Bell className="w-5 h-5 text-blue-400" />
    }
  }

  const getAlertBadgeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }
  }

  const unreadCount = alerts.filter((alert) => !alert.isRead).length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Alerts List */}
      <div className="lg:col-span-2">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <CardTitle className="text-white">Alerts</CardTitle>
                {unreadCount > 0 && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{unreadCount} new</Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-gray-400 hover:text-white">
                Mark all as read
              </Button>
            </div>
            <CardDescription className="text-gray-400">Real-time notifications and system alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      alert.isRead
                        ? "bg-gray-700/30 border-gray-600/30"
                        : "bg-gray-700/50 border-gray-600/50 hover:bg-gray-700/70"
                    }`}
                    onClick={() => markAsRead(alert.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${alert.isRead ? "text-gray-300" : "text-white"}`}>
                            {alert.title}
                          </h3>
                          <Badge variant="outline" className={getAlertBadgeColor(alert.type)}>
                            {alert.type}
                          </Badge>
                        </div>
                        <p className={`text-sm ${alert.isRead ? "text-gray-500" : "text-gray-400"}`}>{alert.message}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {alert.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Alert Settings */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Alert Settings</CardTitle>
          <CardDescription className="text-gray-400">Configure notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Trade Alerts</h4>
                <p className="text-sm text-gray-400">Notify on trade execution</p>
              </div>
              <Switch
                checked={alertSettings.tradeAlerts}
                onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, tradeAlerts: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Profit Alerts</h4>
                <p className="text-sm text-gray-400">Notify on profit targets</p>
              </div>
              <Switch
                checked={alertSettings.profitAlerts}
                onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, profitAlerts: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Error Alerts</h4>
                <p className="text-sm text-gray-400">Notify on failures</p>
              </div>
              <Switch
                checked={alertSettings.errorAlerts}
                onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, errorAlerts: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">New Token Alerts</h4>
                <p className="text-sm text-gray-400">Notify on token discovery</p>
              </div>
              <Switch
                checked={alertSettings.newTokenAlerts}
                onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, newTokenAlerts: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
