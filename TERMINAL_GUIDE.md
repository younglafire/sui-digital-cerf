# Terminal Usage Guide - Sui Digital Certificate System

This guide provides step-by-step terminal commands for using the digital certificate system.

## Quick Start Summary

```bash
# 1. Build the contract
cd student_cerf
sui move build

# 2. Run tests
sui move test

# 3. Deploy to testnet
sui client publish --gas-budget 100000000

# 4. Mint a certificate (school only)
sui client call \
  --package <PACKAGE_ID> \
  --module student_cerf \
  --function mint_certificate \
  --args <ISSUER_CAP_ID> <REGISTRY_ID> <STUDENT_ADDRESS> '"Student Name"' '"Course Name"' <TIMESTAMP> \
  --gas-budget 10000000
```

## Detailed Step-by-Step Guide

### Prerequisites Setup

#### 1. Install Sui CLI

**Option A: Using Cargo (Recommended)**
```bash
# Install Sui CLI from source
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui

# Verify installation
sui --version
```

**Option B: Download Pre-built Binary**
```bash
# For Linux
cd /tmp
wget https://github.com/MystenLabs/sui/releases/download/testnet-v1.38.3/sui-testnet-v1.38.3-ubuntu-x86_64.tgz
tar -xzf sui-testnet-v1.38.3-ubuntu-x86_64.tgz
sudo mv sui /usr/local/bin/
sui --version
```

#### 2. Initialize Sui Client

```bash
# Initialize Sui client (first time only)
sui client

# Select testnet when prompted
# This creates ~/.sui/sui_config/client.yaml
```

#### 3. Check Your Address

```bash
# View your active address
sui client active-address

# List all your addresses
sui client addresses

# Switch to different address if needed
sui client switch --address <ADDRESS>
```

#### 4. Get Testnet Tokens

```bash
# Request testnet SUI tokens from faucet
sui client faucet

# Check your balance
sui client gas

# Expected output shows your gas objects and balances
```

### Building and Testing

#### 1. Navigate to Project

```bash
# Clone repository (if not already done)
git clone https://github.com/younglafire/sui-digital-cerf.git
cd sui-digital-cerf/student_cerf
```

#### 2. Build the Contract

```bash
# Build the Move package
sui move build

# Expected output:
# INCLUDING DEPENDENCY Sui
# INCLUDING DEPENDENCY MoveStdlib  
# BUILDING student_cerf
```

#### 3. Run Tests

```bash
# Run all tests
sui move test

# Run with verbose output
sui move test --verbose

# Run specific test
sui move test test_mint_certificate_success
```

### Deployment

#### 1. Deploy to Testnet

```bash
# Publish the package to Sui testnet
sui client publish --gas-budget 100000000

# ⚠️ IMPORTANT: Save the output!
# You'll need:
# - Package ID: 0x<PACKAGE_ID>
# - IssuerCap Object ID: 0x<ISSUER_CAP_ID>
# - Registry Object ID: 0x<REGISTRY_ID>
```

#### 2. Save Important IDs

```bash
# Create environment variables for easy reuse
export PACKAGE_ID=0x<YOUR_PACKAGE_ID>
export ISSUER_CAP=0x<YOUR_ISSUER_CAP_ID>
export REGISTRY=0x<YOUR_REGISTRY_ID>

# Save to file for future sessions
cat >> ~/.bashrc << EOF
# Sui Digital Certificate System
export PACKAGE_ID=0x<YOUR_PACKAGE_ID>
export ISSUER_CAP=0x<YOUR_ISSUER_CAP_ID>
export REGISTRY=0x<YOUR_REGISTRY_ID>
EOF

# Reload
source ~/.bashrc
```

#### 3. Verify Deployment

```bash
# View the IssuerCap object
sui client object $ISSUER_CAP --json

# View the Registry object
sui client object $REGISTRY --json

# Check package details
sui client object $PACKAGE_ID
```

### School Operations (Certificate Issuing)

#### 1. Mint a Certificate for a Student

