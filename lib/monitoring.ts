export interface MetricData {
  name: string
  value: number
  timestamp: number
  tags?: Record<string, string>
}

export class MonitoringService {
  private static instance: MonitoringService
  private metrics: MetricData[] = []

  private constructor() {}

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }

  recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      tags,
    })

    // Keep only last 1000 metrics in memory
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }

    // Log critical metrics
    if (name.includes("error") || name.includes("failure")) {
      console.error(`🚨 Critical metric: ${name} = ${value}`, tags)
    }
  }

  getMetrics(name?: string): MetricData[] {
    if (name) {
      return this.metrics.filter((m) => m.name === name)
    }
    return this.metrics
  }

  // Health check endpoint data
  getHealthStatus(): {
    status: "healthy" | "degraded" | "unhealthy"
    uptime: number
    metrics: Record<string, number>
  } {
    const now = Date.now()
    const recentMetrics = this.metrics.filter((m) => now - m.timestamp < 300000) // Last 5 minutes

    const errorCount = recentMetrics.filter((m) => m.name.includes("error")).length
    const totalRequests = recentMetrics.filter((m) => m.name === "api.request").length

    let status: "healthy" | "degraded" | "unhealthy" = "healthy"

    if (errorCount > 0 && totalRequests > 0) {
      const errorRate = errorCount / totalRequests
      if (errorRate > 0.1) status = "unhealthy"
      else if (errorRate > 0.05) status = "degraded"
    }

    return {
      status,
      uptime: process.uptime(),
      metrics: {
        totalRequests,
        errorCount,
        errorRate: totalRequests > 0 ? errorCount / totalRequests : 0,
      },
    }
  }
}

// Middleware to track API metrics
export function trackApiMetrics(endpoint: string, method: string) {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method_original = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const monitoring = MonitoringService.getInstance()
      const startTime = Date.now()

      try {
        monitoring.recordMetric("api.request", 1, { endpoint, method })
        const result = await method_original.apply(this, args)

        const duration = Date.now() - startTime
        monitoring.recordMetric("api.response_time", duration, { endpoint, method })
        monitoring.recordMetric("api.success", 1, { endpoint, method })

        return result
      } catch (error) {
        const duration = Date.now() - startTime
        monitoring.recordMetric("api.response_time", duration, { endpoint, method })
        monitoring.recordMetric("api.error", 1, { endpoint, method })
        throw error
      }
    }
  }
}
