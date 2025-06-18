#!/usr/bin/env tsx

import crypto from "crypto"
import { encryptSensitiveData } from "../lib/security"

async function setupProduction() {
  console.log("🚀 Setting up production environment...\n")

  // Generate API secret key
  const apiSecretKey = crypto.randomBytes(32).toString("hex")
  console.log("✅ Generated API Secret Key:")
  console.log(`API_SECRET_KEY=${apiSecretKey}\n`)

  // Generate encryption key
  const encryptionKey = crypto.randomBytes(32).toString("hex")
  console.log("✅ Generated Encryption Key:")
  console.log(`ENCRYPTION_KEY=${encryptionKey}\n`)

  // Encrypt wallet private key (if provided)
  const privateKey = process.argv[2]
  if (privateKey) {
    try {
      process.env.ENCRYPTION_KEY = encryptionKey
      const encryptedPrivateKey = encryptSensitiveData(privateKey)
      console.log("✅ Encrypted Wallet Private Key:")
      console.log(`WALLET_PRIVATE_KEY_ENCRYPTED=${encryptedPrivateKey}\n`)
    } catch (error) {
      console.error("❌ Failed to encrypt private key:", error)
    }
  }

  console.log("📋 Production Checklist:")
  console.log("□ Set all environment variables in Vercel dashboard")
  console.log("□ Configure premium Solana RPC endpoint")
  console.log("□ Set up monitoring and alerting")
  console.log("□ Configure rate limiting with Redis")
  console.log("□ Set up database for persistent storage")
  console.log("□ Configure Sentry for error tracking")
  console.log("□ Test all API endpoints with production data")
  console.log("□ Verify wallet security and access controls")
  console.log("□ Set up backup and recovery procedures")
  console.log("□ Configure CI/CD pipeline")
}

// Usage: npm run setup-production [private_key]
setupProduction().catch(console.error)
