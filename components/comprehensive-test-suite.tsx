"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, XCircle, RefreshCw, Wallet, Shield, TrendingUp, Globe, Bot, AlertTriangle } from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "warning" | "pending"
  message: string
  details?: any
  duration?: number
}

interface TestSuite {
  [key: string]: TestResult[]
}

export function ComprehensiveTestSuite() {
  const [testResults, setTestResults] = useState<TestSuite>({})
  const [loading, setLoading] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("api")

  const updateTestResult = (category: string, testName: string, result: Omit<TestResult, "name">) => {
    setTestResults((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []).filter((t) => t.name !== testName), { name: testName, ...result }],
    }))
  }

  const runTest = async (category: string, testName: string, testFn: () => Promise<any>) => {
    const startTime = Date.now()
    updateTestResult(category, testName, { status: "pending", message: "Running..." })

    try {
      const result = await testFn()
      const duration = Date.now() - startTime
      updateTestResult(category, testName, {
        status: "success",
        message: "Test passed",
        details: result,
        duration,
      })
    } catch (error) {
      const duration = Date.now() - startTime
      updateTestResult(category, testName, {
        status: "error",
        message: error instanceof Error ? error.message : "Test failed",
        duration,
      })
    }
  }

  // API Tests
  const runApiTests = async () => {
    setLoading("api")

    const apiTests = [
      {
        name: "Health Check",
        test: () => fetch("/api/health").then((r) => r.json()),
      },
      {
        name: "Bot Status",
        test: () => fetch("/api/bot/status").then((r) => r.json()),
      },
      {
        name: "Configuration",
        test: () => fetch("/api/config").then((r) => r.json()),
      },
      {
        name: "Recent Trades",
        test: () => fetch("/api/trades/recent").then((r) => r.json()),
      },
      {
        name: "Trade Stats",
        test: () => fetch("/api/trades/stats").then((r) => r.json()),
      },
      {
        name: "Watchlist",
        test: () => fetch("/api/watchlist").then((r) => r.json()),
      },
      {
        name: "Alerts",
        test: () => fetch("/api/alerts").then((r) => r.json()),
      },
    ]

    for (const { name, test } of apiTests) {
      await runTest("api", name, test)
    }

    setLoading(null)
  }

  // Wallet Tests
  const runWalletTests = async () => {
    setLoading("wallet")

    const walletTests = [
      {
        name: "Wallet Configuration",
        test: async () => {
          const response = await fetch("/api/health")
          const data = await response.json()
          if (!data.services.environment.walletConfigured) {
            throw new Error("Wallet not configured")
          }
          return { configured: true }
        },
      },
      {
        name: "RPC Connection",
        test: async () => {
          const response = await fetch("/api/health")
          const data = await response.json()
          if (!data.services.environment.rpcConfigured) {
            throw new Error("RPC not configured")
          }
          return { rpcConfigured: true }
        },
      },
      {
        name: "Encryption Keys",
        test: async () => {
          const response = await fetch("/api/health")
          const data = await response.json()
          if (!data.services.environment.encryptionKeyConfigured) {
            throw new Error("Encryption keys not configured")
          }
          return { encryptionConfigured: true }
        },
      },
    ]

    for (const { name, test } of walletTests) {
      await runTest("wallet", name, test)
    }

    setLoading(null)
  }

  // GMGN API Tests
  const runGmgnTests = async () => {
    setLoading("gmgn")

    const gmgnTests = [
      {
        name: "API Key Configuration",
        test: async () => {
          const response = await fetch("/api/health")
          const data = await response.json()
          if (!data.services.environment.apiKeyConfigured) {
            throw new Error("GMGN API key not configured")
          }
          return { apiKeyConfigured: true }
        },
      },
      {
        name: "Token Data Fetch",
        test: async () => {
          // Test fetching token data from a known token
          const testToken = "So11111111111111111111111111111111111111112" // SOL
          const response = await fetch(`/api/tokens/${testToken}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch token data: ${response.statusText}`)
          }
          return await response.json()
        },
      },
      {
        name: "Market Data",
        test: async () => {
          const response = await fetch("/api/market/trending")
          if (!response.ok) {
            throw new Error(`Failed to fetch market data: ${response.statusText}`)
          }
          return await response.json()
        },
      },
    ]

    for (const { name, test } of gmgnTests) {
      await runTest("gmgn", name, test)
    }

    setLoading(null)
  }

  // Bot Functionality Tests
  const runBotTests = async () => {
    setLoading("bot")

    const botTests = [
      {
        name: "Bot Status Check",
        test: () => fetch("/api/bot/status").then((r) => r.json()),
      },
      {
        name: "Configuration Validation",
        test: () => fetch("/api/config").then((r) => r.json()),
      },
      {
        name: "Simulation Mode",
        test: async () => {
          const response = await fetch("/api/simulation/start", { method: "POST" })
          if (!response.ok) {
            throw new Error(`Simulation start failed: ${response.statusText}`)
          }
          return await response.json()
        },
      },
      {
        name: "Stop Simulation",
        test: async () => {
          const response = await fetch("/api/simulation/stop", { method: "POST" })
          if (!response.ok) {
            throw new Error(`Simulation stop failed: ${response.statusText}`)
          }
          return await response.json()
        },
      },
    ]

    for (const { name, test } of botTests) {
      await runTest("bot", name, test)
    }

    setLoading(null)
  }

  // Security Tests
  const runSecurityTests = async () => {
    setLoading("security")

    const securityTests = [
      {
        name: "Environment Variables",
        test: async () => {
          const response = await fetch("/api/health")
          const data = await response.json()
          const env = data.services.environment
          const missingVars = Object.entries(env)
            .filter(([_, configured]) => !configured)
            .map(([key]) => key)

          if (missingVars.length > 0) {
            throw new Error(`Missing environment variables: ${missingVars.join(", ")}`)
          }
          return { allConfigured: true }
        },
      },
      {
        name: "API Rate Limiting",
        test: async () => {
          // Test multiple rapid requests
          const promises = Array(5)
            .fill(null)
            .map(() => fetch("/api/health"))
          const responses = await Promise.all(promises)
          const allSuccessful = responses.every((r) => r.ok)
          return { rateLimitHandled: allSuccessful }
        },
      },
      {
        name: "Error Handling",
        test: async () => {
          // Test invalid endpoint
          const response = await fetch("/api/invalid-endpoint")
          if (response.status !== 404) {
            throw new Error("Error handling not working properly")
          }
          return { errorHandlingWorking: true }
        },
      },
    ]

    for (const { name, test } of securityTests) {
      await runTest("security", name, test)
    }

    setLoading(null)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-400" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case "pending":
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
    }
  }

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "text-green-400 border-green-400"
      case "error":
        return "text-red-400 border-red-400"
      case "warning":
        return "text-yellow-400 border-yellow-400"
      case "pending":
        return "text-blue-400 border-blue-400"
    }
  }

  const TestResultsDisplay = ({ results }: { results: TestResult[] }) => (
    <ScrollArea className="h-96">
      <div className="space-y-2">
        {results.map((result, index) => (
          <div key={index} className="p-3 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(result.status)}
                <span className="text-white font-medium">{result.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {result.duration && <span className="text-gray-400 text-xs">{result.duration}ms</span>}
                <Badge variant="outline" className={getStatusColor(result.status)}>
                  {result.status.toUpperCase()}
                </Badge>
              </div>
            </div>
            <p className="text-gray-300 text-sm mt-1">{result.message}</p>
            {result.details && (
              <details className="mt-2">
                <summary className="text-gray-400 text-xs cursor-pointer">View Details</summary>
                <pre className="text-xs text-gray-500 mt-1 overflow-x-auto">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">🧪 Comprehensive Test Suite</h2>
        <p className="text-gray-400">Test all aspects of your GMGN Sniping Bot</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            API
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="gmgn" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            GMGN
          </TabsTrigger>
          <TabsTrigger value="bot" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Bot
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5" />
                API Endpoint Tests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runApiTests} disabled={loading === "api"} className="w-full">
                {loading === "api" ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing API Endpoints...
                  </>
                ) : (
                  "Run API Tests"
                )}
              </Button>
              {testResults.api && <TestResultsDisplay results={testResults.api} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Wallet & Blockchain Tests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runWalletTests} disabled={loading === "wallet"} className="w-full">
                {loading === "wallet" ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing Wallet Connection...
                  </>
                ) : (
                  "Run Wallet Tests"
                )}
              </Button>
              {testResults.wallet && <TestResultsDisplay results={testResults.wallet} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gmgn">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                GMGN API Integration Tests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runGmgnTests} disabled={loading === "gmgn"} className="w-full">
                {loading === "gmgn" ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing GMGN Integration...
                  </>
                ) : (
                  "Run GMGN Tests"
                )}
              </Button>
              {testResults.gmgn && <TestResultsDisplay results={testResults.gmgn} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bot">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Bot Functionality Tests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runBotTests} disabled={loading === "bot"} className="w-full">
                {loading === "bot" ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing Bot Functions...
                  </>
                ) : (
                  "Run Bot Tests"
                )}
              </Button>
              {testResults.bot && <TestResultsDisplay results={testResults.bot} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Configuration Tests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runSecurityTests} disabled={loading === "security"} className="w-full">
                {loading === "security" ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing Security...
                  </>
                ) : (
                  "Run Security Tests"
                )}
              </Button>
              {testResults.security && <TestResultsDisplay results={testResults.security} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
