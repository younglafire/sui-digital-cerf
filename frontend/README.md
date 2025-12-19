# Sui Digital Certificate System - Frontend

A React-based frontend application for the Sui Digital Certificate System. This application allows students to connect their Sui wallets and mint digital certificates directly on the Sui blockchain for the "Move on Sui" course from Sui School.

## Features

- 🔐 **Sui Wallet Integration** - Connect with any Sui-compatible wallet
- 📝 **Direct On-Chain Minting** - Students sign transactions with their own wallet
- ⚡ **Real-time Status** - Loading states and transaction feedback
- 🎨 **Clean UI** - Modern, responsive design
- 🔒 **Security First** - Transactions signed by student's wallet, school controls IssuerCap

## Prerequisites

- Node.js 18+ and npm
- A Sui-compatible wallet (e.g., Sui Wallet, Suiet)
- Deployed smart contract on Sui (see `../student_cerf/`)

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

### 1. Deploy the Smart Contract

First, deploy the smart contract and note the output:

```bash
cd ../student_cerf
sui client publish --gas-budget 100000000
```

Save these values from the deployment output:
- **Package ID**: `0x...`
- **IssuerCap Object ID**: `0x...` (owned by school)
- **Registry Object ID**: `0x...` (shared object)

### 2. Configure Frontend

Copy the environment example file:
```bash
cd ../frontend
cp .env.example .env
```

Edit `.env` and add your contract IDs:
```env
# Sui Network (testnet, devnet, mainnet)
VITE_SUI_NETWORK=testnet

# Package ID from deployment
VITE_PACKAGE_ID=0xYOUR_PACKAGE_ID_HERE

# IssuerCap Object ID (owned by school)
VITE_ISSUER_CAP_ID=0xYOUR_ISSUER_CAP_ID_HERE

# Registry Object ID (shared object)
VITE_REGISTRY_ID=0xYOUR_REGISTRY_ID_HERE
```

**Important**: Replace the placeholder values with your actual contract IDs from the deployment.

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

### For Students

1. **Connect Wallet**
   - Click the "Connect Wallet" button in the header
   - Select your Sui wallet and approve the connection

2. **Request Certificate**
   - Enter your full name in the form
   - Review the course and school information (pre-filled)
   - Click "Request Certificate"
   - Sign the transaction in your wallet when prompted
   - Wait for the transaction to be confirmed on-chain

3. **Success**
   - Upon success, you'll see a confirmation message with transaction digest
   - Your certificate will be minted and transferred to your wallet address
   - You can view it in your Sui wallet or on the Sui explorer

### Certificate Details

- **Course Name**: Move on Sui (fixed)
- **School Name**: Sui School (fixed)
- **Issue Date**: Automatically generated from current timestamp
- **Student Address**: Read from connected wallet
- **Student Name**: Entered by the student

## Architecture

### How It Works

**Direct On-Chain Minting:**
1. Student connects their Sui wallet to the frontend
2. Student enters their name and submits the form
3. Frontend creates a transaction calling `mint_certificate`
4. Transaction uses school's IssuerCap (referenced by object ID)
5. Student signs the transaction with their wallet
6. Certificate is minted and transferred to student's address

**Why This Works:**
- The `mint_certificate` function requires the IssuerCap as an argument
- IssuerCap is owned by the school, but can be referenced by its object ID
- Students sign the transaction, but the IssuerCap proves school authorization
- The certificate is transferred directly to the student's wallet

### Frontend Flow

```
User → Connect Wallet → Enter Name → Sign Transaction → Sui Blockchain → Certificate Minted
```

### Key Components

- **WalletConnection** - Handles Sui wallet connection UI
- **CertificateMintForm** - Form for certificate request and transaction signing
- **config.ts** - Smart contract configuration (Package ID, IssuerCap ID, Registry ID)
- **App** - Main application container

### Security Design

✅ **Student Signs Transaction** - Students use their own wallet to sign
✅ **School Controls IssuerCap** - IssuerCap remains owned by school
✅ **Direct On-Chain** - No intermediary backend needed
✅ **Address Verification** - Connected wallet address is used
✅ **No Private Keys** - Frontend never handles private keys

## Smart Contract Integration

The frontend directly calls the Sui smart contract:

### Transaction Details

**Function Called**: `mint_certificate`

**Arguments**:
- `IssuerCap` - School's issuer capability (by object ID reference)
- `Registry` - Shared registry object (by object ID reference)
- `student` - Student's wallet address
- `student_name` - Entered by student
- `course` - Fixed: "Move on Sui"
- `issue_date` - Current Unix timestamp

**What Happens**:
1. Transaction is created with the smart contract call
2. Student signs the transaction with their wallet
3. Transaction is executed on Sui blockchain
4. Certificate is minted and transferred to student
5. Registry is updated to prevent duplicates
```

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **@mysten/dapp-kit** - Sui wallet integration
- **@mysten/sui** - Sui SDK
- **@tanstack/react-query** - Data fetching and caching

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── WalletConnection.tsx    # Wallet connection UI
│   │   └── CertificateMintForm.tsx # Certificate request form
│   ├── config.ts                   # Smart contract configuration
│   ├── App.tsx                     # Main application
│   ├── App.css                     # Application styles
│   ├── main.tsx                    # Entry point with providers
│   └── index.css                   # Global styles
├── .env                            # Environment configuration (not committed)
├── .env.example                    # Environment template
├── package.json                    # Dependencies
└── vite.config.ts                  # Vite configuration
```

## Troubleshooting

### "Missing required environment variables" Error

**Problem**: You see an error about missing `VITE_PACKAGE_ID`, `VITE_ISSUER_CAP_ID`, or `VITE_REGISTRY_ID`.

**Solution**: 
1. Make sure you've created a `.env` file: `cp .env.example .env`
2. Deploy the smart contract if you haven't: `cd ../student_cerf && sui client publish --gas-budget 100000000`
3. Copy the Package ID, IssuerCap ID, and Registry ID from deployment output
4. Add them to your `.env` file

### Wallet Connection Issues

- Ensure you have a Sui wallet installed (Sui Wallet, Suiet, etc.)
- Check that your wallet is connected to the correct network (testnet/devnet/mainnet)
- Try refreshing the page and reconnecting
- Make sure your wallet extension is unlocked

### "Failed to fetch" or Connection Errors

**This should no longer happen!** The frontend now calls the blockchain directly, not a backend API.

If you still see this error:
- Check your `.env` file has all required variables
- Verify the contract IDs are correct
- Make sure you're on the correct network

### Transaction Failures

**"Already has certificate"**: Each student can only receive one certificate. Check if you already have one in your wallet.

**"Insufficient gas"**: Make sure your wallet has SUI tokens for gas fees. Get testnet tokens: `sui client faucet`

**"Object not found"**: Verify your contract IDs in `.env` are correct from your deployment.

**Transaction rejected**: Make sure you approve the transaction in your wallet when prompted.

## Contributing

This is a hackathon project. Feel free to fork and improve!

## License

Educational and demonstration purposes.

---

**Built with ❤️ on Sui Blockchain**
