import { DashboardClient } from "@/components/dashboard-client"
import { getBotStatus } from "@/lib/server-actions"

// This is a Server Component
export default async function Dashboard() {
  // Fetch data on the server
  const initialData = await getBotStatus()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <DashboardClient initialData={initialData} />
    </div>
  )
}
