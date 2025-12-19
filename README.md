# Sui Digital Certification System

A blockchain-based digital certification platform built on Sui, featuring smart contracts for issuing tamper-proof certificates and a React frontend for easy certificate management.

## 🎓 Project Overview

This project consists of two main components:

1. **Smart Contract** (Move) - Handles certificate issuance and storage on the Sui blockchain
2. **Frontend** (React) - User-friendly web interface for students to receive certificates

## Features

- 🔒 **Secure & Immutable**: Certificates stored on Sui blockchain
- 🔑 **Self-Issued**: Any student can issue their own certificate (no admin approval needed)
- 🎯 **Soul-Bound Tokens**: Certificates cannot be transferred once issued
- 🌐 **Easy Access**: Simple web interface - just connect wallet
- 💎 **NFT-Based**: Each certificate is a unique NFT
- ✅ **Verifiable**: All certificates can be verified on-chain
- 📝 **Simple Data**: Only stores student name and course on blockchain

## Project Structure

```
sui-digital-cerf/
├── sources/              # Move smart contracts
│   └── student_cert.move # Certificate issuance contract
├── tests/                # Move contract tests
│   └── student_cert_tests.move
├── frontend/             # React web application
│   ├── src/
│   │   ├── App.jsx       # Main application
│   │   ├── config.js     # Configuration
│   │   └── ...
│   └── README.md         # Frontend documentation
├── Move.toml             # Move package configuration
└── README.md             # This file
```

## Quick Start

### Prerequisites

- [Sui CLI](https://docs.sui.io/build/install) installed
- Node.js (v16 or higher)
- npm or yarn

### 1. Deploy Smart Contract

```bash
# Build the contract
sui move build

# Publish to testnet (or devnet)
sui client publish --gas-budget 100000000
```

**Save the Package ID from the deployment output**

### 2. Configure Frontend

Navigate to `frontend/src/config.js` and update:

```javascript
export const PACKAGE_ID = 'YOUR_PACKAGE_ID'
export const NETWORK = 'testnet' // or 'devnet', 'mainnet'
```

### 3. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to access the application.

## How It Works

### For Students

1. Visit the web application
2. Connect your Sui wallet
3. Enter your full name
4. Enter your course name
5. Click "Issue Certificate"
6. Approve the transaction in your wallet
7. Certificate is minted and sent to your wallet!

### Certificate Details

Each certificate includes:
- **Student Name**: Your name
- **Course**: Course you completed

That's it! Simple and clean. No IDs, no admin approval needed.

### Smart Contract Functions

- `issue_certificate(name, course)`: Issue a certificate to yourself
- View functions: `get_student_name()`, `get_course()`

## Screenshots

### Certificate Issuance Interface
![Certificate Portal](https://github.com/user-attachments/assets/11342d09-2dd9-46f2-b74b-86e327f474f8)

### Successful Certificate Issuance
![Certificate Issued](https://github.com/user-attachments/assets/3082dab9-f0dd-4993-b740-112db5b2d467)

## Technology Stack

### Smart Contract
- **Sui Move**: Smart contract language
- **Sui Framework**: Blockchain framework

### Frontend
- **React**: UI library
- **Vite**: Build tool
- **@mysten/dapp-kit**: Sui wallet integration
- **@mysten/sui**: Sui SDK
- **@tanstack/react-query**: Data management

## Development

### Testing Smart Contracts

```bash
sui move test
```

### Building Frontend for Production

```bash
cd frontend
npm run build
```

## Configuration

### Smart Contract
- School name: Set in Move contract (`institution_name`)
- Degree program: Configurable per certificate

### Frontend
- School name: `src/config.js` → `SCHOOL_NAME`
- Network: `src/config.js` → `NETWORK`
- Styling: `src/App.css` and `src/index.css`

## Use Cases

- 🎓 Educational institutions issuing diplomas
- 🏆 Organizations issuing achievement certificates
- 📜 Professional certification programs
- 🎖️ Training completion certificates
- 🌟 Event participation certificates

## Future Enhancements

- [ ] Add certificate verification page
- [ ] Support multiple schools/institutions
- [ ] Add certificate templates
- [ ] Implement batch issuance
- [ ] Add admin dashboard
- [ ] Support for certificate revocation
- [ ] QR code generation for certificates

## Security

- Certificates are soul-bound (non-transferable)
- Only IssuerCap holder can issue certificates
- All data stored immutably on blockchain
- Student addresses are verified on-chain

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues or questions:
- Open an issue on GitHub
- Check the [Sui Documentation](https://docs.sui.io/)
- Visit [Sui Discord](https://discord.gg/sui)

---

Built with ❤️ on Sui Blockchain
