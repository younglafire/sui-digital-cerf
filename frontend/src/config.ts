// Sui Smart Contract Configuration
// Replace these with your actual deployed contract IDs from `sui client publish`

export const CONTRACT_CONFIG = {
  // Package ID from deployment output
  PACKAGE_ID: import.meta.env.VITE_PACKAGE_ID || '',
  
  // IssuerCap object ID (owned by school address)
  ISSUER_CAP_ID: import.meta.env.VITE_ISSUER_CAP_ID || '',
  
  // Registry object ID (shared object)
  REGISTRY_ID: import.meta.env.VITE_REGISTRY_ID || '',
  
  // Sui network to use
  NETWORK: (import.meta.env.VITE_SUI_NETWORK || 'testnet') as 'testnet' | 'devnet' | 'mainnet',
}

// Validate configuration
export function validateConfig() {
  const missing: string[] = []
  
  if (!CONTRACT_CONFIG.PACKAGE_ID) missing.push('VITE_PACKAGE_ID')
  if (!CONTRACT_CONFIG.ISSUER_CAP_ID) missing.push('VITE_ISSUER_CAP_ID')
  if (!CONTRACT_CONFIG.REGISTRY_ID) missing.push('VITE_REGISTRY_ID')
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please add these to your .env file. See .env.example for reference.'
    )
  }
}
