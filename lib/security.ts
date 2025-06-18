import crypto from "crypto"
import type { NextRequest } from "next/server"

// Rate limiting configuration
const RATE_LIMITS = {
  api: { requests: 100, window: 60000 }, // 100 requests per minute
  trading: { requests: 10, window: 60000 }, // 10 trades per minute
  auth: { requests: 5, window: 300000 }, // 5 auth attempts per 5 minutes
}

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(key: string, limit: { requests: number; window: number }) {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + limit.window })
    return { allowed: true, remaining: limit.requests - 1 }
  }

  if (record.count >= limit.requests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }

  record.count++
  return { allowed: true, remaining: limit.requests - record.count }
}

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const real = request.headers.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (real) {
    return real
  }

  return "unknown"
}

export function validateApiKey(apiKey: string | null): boolean {
  if (!apiKey || !process.env.API_SECRET_KEY) {
    return false
  }

  return crypto.timingSafeEqual(Buffer.from(apiKey), Buffer.from(process.env.API_SECRET_KEY))
}

export function sanitizeInput(input: any): any {
  if (typeof input === "string") {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
  }

  if (typeof input === "object" && input !== null) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value)
    }
    return sanitized
  }

  return input
}

export function encryptSensitiveData(data: string): string {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error("Encryption key not configured")
  }

  const algorithm = "aes-256-gcm"
  const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex")
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipher(algorithm, key)
  let encrypted = cipher.update(data, "utf8", "hex")
  encrypted += cipher.final("hex")

  return iv.toString("hex") + ":" + encrypted
}

export function decryptSensitiveData(encryptedData: string): string {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error("Encryption key not configured")
  }

  const algorithm = "aes-256-gcm"
  const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex")
  const [ivHex, encrypted] = encryptedData.split(":")
  const iv = Buffer.from(ivHex, "hex")

  const decipher = crypto.createDecipher(algorithm, key)
  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}
