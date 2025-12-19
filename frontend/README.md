# Sui School Digital Certification Portal

A React-based web application for issuing digital certificates on the Sui blockchain.

## Features

- 🎓 Simple certificate issuance interface
- 🔗 Sui wallet integration (required)
- 🔑 Self-issued certificates (no admin approval)
- 💎 Blockchain-based certificate storage
- ✨ Modern, responsive UI
- 📝 Stores only name and course on-chain

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Sui wallet extension (required for transactions)

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

Before running the app, update the contract details in `src/config.js`:

```javascript
export const PACKAGE_ID = 'YOUR_DEPLOYED_PACKAGE_ID'
export const NETWORK = 'testnet' // or 'devnet', 'mainnet'
```

### How to Get Package ID

1. Deploy the Move contract:
   ```bash
   cd ..
   sui client publish --gas-budget 100000000
   ```

2. From the deployment output:
   - Copy the `Package ID` to `PACKAGE_ID`

## Running the Application

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

1. Click "Connect Wallet" and connect your Sui wallet
2. Enter your name
3. Enter your course name
4. Click "Issue Certificate"
5. Approve the transaction in your wallet
6. Certificate minted as NFT and sent to your wallet!

## Features Explained

### Certificate Data

Each certificate stores only:
- **Student Name**: Your name
- **Course**: Course you completed

Simple and clean - no IDs or timestamps stored on-chain.

### Self-Issuance

- Anyone can issue their own certificate
- No admin approval required
- Certificate automatically sent to your wallet
- You control your own credentials

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
2. Updated `PACKAGE_ID` in `src/config.js`

### Wallet Connection Issues

- Ensure you have a Sui wallet extension installed
- Check that you're on the correct network (testnet/devnet/mainnet)
- Make sure your wallet has SUI tokens for gas fees

### Transaction Failures

- Verify the contract is deployed on the correct network
- Check that you have sufficient SUI for gas fees
- Ensure wallet is connected

## License

MIT
