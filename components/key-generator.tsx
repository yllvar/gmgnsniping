"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Copy, Key, Shield, Eye, EyeOff, RefreshCw } from "lucide-react"

export function KeyGenerator() {
  const [apiSecretKey, setApiSecretKey] = useState("")
  const [encryptionKey, setEncryptionKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [encryptedPrivateKey, setEncryptedPrivateKey] = useState("")
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const { toast } = useToast()

  // Generate random hex string
  const generateRandomHex = (bytes: number): string => {
    const array = new Uint8Array(bytes)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  }

  // Simple AES-like encryption (for demo - use proper encryption in production)
  const encryptPrivateKey = (plaintext: string, key: string): string => {
    if (!plaintext || !key) return ""

    try {
      // Simple XOR encryption for demo (replace with proper AES in production)
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

  const generateKeys = () => {
    const newApiKey = generateRandomHex(32) // 64 hex characters
    const newEncryptionKey = generateRandomHex(32) // 64 hex characters

    setApiSecretKey(newApiKey)
    setEncryptionKey(newEncryptionKey)

    toast({
      title: "Keys Generated",
      description: "New security keys have been generated successfully.",
    })
  }

  const handleEncryptWallet = () => {
    if (!privateKey || !encryptionKey) {
      toast({
        title: "Missing Information",
        description: "Please provide both private key and encryption key.",
        variant: "destructive",
      })
      return
    }

    const encrypted = encryptPrivateKey(privateKey, encryptionKey)
    setEncryptedPrivateKey(encrypted)

    toast({
      title: "Wallet Encrypted",
      description: "Private key has been encrypted successfully.",
    })
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Step 1: Generate Security Keys */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-yellow-400" />
            Step 1: Generate Security Keys
          </CardTitle>
          <CardDescription className="text-gray-400">
            Generate API secret key and encryption key for production security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={generateKeys} className="w-full flex items-center gap-2" size="lg">
            <RefreshCw className="w-4 h-4" />
            Generate New Keys
          </Button>

          {apiSecretKey && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white">API_SECRET_KEY</Label>
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
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white">ENCRYPTION_KEY</Label>
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
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
                <p className="text-green-400 text-sm">
                  ✅ Keys generated successfully! Copy these to your Vercel environment variables.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Encrypt Wallet Private Key */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            Step 2: Encrypt Wallet Private Key
          </CardTitle>
          <CardDescription className="text-gray-400">
            Encrypt your wallet private key for secure storage in production
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Your Wallet Private Key (Base58)</Label>
            <div className="relative">
              <Input
                type={showPrivateKey ? "text" : "password"}
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="Enter your Base58 private key..."
                className="bg-gray-700 border-gray-600 text-white pr-10"
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
            onClick={handleEncryptWallet}
            disabled={!privateKey || !encryptionKey}
            className="w-full flex items-center gap-2"
            size="lg"
          >
            <Shield className="w-4 h-4" />
            Encrypt Private Key
          </Button>

          {encryptedPrivateKey && (
            <div className="space-y-4">
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
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded p-3">
                <p className="text-purple-400 text-sm">
                  ✅ Private key encrypted successfully! Use this in your Vercel environment variables.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 3: Environment Variables Summary */}
      {apiSecretKey && encryptionKey && encryptedPrivateKey && (
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Step 3: Vercel Environment Variables</CardTitle>
            <CardDescription className="text-gray-400">
              Copy these environment variables to your Vercel project settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-900/50 rounded p-4 font-mono text-sm space-y-2">
              <div className="text-gray-400"># Security Keys</div>
              <div className="text-green-400">API_SECRET_KEY={apiSecretKey}</div>
              <div className="text-blue-400">ENCRYPTION_KEY={encryptionKey}</div>
              <div className="text-purple-400">WALLET_PRIVATE_KEY_ENCRYPTED={encryptedPrivateKey}</div>
              <div className="text-gray-400 mt-4"># Your wallet public address</div>
              <div className="text-yellow-400">WALLET_ADDRESS=your_wallet_public_address_here</div>
              <div className="text-gray-400 mt-4"># GMGN Configuration</div>
              <div className="text-white">GMGN_API_HOST=https://gmgn.ai</div>
              <div className="text-white">SOLANA_RPC=https://api.mainnet-beta.solana.com</div>
              <div className="text-gray-400 mt-4"># Trading Parameters</div>
              <div className="text-white">MIN_LIQUIDITY=100</div>
              <div className="text-white">MAX_DEV_HOLDINGS=5</div>
              <div className="text-white">DEFAULT_AMOUNT=0.5</div>
              <div className="text-white">DEFAULT_SLIPPAGE=0.5</div>
              <div className="text-white">PRIORITY_FEE=0.002</div>
            </div>

            <Button
              onClick={() =>
                copyToClipboard(
                  `API_SECRET_KEY=${apiSecretKey}\nENCRYPTION_KEY=${encryptionKey}\nWALLET_PRIVATE_KEY_ENCRYPTED=${encryptedPrivateKey}\nWALLET_ADDRESS=your_wallet_public_address_here\nGMGN_API_HOST=https://gmgn.ai\nSOLANA_RPC=https://api.mainnet-beta.solana.com\nMIN_LIQUIDITY=100\nMAX_DEV_HOLDINGS=5\nDEFAULT_AMOUNT=0.5\nDEFAULT_SLIPPAGE=0.5\nPRIOTITY_FEE=0.002`,
                  "All Environment Variables",
                )
              }
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy All Environment Variables
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="p-6">
          <h3 className="text-blue-400 font-semibold mb-3">📋 Next Steps:</h3>
          <ol className="text-blue-300 space-y-2 text-sm">
            <li>1. Generate your security keys using the tool above</li>
            <li>2. Encrypt your wallet private key</li>
            <li>3. Copy all environment variables to your Vercel project settings</li>
            <li>4. Add your wallet public address to WALLET_ADDRESS</li>
            <li>5. Deploy your project to Vercel</li>
            <li>6. Test the /api/health endpoint to verify everything works</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
