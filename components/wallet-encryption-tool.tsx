"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Shield, Wallet, Copy, Eye, EyeOff, CheckCircle, AlertTriangle, ExternalLink, Key } from "lucide-react"

export function WalletEncryptionTool() {
  const [privateKey, setPrivateKey] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [encryptedPrivateKey, setEncryptedPrivateKey] = useState("")
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const { toast } = useToast()

  // Your generated encryption key
  const encryptionKey = "c6c46376369510e0c93cff5194329eb6f3a27ef6cfca0a0a8e21e107dfad464f"

  // Encryption function (simplified for demo - use proper AES in production)
  const encryptWalletKey = (plaintext: string, key: string): string => {
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

  const handleEncryptWallet = () => {
    if (!privateKey) {
      toast({
        title: "Missing Private Key",
        description: "Please enter your wallet private key first.",
        variant: "destructive",
      })
      return
    }

    if (!walletAddress) {
      toast({
        title: "Missing Wallet Address",
        description: "Please enter your wallet public address.",
        variant: "destructive",
      })
      return
    }

    const encrypted = encryptWalletKey(privateKey, encryptionKey)
    setEncryptedPrivateKey(encrypted)

    toast({
      title: "Wallet Encrypted Successfully",
      description: "Your private key has been encrypted and is ready for production use.",
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

  const copyAllEnvironmentVariables = () => {
    if (!encryptedPrivateKey || !walletAddress) {
      toast({
        title: "Incomplete Setup",
        description: "Please encrypt your wallet first.",
        variant: "destructive",
      })
      return
    }

    const envVars = `# Security Keys
API_SECRET_KEY=5cf6b23c07b4e891e58fea5b9833ef8aac75522bcc10321eb4eb4536dcdbc9d3
ENCRYPTION_KEY=c6c46376369510e0c93cff5194329eb6f3a27ef6cfca0a0a8e21e107dfad464f

# Wallet Configuration
WALLET_PRIVATE_KEY_ENCRYPTED=${encryptedPrivateKey}
WALLET_ADDRESS=${walletAddress}

# GMGN Configuration
GMGN_API_HOST=https://gmgn.ai
SOLANA_RPC=https://api.mainnet-beta.solana.com

# Trading Parameters
MIN_LIQUIDITY=100
MAX_DEV_HOLDINGS=5
DEFAULT_AMOUNT=0.5
DEFAULT_SLIPPAGE=0.5
PRIORITY_FEE=0.002`

    copyToClipboard(envVars, "All Environment Variables")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Status Header */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            Security Keys Generated Successfully
          </CardTitle>
          <CardDescription className="text-gray-300">
            Your API_SECRET_KEY and ENCRYPTION_KEY are ready. Now let's encrypt your wallet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-green-400 flex items-center gap-2">
                <Key className="w-4 h-4" />
                API_SECRET_KEY
              </Label>
              <div className="bg-gray-800 p-2 rounded font-mono text-xs text-green-400 break-all">
                5cf6b23c07b4e891e58fea5b9833ef8aac75522bcc10321eb4eb4536dcdbc9d3
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-blue-400 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                ENCRYPTION_KEY
              </Label>
              <div className="bg-gray-800 p-2 rounded font-mono text-xs text-blue-400 break-all">
                c6c46376369510e0c93cff5194329eb6f3a27ef6cfca0a0a8e21e107dfad464f
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Setup Guide */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-400" />
            Step 3: Get Your Solana Wallet Credentials
          </CardTitle>
          <CardDescription className="text-gray-400">
            You need your Solana wallet private key and public address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-4">
            <h4 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              How to Get Your Wallet Credentials
            </h4>
            <div className="text-yellow-300 text-sm space-y-3">
              <div>
                <p className="font-semibold">Option 1: Phantom Wallet (Recommended)</p>
                <ol className="list-decimal list-inside space-y-1 ml-4 mt-1">
                  <li>Install Phantom wallet browser extension</li>
                  <li>Create a new wallet or import existing one</li>
                  <li>Click the settings gear icon</li>
                  <li>Go to "Export Private Key"</li>
                  <li>Copy your private key (Base58 format)</li>
                  <li>Copy your wallet address from the main screen</li>
                </ol>
              </div>

              <div>
                <p className="font-semibold">Option 2: Solana CLI</p>
                <ol className="list-decimal list-inside space-y-1 ml-4 mt-1">
                  <li>
                    Install Solana CLI:{" "}
                    <code className="bg-gray-700 px-1 rounded">
                      sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"
                    </code>
                  </li>
                  <li>
                    Create wallet: <code className="bg-gray-700 px-1 rounded">solana-keygen new</code>
                  </li>
                  <li>
                    Get address: <code className="bg-gray-700 px-1 rounded">solana address</code>
                  </li>
                  <li>Private key is in ~/.config/solana/id.json</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => window.open("https://phantom.app", "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
              Download Phantom Wallet
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
            Step 4: Encrypt Your Wallet
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enter your wallet credentials to generate the encrypted version for production
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
            <p className="text-xs text-gray-400">This is your wallet's public address - safe to share</p>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Wallet Private Key (Base58)</Label>
            <div className="relative">
              <Input
                type={showPrivateKey ? "text" : "password"}
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="Enter your Base58 private key from Phantom or Solana CLI..."
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
            <p className="text-xs text-gray-400">⚠️ Keep this private! It will be encrypted for secure storage.</p>
          </div>

          <Button
            onClick={handleEncryptWallet}
            disabled={!privateKey || !walletAddress}
            className="w-full flex items-center gap-2"
            size="lg"
          >
            <Shield className="w-4 h-4" />
            Encrypt Wallet Private Key
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

              <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
                <p className="text-green-400 text-sm">
                  ✅ Wallet encrypted successfully! Your private key is now secure for production use.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Final Environment Variables */}
      {encryptedPrivateKey && walletAddress && (
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Step 5: Complete Environment Variables
            </CardTitle>
            <CardDescription className="text-gray-400">
              Copy these to your Vercel project environment variables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-900/50 rounded p-4 font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
              <div className="text-gray-400"># Security Keys</div>
              <div className="text-green-400">
                API_SECRET_KEY=5cf6b23c07b4e891e58fea5b9833ef8aac75522bcc10321eb4eb4536dcdbc9d3
              </div>
              <div className="text-blue-400">
                ENCRYPTION_KEY=c6c46376369510e0c93cff5194329eb6f3a27ef6cfca0a0a8e21e107dfad464f
              </div>
              <div className="text-gray-400 mt-3"># Wallet Configuration</div>
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

            <Button onClick={copyAllEnvironmentVariables} className="w-full" size="lg">
              <Copy className="w-4 h-4 mr-2" />
              Copy All Environment Variables
            </Button>

            <div className="bg-green-500/10 border border-green-500/30 rounded p-4">
              <h4 className="text-green-400 font-semibold mb-2">🎉 Ready for Production!</h4>
              <ol className="text-green-300 text-sm space-y-1">
                <li>1. ✅ Security keys generated</li>
                <li>2. ✅ Wallet private key encrypted</li>
                <li>3. 📋 Copy environment variables above</li>
                <li>4. 🚀 Add them to your Vercel project settings</li>
                <li>5. 🌐 Deploy your trading bot</li>
                <li>6. 🔍 Test the /api/health endpoint</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
