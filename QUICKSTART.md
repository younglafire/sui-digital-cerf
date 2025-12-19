# Quick Start Guide 🚀

Get your digital certification system up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js version (need v16+)
node --version

# Check if Sui CLI is installed
sui --version
```

If you don't have these, install them first:
- Node.js: https://nodejs.org/
- Sui CLI: https://docs.sui.io/build/install

## Step 1: Clone Repository (if needed)

```bash
git clone https://github.com/younglafire/sui-digital-cerf.git
cd sui-digital-cerf
```

## Step 2: Deploy Smart Contract

```bash
# Build the contract
sui move build

# Publish to testnet
sui client publish --gas-budget 100000000
```

**IMPORTANT**: Copy these from the output:
- Package ID (looks like `0x123abc...`)
- IssuerCap Object ID (looks like `0x456def...`)

## Step 3: Configure Frontend

```bash
cd frontend

# Open config file
# Edit src/config.js and replace:
# - PACKAGE_ID with your Package ID
# - ISSUER_CAP_ID with your IssuerCap Object ID
```

Example `src/config.js`:
```javascript
export const PACKAGE_ID = '0x123abc...' // YOUR Package ID here
export const ISSUER_CAP_ID = '0x456def...' // YOUR IssuerCap ID here
export const NETWORK = 'testnet'
```

## Step 4: Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Step 5: Test It Out! 🎉

1. Open http://localhost:5173
2. Enter a name (e.g., "John Doe")
3. Click "🎓 Receive Certificate"
4. See your certificate with auto-generated IDs!

## Optional: Connect Wallet

1. Install Sui Wallet browser extension
2. Create/import a wallet
3. Switch to testnet
4. Get testnet SUI from faucet: https://discord.gg/sui
5. Click "Connect Wallet" on the app
6. Issue a certificate - it will be saved on blockchain!

## Troubleshooting

### "Package ID is 0x0"
➜ Update `frontend/src/config.js` with your actual Package ID and IssuerCap ID

### "Cannot connect to server"
➜ Make sure you ran `npm run dev` in the frontend directory

### "Transaction failed"
➜ Check:
  - You have SUI tokens in your wallet
  - IssuerCap ID is correct
  - Network matches (testnet/devnet)

### "npm install fails"
➜ Try:
```bash
rm -rf node_modules package-lock.json
npm install
```

## What Next?

### For Development
- Customize styles in `frontend/src/App.css`
- Update school name in `frontend/src/config.js`
- Modify certificate fields in `frontend/src/App.jsx`

### For Production
- Build: `npm run build`
- Deploy `dist/` folder to hosting (Vercel, Netlify, etc.)
- See full deployment guide: `DEPLOYMENT.md`

## Key Files

```
sui-digital-cerf/
├── sources/student_cert.move    # Smart contract
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main app component
│   │   ├── config.js            # Configuration (UPDATE THIS!)
│   │   └── ...
│   └── package.json
├── README.md                     # Full documentation
├── DEPLOYMENT.md                 # Detailed deployment guide
└── QUICKSTART.md                 # This file
```

## Need Help?

- 📖 Full docs: See `README.md`
- 🚀 Deployment: See `DEPLOYMENT.md`
- 💬 Issues: https://github.com/younglafire/sui-digital-cerf/issues
- 🌐 Sui Docs: https://docs.sui.io/

---

**That's it!** You now have a working digital certification system! 🎓✨
