"use client"

import { WalletEncryptionTool } from "@/components/wallet-encryption-tool"

export default function WalletSetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🔐 Complete Wallet Setup</h1>
          <p className="text-gray-400 text-lg">Encrypt your wallet credentials for secure production deployment</p>
        </div>
        <WalletEncryptionTool />
      </div>
    </div>
  )
}
