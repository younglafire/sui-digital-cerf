// Sui Network Configuration
export const NETWORK = 'testnet'; // Change to 'mainnet' for production

// Contract Configuration
// These values should be updated after deploying the contract
export const CONTRACT_CONFIG = {
  // Replace with your deployed package ID
  PACKAGE_ID: '0x0', // Update after deployment
  
  // Replace with your IssuerCap object ID
  ISSUER_CAP: '0x0', // Update after deployment
  
  // Replace with your Registry object ID
  REGISTRY: '0x0', // Update after deployment
  
  // Module name
  MODULE_NAME: 'student_cerf',
  
  // Function to call
  MINT_FUNCTION: 'mint_certificate',
};

// Instructions for updating these values
export const SETUP_INSTRUCTIONS = `
To use this application, you need to:

1. Deploy the Sui Move contract:
   cd student_cerf
   sui client publish --gas-budget 100000000

2. Copy the following IDs from the deployment output:
   - Package ID
   - IssuerCap Object ID
   - Registry Object ID

3. Update the CONTRACT_CONFIG in src/config.js with these values

4. Make sure you're connected with the wallet that owns the IssuerCap
`;
