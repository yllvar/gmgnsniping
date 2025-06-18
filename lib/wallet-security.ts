import { Keypair } from "@solana/web3.js"
import bs58 from "bs58"
import { encryptSensitiveData, decryptSensitiveData } from "./security"

export class SecureWalletManager {
  private static instance: SecureWalletManager
  private wallet: Keypair | null = null
  private isInitialized = false

  private constructor() {}

  static getInstance(): SecureWalletManager {
    if (!SecureWalletManager.instance) {
      SecureWalletManager.instance = new SecureWalletManager()
    }
    return SecureWalletManager.instance
  }

  async initializeWallet(): Promise<void> {
    if (this.isInitialized) return

    const encryptedPrivateKey = process.env.WALLET_PRIVATE_KEY_ENCRYPTED
    const plainPrivateKey = process.env.WALLET_PRIVATE_KEY

    if (!encryptedPrivateKey && !plainPrivateKey) {
      throw new Error("No wallet private key configured")
    }

    try {
      let privateKeyString: string

      if (encryptedPrivateKey) {
        privateKeyString = decryptSensitiveData(encryptedPrivateKey)
      } else if (plainPrivateKey) {
        // Log warning about unencrypted key
        console.warn("⚠️  Using unencrypted private key. Consider encrypting for production.")
        privateKeyString = plainPrivateKey
      } else {
        throw new Error("Invalid wallet configuration")
      }

      const privateKeyBytes = bs58.decode(privateKeyString)
      this.wallet = Keypair.fromSecretKey(privateKeyBytes)
      this.isInitialized = true

      // Clear the private key from memory
      privateKeyString = ""
    } catch (error) {
      console.error("Failed to initialize wallet:", error)
      throw new Error("Wallet initialization failed")
    }
  }

  getWallet(): Keypair {
    if (!this.isInitialized || !this.wallet) {
      throw new Error("Wallet not initialized. Call initializeWallet() first.")
    }
    return this.wallet
  }

  getPublicKey(): string {
    return this.getWallet().publicKey.toBase58()
  }

  // Utility to encrypt existing private key
  static encryptPrivateKey(privateKey: string): string {
    return encryptSensitiveData(privateKey)
  }
}
