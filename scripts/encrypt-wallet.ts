#!/usr/bin/env tsx
import crypto from "crypto"

function encryptWalletKey(privateKey: string, encryptionKey: string): string {
  const algorithm = "aes-256-gcm"
  const key = Buffer.from(encryptionKey, "hex")
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipher(algorithm, key)
  let encrypted = cipher.update(privateKey, "utf8", "hex")
  encrypted += cipher.final("hex")

  return iv.toString("hex") + ":" + encrypted
}

function main() {
  const privateKey = process.argv[2]
  const encryptionKey = process.argv[3]

  if (!privateKey || !encryptionKey) {
    console.log("Usage: npm run encrypt-wallet <private_key> <encryption_key>")
    console.log("Example: npm run encrypt-wallet 'your_base58_private_key' 'your_64_char_encryption_key'")
    process.exit(1)
  }

  try {
    const encryptedKey = encryptWalletKey(privateKey, encryptionKey)
    console.log("✅ WALLET_PRIVATE_KEY_ENCRYPTED (copy this to Vercel):")
    console.log(encryptedKey)
    console.log()
    console.log("⚠️  Delete your plain text private key from environment variables!")
  } catch (error) {
    console.error("❌ Encryption failed:", error)
    process.exit(1)
  }
}

main()
