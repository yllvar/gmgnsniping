"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react"

interface HealthStatus {
  status: string
  timestamp: string
  environment: string
  services: {
    environment: {
      walletConfigured: boolean
      rpcConfigured: boolean
      apiKeyConfigured: boolean
      encryptionKeyConfigured: boolean
    }
  }
}

export function ApiHealthChecker() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/health")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setHealth(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-400"
      case "degraded":
        return "text-yellow-400"
      case "unhealthy":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "degraded":
        return <Clock className="w-4 h-4 text-yellow-400" />
      case "unhealthy":
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          API Health Check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={checkHealth} disabled={loading} className="w-full">
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            "Check API Health"
          )}
        </Button>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 font-semibold">❌ API Error</p>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        )}

        {health && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Status:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(health.status)}
                <Badge variant="outline" className={`${getStatusColor(health.status)} border-current`}>
                  {health.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Environment:</span>
              <span className="text-white font-mono">{health.environment}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Timestamp:</span>
              <span className="text-white text-sm">{new Date(health.timestamp).toLocaleString()}</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-semibold">Environment Variables:</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(health.services.environment).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{key}:</span>
                    <span className={value ? "text-green-400" : "text-red-400"}>{value ? "✅" : "❌"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
