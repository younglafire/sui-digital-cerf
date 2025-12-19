# Sui School Digital Certification Portal

A React-based web application for issuing and managing digital certificates on the Sui blockchain.

## Features

- 🎓 Simple certificate issuance interface
- 🔗 Sui wallet integration (optional for preview)
- 🆔 Auto-generated certificate and student IDs
- 💎 Blockchain-based certificate storage
- ✨ Modern, responsive UI

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Sui wallet extension (for blockchain transactions)

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

Before running the app, update the contract details in `src/config.js`:

```javascript
export const PACKAGE_ID = 'YOUR_DEPLOYED_PACKAGE_ID'
export const ISSUER_CAP_ID = 'YOUR_ISSUER_CAP_OBJECT_ID'
export const NETWORK = 'testnet' // or 'devnet', 'mainnet'
```

### How to Get These Values

1. Deploy the Move contract:
   ```bash
   cd ..
   sui client publish --gas-budget 100000000
   ```

2. From the deployment output:
   - Copy the `Package ID` to `PACKAGE_ID`
   - Find the `IssuerCap` object ID and copy it to `ISSUER_CAP_ID`

## Running the Application

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

### Without Wallet (Preview Mode)

1. Enter your name in the form
2. Click "Receive Certificate"
3. View the generated certificate details

### With Wallet (Blockchain Mode)

1. Click "Connect Wallet" and connect your Sui wallet
2. Enter your name in the form
3. Click "Receive Certificate"
4. Approve the transaction in your wallet
5. The certificate will be minted as an NFT and transferred to your address

## Features Explained

### Auto-Generated IDs

- **Certificate ID**: Format `CERT-SUI-SCHOOL-XXXXXX` (sequential)
- **Student ID**: Format `STU-XXXXXXXX` (timestamp-based)

### Certificate Details

Each certificate includes:
- Student Name
- Student ID (auto-generated)
- Certificate ID (auto-generated)
- School Name: "Sui School"
- Degree Program: "Blockchain Development"
- Issue Date (blockchain timestamp)
- Issuer Address

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technology Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **@mysten/dapp-kit** - Sui wallet integration
- **@mysten/sui** - Sui blockchain SDK
- **@tanstack/react-query** - Data fetching and caching

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.jsx         # Application entry point with providers
│   ├── config.js        # Configuration (contract addresses, etc.)
│   └── index.css        # Global styles
├── public/              # Static assets
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## Troubleshooting

### "Package ID is 0x0" Error

Make sure you've:
1. Deployed the Move contract
2. Updated `PACKAGE_ID` and `ISSUER_CAP_ID` in `src/config.js`

### Wallet Connection Issues

- Ensure you have a Sui wallet extension installed
- Check that you're on the correct network (testnet/devnet/mainnet)
- Make sure your wallet has SUI tokens for gas fees

### Transaction Failures

- Verify the contract is deployed on the correct network
- Ensure the `IssuerCap` object ID is correct
- Check that you have sufficient SUI for gas fees

## License

MIT
