import { NextResponse } from "next/server"

export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, 401)
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Rate limit exceeded") {
    super(message, 429)
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error)

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        statusCode: error.statusCode,
        timestamp: new Date().toISOString(),
      },
      { status: error.statusCode },
    )
  }

  // Handle Solana/Web3 errors
  if (error instanceof Error && error.message.includes("Transaction")) {
    return NextResponse.json(
      {
        error: "Transaction failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 400 },
    )
  }

  // Generic error
  return NextResponse.json(
    {
      error: "Internal server error",
      timestamp: new Date().toISOString(),
    },
    { status: 500 },
  )
}

export function validateEnvironment(): void {
  const requiredEnvVars = ["WALLET_PRIVATE_KEY", "SOLANA_RPC", "API_SECRET_KEY", "ENCRYPTION_KEY"]

  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}
