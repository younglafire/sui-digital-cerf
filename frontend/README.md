# Sui Digital Certificate System - Frontend

A React-based frontend application for the Sui Digital Certificate System. This application allows students to connect their Sui wallets and request digital certificates for the "Move on Sui" course from Sui School.

## Features

- 🔐 **Sui Wallet Integration** - Connect with any Sui-compatible wallet
- 📝 **Simple Certificate Request** - One-click certificate minting via backend API
- ⚡ **Real-time Status** - Loading states and transaction feedback
- 🎨 **Clean UI** - Modern, responsive design
- 🔒 **Security First** - No private keys or issuer authority in frontend

## Prerequisites

- Node.js 18+ and npm
- A Sui-compatible wallet (e.g., Sui Wallet, Suiet)
- Backend API running (for certificate minting)

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

1. Copy the environment example file:
```bash
cp .env.example .env
```

2. Configure your environment variables in `.env`:
```env
# Backend API URL for minting certificates
VITE_BACKEND_API_URL=http://localhost:3000

# Sui Network (testnet, devnet, mainnet)
VITE_SUI_NETWORK=testnet
```

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
   - Wait for the backend to process the minting

3. **Success**
   - Upon success, you'll see a confirmation message
   - Your certificate will be minted and transferred to your wallet address
   - You can view it in your Sui wallet

### Certificate Details

- **Course Name**: Move on Sui (fixed)
- **School Name**: Sui School (fixed)
- **Issue Date**: Automatically generated from current timestamp
- **Student Address**: Read from connected wallet
- **Student Name**: Entered by the student

## Architecture

### Frontend Flow

```
User → Connect Wallet → Enter Name → Submit Form → Backend API → Sui Blockchain
```

### Key Components

- **WalletConnection** - Handles Sui wallet connection UI
- **CertificateMintForm** - Form for certificate request
- **App** - Main application container

### Security Design

✅ **No Private Keys** - Frontend never handles private keys
✅ **No IssuerCap** - Frontend doesn't have minting authority
✅ **Backend-Triggered** - All minting happens through secure backend
✅ **Address Verification** - Connected wallet address is used

## Backend API Integration

The frontend expects a backend API with the following endpoint:

### POST /mint-certificate

Request body:
```json
{
  "studentAddress": "0x...",
  "studentName": "John Doe",
  "course": "Move on Sui",
  "school": "Sui School",
  "issueDate": 1734573600
}
```

Response:
```json
{
  "success": true,
  "message": "Certificate minted successfully",
  "transactionDigest": "0x...",
  "certificateId": "1"
}
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
│   │   ├── WalletConnection.tsx   # Wallet connection UI
│   │   └── CertificateMintForm.tsx # Certificate request form
│   ├── App.tsx                     # Main application
│   ├── App.css                     # Application styles
│   ├── main.tsx                    # Entry point with providers
│   └── index.css                   # Global styles
├── .env                            # Environment configuration
├── .env.example                    # Environment template
├── package.json                    # Dependencies
└── vite.config.ts                  # Vite configuration
```

## Troubleshooting

### Wallet Connection Issues

- Ensure you have a Sui wallet installed
- Check that your wallet is connected to the correct network (testnet)
- Try refreshing the page and reconnecting

### Backend Connection Issues

- Verify the backend API is running
- Check `VITE_BACKEND_API_URL` in your `.env` file
- Check browser console for CORS errors

### Transaction Failures

- Ensure the backend has sufficient SUI tokens for gas
- Verify the backend has the IssuerCap
- Check that you haven't already received a certificate (duplicates not allowed)

## Contributing

This is a hackathon project. Feel free to fork and improve!

## License

Educational and demonstration purposes.

---

**Built with ❤️ on Sui Blockchain**
