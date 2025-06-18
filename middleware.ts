import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { rateLimit, getClientIP, validateApiKey } from "./lib/security"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only apply middleware to API routes
  if (pathname.startsWith("/api/")) {
    // Skip health check from authentication
    if (pathname === "/api/health") {
      return NextResponse.next()
    }

    // Add CORS headers
    const response = NextResponse.next()
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    // Rate limiting for API routes
    const clientIP = getClientIP(request)
    const rateLimitKey = `api:${clientIP}`

    const { allowed, remaining, resetTime } = rateLimit(rateLimitKey, {
      requests: 100,
      window: 60000,
    })

    if (!allowed) {
      return new NextResponse("Rate limit exceeded", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": "100",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": resetTime?.toString() || "",
        },
      })
    }

    // API key validation for sensitive endpoints
    if (pathname.startsWith("/api/bot/") || pathname.startsWith("/api/trades/execute")) {
      const apiKey = request.headers.get("x-api-key")

      if (!validateApiKey(apiKey)) {
        return new NextResponse("Unauthorized", { status: 401 })
      }
    }

    response.headers.set("X-RateLimit-Limit", "100")
    response.headers.set("X-RateLimit-Remaining", remaining.toString())

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}
