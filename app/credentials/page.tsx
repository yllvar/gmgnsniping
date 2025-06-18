"use client"

import { CredentialGuide } from "@/components/credential-guide"

export default function CredentialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto p-6">
        <CredentialGuide />
      </div>
    </div>
  )
}
