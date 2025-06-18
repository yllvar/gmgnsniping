import { ApiHealthChecker } from "@/components/api-health-checker"
import { ComprehensiveTestSuite } from "@/components/comprehensive-test-suite"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">🧪 GMGN Bot Testing Suite</h1>
          <p className="text-gray-400 text-lg">Comprehensive testing for your Solana trading bot</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ApiHealthChecker />
          </div>
          <div className="lg:col-span-2">
            <ComprehensiveTestSuite />
          </div>
        </div>
      </div>
    </div>
  )
}