```bash
# Set student address
export STUDENT_ADDRESS=0x<STUDENT_SUI_ADDRESS>

# Mint certificate
sui client call \
  --package $PACKAGE_ID \
  --module student_cerf \
  --function mint_certificate \
  --args $ISSUER_CAP $REGISTRY $STUDENT_ADDRESS '"Alice Smith"' '"Computer Science"' 1734573600 \
  --gas-budget 10000000

# Parameters explained:
# - $ISSUER_CAP: Your IssuerCap object (proves you're the school)
# - $REGISTRY: The shared Registry object
# - $STUDENT_ADDRESS: Student's Sui wallet address
# - "Alice Smith": Student's full name (in quotes)
# - "Computer Science": Course/program name (in quotes)
# - 1734573600: Issue date as Unix timestamp
```

#### 2. Generate Unix Timestamp

```bash
# Current timestamp
date +%s

# Specific date (example: December 19, 2024)
date -d "2024-12-19" +%s

# On macOS
date -j -f "%Y-%m-%d" "2024-12-19" +%s
```

#### 3. Mint Certificates for Multiple Students

```bash
# Create a script for batch minting
cat > mint_certificates.sh << 'EOF'
#!/bin/bash

# Array of students (address, name, course)
students=(
  "0xStudent1Address:John Doe:Computer Science"
  "0xStudent2Address:Jane Smith:Data Science"
  "0xStudent3Address:Bob Johnson:Mathematics"
)

# Current timestamp
TIMESTAMP=$(date +%s)

# Mint certificate for each student
for student in "${students[@]}"; do
  IFS=':' read -r ADDRESS NAME COURSE <<< "$student"
  
  echo "Minting certificate for $NAME..."
  
  sui client call \
    --package $PACKAGE_ID \
    --module student_cerf \
    --function mint_certificate \
    --args $ISSUER_CAP $REGISTRY $ADDRESS "\"$NAME\"" "\"$COURSE\"" $TIMESTAMP \
    --gas-budget 10000000
  
  sleep 2  # Wait between transactions
done

echo "All certificates minted!"
EOF

chmod +x mint_certificates.sh
./mint_certificates.sh
```

#### 4. Check Registry Status

```bash
# View registry to see all issued certificates
sui client object $REGISTRY --json | jq '.content.fields'

# Count total certificates issued
sui client object $REGISTRY --json | jq '.content.fields.next_certificate_id'
```

#### 5. Create Additional IssuerCap (Optional)

```bash
# Create a new IssuerCap for another administrator
export NEW_ADMIN_ADDRESS=0x<NEW_ADMIN_ADDRESS>

sui client call \
  --package $PACKAGE_ID \
  --module student_cerf \
  --function create_issuer_cap \
  --args $ISSUER_CAP '"Another School Name"' $NEW_ADMIN_ADDRESS \
  --gas-budget 10000000
```

### Student Operations (Certificate Viewing)

#### 1. List Your Objects

```bash
# Switch to student wallet
sui client switch --address <STUDENT_ADDRESS>

# List all owned objects
sui client objects

# Look for Certificate object in the output
```

#### 2. View Your Certificate

```bash
# View certificate details (replace with your certificate object ID)
export CERTIFICATE_ID=0x<YOUR_CERTIFICATE_ID>

sui client object $CERTIFICATE_ID --json

# Pretty print with jq
sui client object $CERTIFICATE_ID --json | jq '.'
```

#### 3. Extract Certificate Information

```bash
# Get all certificate fields
sui client object $CERTIFICATE_ID --json | jq '.content.fields'

# Get specific fields
sui client object $CERTIFICATE_ID --json | jq '.content.fields.student_name'
sui client object $CERTIFICATE_ID --json | jq '.content.fields.course'
sui client object $CERTIFICATE_ID --json | jq '.content.fields.issue_date'
sui client object $CERTIFICATE_ID --json | jq '.content.fields.certificate_id'
```

#### 4. Verify Certificate Authenticity

```bash
# Verify certificate exists on-chain
sui client object $CERTIFICATE_ID

# Verify owner matches student address
sui client object $CERTIFICATE_ID --json | jq '.owner'

# Check certificate in registry
sui client object $REGISTRY --json | jq '.content.fields.issued_certificates'
```

### Query Operations

#### 1. Check if Student Has Certificate

```bash
# View registry and search for student address
sui client object $REGISTRY --json | jq '.content.fields.issued_certificates' | grep -i <STUDENT_ADDRESS>
```

#### 2. Get Total Certificates Issued

