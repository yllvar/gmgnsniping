"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Key,
  Shield,
  Wallet,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Download,
} from "lucide-react"

export function CredentialGuide() {
  const [apiSecretKey, setApiSecretKey] = useState("")
  const [encryptionKey, setEncryptionKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [encryptedPrivateKey, setEncryptedPrivateKey] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const { toast } = useToast()

  // Generate cryptographically secure random hex string
  const generateSecureHex = (bytes: number): string => {
    const array = new Uint8Array(bytes)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  }

  // Simple encryption for demo (use proper AES in production)
  const encryptKey = (plaintext: string, key: string): string => {
    if (!plaintext || !key) return ""

    try {
      const keyBytes = new TextEncoder().encode(key.slice(0, 32))
      const textBytes = new TextEncoder().encode(plaintext)
      const encrypted = new Uint8Array(textBytes.length)

      for (let i = 0; i < textBytes.length; i++) {
        encrypted[i] = textBytes[i] ^ keyBytes[i % keyBytes.length]
      }

      return Array.from(encrypted, (byte) => byte.toString(16).padStart(2, "0")).join("")
    } catch (error) {
      console.error("Encryption error:", error)
      return ""
    }
  }

  const generateApiKey = () => {
    const key = generateSecureHex(32)
    setApiSecretKey(key)
    markStepComplete("api_key")
    toast({
      title: "API Key Generated",
      description: "64-character API secret key created successfully.",
    })
  }

  const generateEncryptionKey = () => {
    const key = generateSecureHex(32)
    setEncryptionKey(key)
    markStepComplete("encryption_key")
    toast({
      title: "Encryption Key Generated",
      description: "64-character encryption key created successfully.",
    })
  }

  const encryptWallet = () => {
    if (!privateKey || !encryptionKey) {
      toast({
        title: "Missing Information",
        description: "Please generate encryption key and enter private key first.",
        variant: "destructive",
      })
      return
    }

    const encrypted = encryptKey(privateKey, encryptionKey)
    setEncryptedPrivateKey(encrypted)
    markStepComplete("wallet_encrypted")
    toast({
      title: "Wallet Encrypted",
      description: "Private key encrypted successfully.",
    })
  }

  const markStepComplete = (step: string) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step])
    }
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied",
        description: `${label} copied to clipboard.`,
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const isStepComplete = (step: string) => completedSteps.includes(step)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <Key className="w-6 h-6 text-blue-400" />
            Complete Credential Setup Guide
          </CardTitle>
          <CardDescription className="text-gray-300">
            Follow these steps to generate all required credentials for your GMGN trading bot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant={isStepComplete("api_key") ? "default" : "secondary"} className="flex items-center gap-1">
              {isStepComplete("api_key") && <CheckCircle className="w-3 h-3" />}
              API Key
            </Badge>
            <Badge
              variant={isStepComplete("encryption_key") ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              {isStepComplete("encryption_key") && <CheckCircle className="w-3 h-3" />}
              Encryption Key
            </Badge>
            <Badge
              variant={isStepComplete("wallet_encrypted") ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              {isStepComplete("wallet_encrypted") && <CheckCircle className="w-3 h-3" />}
              Wallet Encrypted
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="step1" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border-gray-700">
          <TabsTrigger value="step1" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            Step 1
          </TabsTrigger>
          <TabsTrigger value="step2" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Step 2
          </TabsTrigger>
          <TabsTrigger value="step3" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Step 3
          </TabsTrigger>
          <TabsTrigger value="deploy" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Deploy
          </TabsTrigger>
        </TabsList>

        {/* Step 1: API Secret Key */}
        <TabsContent value="step1">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-yellow-400" />
                Generate API_SECRET_KEY
                {isStepComplete("api_key") && <CheckCircle className="w-5 h-5 text-green-400" />}
              </CardTitle>
              <CardDescription className="text-gray-400">
                This key secures your API endpoints and prevents unauthorized access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4">
                <h4 className="text-blue-400 font-semibold mb-2">What is API_SECRET_KEY?</h4>
                <p className="text-blue-300 text-sm">
                  A 64-character hexadecimal string that acts as a password for your API endpoints. It prevents
                  unauthorized users from controlling your trading bot.
                </p>
              </div>

              <Button onClick={generateApiKey} className="w-full flex items-center gap-2" size="lg">
                <RefreshCw className="w-4 h-4" />
                Generate API Secret Key
              </Button>

              {apiSecretKey && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Generated API_SECRET_KEY</Label>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(apiSecretKey, "API Secret Key")}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={apiSecretKey}
                    readOnly
                    className="bg-gray-700 border-gray-600 text-green-400 font-mono text-sm"
                    rows={2}
                  />
                  <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
                    <p className="text-green-400 text-sm">
                      ✅ Copy this value and add it as API_SECRET_KEY in your Vercel environment variables
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: Encryption Key */}
        <TabsContent value="step2">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Generate ENCRYPTION_KEY
                {isStepComplete("encryption_key") && <CheckCircle className="w-5 h-5 text-green-400" />}
              </CardTitle>
              <CardDescription className="text-gray-400">
                This key encrypts your wallet private key for secure storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded p-4">
                <h4 className="text-purple-400 font-semibold mb-2">What is ENCRYPTION_KEY?</h4>
                <p className="text-purple-300 text-sm">
                  A 64-character hexadecimal string used to encrypt your wallet private key. This ensures your private
                  key is never stored in plain text.
                </p>
              </div>

              <Button onClick={generateEncryptionKey} className="w-full flex items-center gap-2" size="lg">
                <Shield className="w-4 h-4" />
                Generate Encryption Key
              </Button>

              {encryptionKey && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Generated ENCRYPTION_KEY</Label>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(encryptionKey, "Encryption Key")}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={encryptionKey}
                    readOnly
                    className="bg-gray-700 border-gray-600 text-blue-400 font-mono text-sm"
                    rows={2}
                  />
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                    <p className="text-blue-400 text-sm">
                      ✅ Copy this value and add it as ENCRYPTION_KEY in your Vercel environment variables
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 3: Wallet Setup */}
        <TabsContent value="step3">
          <div className="space-y-6">
            {/* Wallet Creation Guide */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-purple-400" />
                  Get Your Solana Wallet Credentials
                </CardTitle>
                <CardDescription className="text-gray-400">
                  You need a Solana wallet private key and public address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    How to Get Your Wallet Credentials
                  </h4>
                  <div className="text-yellow-300 text-sm space-y-2">
                    <p>
                      <strong>Option 1: Use Phantom Wallet</strong>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 ml-4">
                      <li>Install Phantom wallet extension</li>
                      <li>Create a new wallet or import existing</li>
                      <li>Go to Settings → Export Private Key</li>
                      <li>Copy your private key (Base58 format)</li>
                      <li>Copy your wallet address from the main screen</li>
                    </ol>

                    <p className="mt-3">
                      <strong>Option 2: Use Solana CLI</strong>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 ml-4">
                      <li>Install Solana CLI tools</li>
                      <li>
                        Run: <code className="bg-gray-700 px-1 rounded">solana-keygen new</code>
                      </li>
                      <li>Your private key is in ~/.config/solana/id.json</li>
                      <li>
                        Get address: <code className="bg-gray-700 px-1 rounded">solana address</code>
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => window.open("https://phantom.app", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Download Phantom
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => window.open("https://docs.solana.com/cli/install-solana-cli-tools", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Solana CLI Guide
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Encryption */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Encrypt Your Wallet Private Key
                  {isStepComplete("wallet_encrypted") && <CheckCircle className="w-5 h-5 text-green-400" />}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your wallet credentials to generate the encrypted version
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Wallet Public Address</Label>
                  <Input
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Enter your wallet public address (e.g., 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU)"
                    className="bg-gray-700 border-gray-600 text-white font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Wallet Private Key (Base58)</Label>
                  <div className="relative">
                    <Input
                      type={showPrivateKey ? "text" : "password"}
                      value={privateKey}
                      onChange={(e) => setPrivateKey(e.target.value)}
                      placeholder="Enter your Base58 private key..."
                      className="bg-gray-700 border-gray-600 text-white font-mono pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                    >
                      {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={encryptWallet}
                  disabled={!privateKey || !encryptionKey}
                  className="w-full flex items-center gap-2"
                  size="lg"
                >
                  <Shield className="w-4 h-4" />
                  Encrypt Private Key
                </Button>

                {!encryptionKey && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                    <p className="text-red-400 text-sm">⚠️ Please generate the ENCRYPTION_KEY in Step 2 first</p>
                  </div>
                )}

                {encryptedPrivateKey && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">WALLET_PRIVATE_KEY_ENCRYPTED</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(encryptedPrivateKey, "Encrypted Private Key")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={encryptedPrivateKey}
                      readOnly
                      className="bg-gray-700 border-gray-600 text-purple-400 font-mono text-sm"
                      rows={3}
                    />
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded p-3">
                      <p className="text-purple-400 text-sm">
                        ✅ Copy this value and add it as WALLET_PRIVATE_KEY_ENCRYPTED in your Vercel environment
                        variables
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Deploy Tab */}
        <TabsContent value="deploy">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-green-400" />
                Complete Environment Variables
              </CardTitle>
              <CardDescription className="text-gray-400">
                Copy all environment variables to your Vercel project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {apiSecretKey && encryptionKey && encryptedPrivateKey && walletAddress ? (
                <div className="space-y-4">
                  <div className="bg-gray-900/50 rounded p-4 font-mono text-sm space-y-1">
                    <div className="text-gray-400"># Security Keys</div>
                    <div className="text-green-400">API_SECRET_KEY={apiSecretKey}</div>
                    <div className="text-blue-400">ENCRYPTION_KEY={encryptionKey}</div>
                    <div className="text-purple-400">WALLET_PRIVATE_KEY_ENCRYPTED={encryptedPrivateKey}</div>
                    <div className="text-yellow-400">WALLET_ADDRESS={walletAddress}</div>
                    <div className="text-gray-400 mt-3"># GMGN Configuration</div>
                    <div className="text-white">GMGN_API_HOST=https://gmgn.ai</div>
                    <div className="text-white">SOLANA_RPC=https://api.mainnet-beta.solana.com</div>
                    <div className="text-gray-400 mt-3"># Trading Parameters</div>
                    <div className="text-white">MIN_LIQUIDITY=100</div>
                    <div className="text-white">MAX_DEV_HOLDINGS=5</div>
                    <div className="text-white">DEFAULT_AMOUNT=0.5</div>
                    <div className="text-white">DEFAULT_SLIPPAGE=0.5</div>
                    <div className="text-white">PRIORITY_FEE=0.002</div>
                  </div>

                  <Button
                    onClick={() =>
                      copyToClipboard(
                        `API_SECRET_KEY=${apiSecretKey}\nENCRYPTION_KEY=${encryptionKey}\nWALLET_PRIVATE_KEY_ENCRYPTED=${encryptedPrivateKey}\nWALLET_ADDRESS=${walletAddress}\nGMGN_API_HOST=https://gmgn.ai\nSOLANA_RPC=https://api.mainnet-beta.solana.com\nMIN_LIQUIDITY=100\nMAX_DEV_HOLDINGS=5\nDEFAULT_AMOUNT=0.5\nDEFAULT_SLIPPAGE=0.5\nPRIORITY_FEE=0.002`,
                        "All Environment Variables",
                      )
                    }
                    className="w-full"
                    size="lg"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All Environment Variables
                  </Button>

                  <div className="bg-green-500/10 border border-green-500/30 rounded p-4">
                    <h4 className="text-green-400 font-semibold mb-2">🎉 Ready to Deploy!</h4>
                    <ol className="text-green-300 text-sm space-y-1">
                      <li>1. Copy the environment variables above</li>
                      <li>2. Go to your Vercel project settings</li>
                      <li>3. Add each variable in the Environment Variables section</li>
                      <li>4. Deploy your project</li>
                      <li>5. Test the /api/health endpoint</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-4">
                  <p className="text-yellow-400 text-sm">
                    ⚠️ Please complete all previous steps to generate the environment variables
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
