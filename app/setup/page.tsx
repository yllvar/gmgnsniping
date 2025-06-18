"use client"

import { KeyGenerator } from "@/components/key-generator"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🔐 Production Setup</h1>
          <p className="text-gray-400 text-lg">
            Generate security keys and encrypt your wallet for production deployment
          </p>
        </div>
        <KeyGenerator />
      </div>
    </div>
  )
}