```bash
# Get the next certificate ID (current count + 1)
sui client object $REGISTRY --json | jq '.content.fields.next_certificate_id'

# Total issued = next_certificate_id - 1
```

#### 3. Export All Certificates

```bash
# Export registry data to file
sui client object $REGISTRY --json > registry_backup.json

# View in formatted way
jq '.' registry_backup.json
```

### Troubleshooting

#### Issue: "Insufficient gas"

```bash
# Solution 1: Request more testnet tokens
sui client faucet

# Solution 2: Increase gas budget
--gas-budget 20000000
```

#### Issue: "Object not found"

```bash
# Verify your object IDs
sui client objects

# Check active address
sui client active-address

# Ensure you're on the correct network
cat ~/.sui/sui_config/client.yaml | grep active_env
```

#### Issue: "Already has certificate" error

```bash
# This is expected if trying to mint duplicate
# Check if student already has certificate
sui client object $REGISTRY --json | jq '.content.fields.issued_certificates'
```

#### Issue: "Cannot find IssuerCap"

```bash
# Make sure you're using the correct address
sui client switch --address <SCHOOL_ADDRESS>

# List objects to find IssuerCap
sui client objects | grep IssuerCap
```

### Advanced Usage

#### Monitor Transactions

```bash
# Subscribe to events from your package
sui client events --package $PACKAGE_ID

# View recent transactions
sui client transactions
```

#### Use Different Networks

```bash
# Add devnet
sui client new-env --alias devnet --rpc https://fullnode.devnet.sui.io:443

# Add mainnet  
sui client new-env --alias mainnet --rpc https://fullnode.mainnet.sui.io:443

# Switch networks
sui client switch --env testnet
sui client switch --env devnet
sui client switch --env mainnet
```

#### Backup and Recovery

```bash
# Backup your wallet
cp -r ~/.sui/sui_config ~/.sui/sui_config.backup

# Export important IDs to file
cat > sui_certificate_config.txt << EOF
Package ID: $PACKAGE_ID
IssuerCap ID: $ISSUER_CAP
Registry ID: $REGISTRY
School Address: $(sui client active-address)
EOF

# Keep this file safe!
```

## Common Workflows

### Workflow 1: First-Time Setup

```bash
# 1. Install Sui CLI
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui

# 2. Initialize client
sui client

# 3. Get testnet tokens
sui client faucet

# 4. Clone and build
git clone https://github.com/younglafire/sui-digital-cerf.git
cd sui-digital-cerf/student_cerf
sui move build

# 5. Deploy
sui client publish --gas-budget 100000000

# 6. Save IDs (copy from deployment output)
export PACKAGE_ID=0x...
export ISSUER_CAP=0x...
export REGISTRY=0x...
```

### Workflow 2: Mint Certificate for Student

```bash
# 1. Get student address
export STUDENT=0x<STUDENT_ADDRESS>

# 2. Prepare details
STUDENT_NAME="Alice Smith"
COURSE="Computer Science"
DATE=$(date +%s)

# 3. Mint
sui client call \
  --package $PACKAGE_ID \
  --module student_cerf \
  --function mint_certificate \
  --args $ISSUER_CAP $REGISTRY $STUDENT "\"$STUDENT_NAME\"" "\"$COURSE\"" $DATE \
  --gas-budget 10000000

# 4. Verify
sui client object $REGISTRY --json | jq '.content.fields'
```

### Workflow 3: Student Views Certificate

```bash
# 1. Switch to student wallet
sui client switch --address <STUDENT_ADDRESS>

# 2. Find certificate
sui client objects | grep Certificate

# 3. View details
sui client object <CERTIFICATE_ID> --json | jq '.content.fields'
```

## Summary

This guide covers all essential terminal operations for the Sui Digital Certificate System:

✅ **Installation**: Install Sui CLI and setup wallet  
✅ **Building**: Build and test the Move contract  
✅ **Deployment**: Deploy to Sui testnet  
✅ **Minting**: Issue certificates to students  
✅ **Viewing**: Students view their certificates  
✅ **Verification**: Verify certificate authenticity  
✅ **Troubleshooting**: Common issues and solutions

For more information, see the main [README.md](README.md) file.

---

**Need Help?**
- Sui Documentation: https://docs.sui.io/
- Move Language: https://move-language.github.io/move/
- Sui Discord: https://discord.gg/sui
