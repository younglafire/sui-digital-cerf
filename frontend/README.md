# Sui Digital Certificate - React Frontend

A React-based web interface for minting digital certificates on the Sui blockchain. This frontend provides a user-friendly alternative to using terminal commands.

## Features

- 🔐 Wallet connection using Sui Wallet Adapter
- 📝 Simple form interface for certificate minting
- ✅ Real-time transaction status and feedback
- 🔗 Direct links to view transactions on Sui Explorer
- 🎨 Modern, responsive UI design

## Prerequisites

1. **Deploy the Sui Move Contract** (if not already deployed)
   ```bash
   cd ../student_cerf
   sui client publish --gas-budget 100000000
   ```

2. **Save the deployment output:**
   - Package ID
   - IssuerCap Object ID
   - Registry Object ID

3. **Install a Sui Wallet:**
   - [Sui Wallet](https://chrome.google.com/webstore/detail/sui-wallet) (Chrome Extension)
   - [Suiet Wallet](https://suiet.app/) (Multi-platform)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure the contract:**
   
   Open `src/config.js` and update the following values with your deployed contract IDs:
   
   ```javascript
   export const CONTRACT_CONFIG = {
     PACKAGE_ID: '0x...', // Your package ID
     ISSUER_CAP: '0x...', // Your IssuerCap object ID
     REGISTRY: '0x...', // Your Registry object ID
     MODULE_NAME: 'student_cerf',
     MINT_FUNCTION: 'mint_certificate',
   };
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173` (or the URL shown in terminal)

## Usage

### For Schools (Certificate Issuers)

1. **Connect Wallet:**
   - Click "Connect Wallet" button
   - Select your Sui wallet
   - Make sure the connected wallet owns the IssuerCap

2. **Fill the Form:**
   - **Student Wallet Address**: The Sui address of the student (must start with `0x`)
   - **Student Name**: Full name of the student
   - **Course/Program**: Name of the course or program completed

3. **Mint Certificate:**
   - Click "Mint Certificate" button
   - Approve the transaction in your wallet
   - Wait for confirmation
   - View transaction on Sui Explorer

### Important Notes

- **Only the wallet holding IssuerCap can mint certificates**
- **Each student can receive only one certificate** (duplicate prevention)
- **Certificates are immutable** once minted
- **Gas fees are paid by the issuer** (the connected wallet)

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment

You can deploy the frontend to:

- **Vercel**: 
  ```bash
  npm install -g vercel
  vercel
  ```

- **Netlify**:
  ```bash
  npm install -g netlify-cli
  netlify deploy --prod
  ```

- **GitHub Pages**:
  ```bash
  npm run build
  # Deploy the dist/ folder
  ```

## Troubleshooting

### "Contract not configured" error
- Make sure you've updated `src/config.js` with your deployed contract IDs
- Package ID, IssuerCap, and Registry must not be `0x0`

### "Please connect your wallet first" error
- Install a Sui wallet extension
- Click the "Connect Wallet" button
- Approve the connection in your wallet

### Transaction fails
- Ensure the connected wallet owns the IssuerCap
- Check that the student address is valid
- Verify the student doesn't already have a certificate
- Make sure you have enough SUI for gas fees

### Wrong network
- Update `NETWORK` in `src/config.js` to match your deployment:
  - `'testnet'` for testnet
  - `'mainnet'` for mainnet

## Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **@mysten/dapp-kit** - Sui wallet integration
- **@mysten/sui.js** - Sui SDK
- **@tanstack/react-query** - Data fetching

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx           # Main application component
│   ├── App.css           # Application styles
│   ├── config.js         # Contract configuration
│   ├── main.jsx          # Entry point with providers
│   └── index.css         # Global styles
├── package.json          # Dependencies
└── vite.config.js        # Vite configuration
```

## Development

### Adding New Features

1. Create new components in `src/components/`
2. Import and use in `App.jsx`
3. Update styles in respective `.css` files

### Customizing Styles

- Global styles: `src/index.css`
- Component styles: `src/App.css`
- Modify colors, spacing, and layout as needed

## Related Documentation

- [Sui Documentation](https://docs.sui.io/)
- [Sui TypeScript SDK](https://sdk.mystenlabs.com/typescript)
- [Sui Wallet Kit](https://sdk.mystenlabs.com/dapp-kit)
- [React Documentation](https://react.dev/)

## Support

For issues or questions:
- Check the main [README.md](../README.md) for contract details
- Review [TERMINAL_GUIDE.md](../TERMINAL_GUIDE.md) for terminal alternatives
- Open an issue on GitHub

## License

This project is for educational and demonstration purposes.

---

Built with ❤️ for the Sui Hackathon
