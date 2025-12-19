# Deployment Guide - Sui Digital Certification System

This guide walks you through deploying the complete digital certification system.

## Prerequisites

- Sui CLI installed and configured
- Node.js (v16+) and npm installed
- Sui wallet with testnet/devnet SUI tokens
- Git installed

## Step 1: Deploy Smart Contract

### 1.1 Build the Contract

```bash
cd /path/to/sui-digital-cerf
sui move build
```

Verify the build is successful with no errors.

### 1.2 Publish to Sui Network

For testnet:
```bash
sui client publish --gas-budget 100000000
```

For devnet:
```bash
sui client publish --gas-budget 100000000 --network devnet
```

### 1.3 Save Deployment Information

From the deployment output, save the Package ID:

**Example Output:**
```
----- Transaction Effects ----
Status : Success
Published Objects:
  - Package ID: 0x789xyz...
```

**Save this:**
- **Package ID**: `0x789xyz...`

## Step 2: Configure Frontend

### 2.1 Navigate to Frontend

```bash
cd frontend
```

### 2.2 Update Configuration

Edit `src/config.js`:

```javascript
// Replace with your actual Package ID
export const PACKAGE_ID = '0x789xyz...' // Your Package ID
export const NETWORK = 'testnet' // or 'devnet', 'mainnet'

// Customize if needed
export const SCHOOL_NAME = 'Sui School'
```

### 2.3 Install Dependencies

```bash
npm install
```

## Step 3: Test Locally

### 3.1 Run Development Server

```bash
npm run dev
```

### 3.2 Test Certificate Issuance

1. Open http://localhost:5173
2. Enter a name (e.g., "John Doe")
3. Click "Receive Certificate"
4. Verify certificate details are shown

### 3.3 Test with Wallet (Optional)

1. Click "Connect Wallet"
2. Connect your Sui wallet
3. Enter your name
4. Enter a course name
5. Click "Issue Certificate"
6. Approve transaction in wallet
7. Verify certificate is minted to your wallet

## Step 4: Build for Production

### 4.1 Create Production Build

```bash
npm run build
```

This creates optimized files in the `dist/` directory.

### 4.2 Test Production Build

```bash
npm run preview
```

Visit the preview URL to test the production build.

## Step 5: Deploy Frontend

### Option A: Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

Follow the prompts to deploy.

### Option B: Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

Choose the `dist` directory when prompted.

### Option C: Deploy to GitHub Pages

1. Update `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/sui-digital-cerf/' // Your repo name
})
```

2. Build:
```bash
npm run build
```

3. Deploy `dist` folder to gh-pages branch

### Option D: Static Hosting (AWS S3, etc.)

Simply upload the contents of the `dist/` directory to your hosting provider.

## Step 6: Verify Deployment

### 6.1 Check Frontend

- [ ] Page loads without errors
- [ ] Wallet connection works
- [ ] Certificate form is visible
- [ ] Certificate issuance works

### 6.2 Check Smart Contract

- [ ] Verify contract on Sui Explorer
- [ ] Test certificate issuance transaction

## Troubleshooting

### Issue: "Package ID is 0x0"

**Solution**: Update `frontend/src/config.js` with actual Package ID.

### Issue: Transaction Fails

**Possible causes:**
1. Insufficient gas - Add more SUI to your wallet
2. Wrong network - Ensure frontend config matches contract network
3. Wallet not connected - Connect your wallet first

### Issue: Wallet Won't Connect

**Solution:**
1. Install Sui Wallet extension
2. Create/import wallet
3. Switch to correct network (testnet/devnet)
4. Refresh the page

### Issue: Build Fails

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Environment Variables (Optional)

For production, you can use environment variables:

Create `.env`:
```
VITE_PACKAGE_ID=0x789xyz...
VITE_NETWORK=testnet
```

Update `src/config.js`:
```javascript
export const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID || '0x0'
export const NETWORK = import.meta.env.VITE_NETWORK || 'testnet'
```

## Post-Deployment Checklist

- [ ] Smart contract deployed successfully
- [ ] Package ID saved
- [ ] Frontend configured with correct Package ID
- [ ] Frontend deployed to hosting provider
- [ ] Certificate issuance tested end-to-end
- [ ] Documentation updated with deployment URL
- [ ] Users notified of new system

## Monitoring

### Track Certificates

Use Sui Explorer to monitor certificates:
```
https://suiexplorer.com/object/{CERTIFICATE_ID}?network={NETWORK}
```

### Check Events

Monitor `CertificateIssued` events on your contract.

## Updating

### Update Smart Contract

1. Make changes to `sources/student_cert.move`
2. Re-publish the contract
3. Update frontend `config.js` with new Package ID
4. Rebuild and redeploy frontend

### Update Frontend Only

1. Make changes to frontend code
2. Rebuild: `npm run build`
3. Redeploy the `dist` folder

## Security Considerations

- ✅ Never commit private keys
- ✅ Use environment variables for sensitive data
- ✅ Enable HTTPS in production
- ✅ Regular security audits recommended
- ✅ Anyone can issue their own certificate (by design)

## Support

- Sui Documentation: https://docs.sui.io/
- Sui Discord: https://discord.gg/sui
- Project Issues: [GitHub Issues](https://github.com/younglafire/sui-digital-cerf/issues)

---

**Congratulations!** Your digital certification system is now live! 🎓
