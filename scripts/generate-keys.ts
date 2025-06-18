#!/usr/bin/env tsx
import crypto from "crypto"

function generateSecurityKeys() {
  console.log("🔐 Generating security keys for production...\n")

  // Generate API Secret Key (32 bytes = 64 hex characters)
  const apiSecretKey = crypto.randomBytes(32).toString("hex")
  console.log("✅ API_SECRET_KEY (copy this to Vercel):")
  console.log(apiSecretKey)
  console.log()

  // Generate Encryption Key (32 bytes = 64 hex characters)
  const encryptionKey = crypto.randomBytes(32).toString("hex")
  console.log("✅ ENCRYPTION_KEY (copy this to Vercel):")
  console.log(encryptionKey)
  console.log()

  console.log("📋 Next steps:")
  console.log("1. Copy these keys to your Vercel environment variables")
  console.log("2. Run the wallet encryption script with your private key")
  console.log("3. Deploy to production")
}

generateSecurityKeys()
