# Sui Digital Certificate System

A blockchain-based digital certificate system built on Sui for schools to issue verifiable certificates to students. This smart contract ensures that only authorized issuers (schools) can mint certificates, and each student can receive exactly one certificate, preventing duplicates permanently.

## 🎯 Features

- **Secure Issuance**: Only the school (holding `IssuerCap`) can mint certificates
- **Duplicate Prevention**: Each student can receive exactly one certificate
- **On-chain Verification**: All certificates are verifiable on the Sui blockchain
- **Permanent Records**: Certificates are stored as immutable objects
- **Registry Tracking**: Centralized registry tracks all issued certificates

## 🏗️ Architecture

### Core Components

1. **Certificate** - Object representing a digital certificate
   - Student address
   - School name
   - Student name
   - Course information
   - Issue date
   - Unique certificate ID

2. **IssuerCap** - Capability object for certificate issuance
   - Owned exclusively by the school
   - Required to mint certificates
   - Cannot be duplicated

3. **Registry** - Shared object tracking all certificates
   - Prevents duplicate certificates
   - Tracks certificate IDs
   - Provides query functions

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Install Sui CLI

```bash
# Option 1: Using Cargo (Rust's package manager)
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui

# Option 2: Using Homebrew (macOS)
brew install sui

# Option 3: Download pre-built binaries
# Visit: https://github.com/MystenLabs/sui/releases
```

Verify installation:
```bash
sui --version
```

### Setup Sui Client

```bash
# Initialize Sui client configuration
sui client

# This will create a configuration at ~/.sui/sui_config/client.yaml
# You'll be prompted to choose a network (select testnet for development)
```

### Get Testnet SUI Tokens

```bash
# Request testnet tokens from the faucet
sui client faucet

# Check your balance
sui client gas
```

## 🚀 Getting Started

### 1. Clone and Navigate

```bash
cd student_cerf
```

### 2. Build the Contract

```bash
# Build the Move package
sui move build

# This will compile your contract and show any errors
```

Expected output:
```
UPDATING GIT DEPENDENCY https://github.com/MystenLabs/sui.git
INCLUDING DEPENDENCY Sui
BUILDING student_cerf
```

### 3. Run Tests

```bash
# Run all tests
sui move test

# Run with verbose output
sui move test --verbose

# Run specific test
sui move test test_mint_certificate_success
```

Expected output:
```
BUILDING student_cerf
Running Move unit tests
[ PASS    ] student_cerf::student_cerf_tests::test_certificate_id_increment
[ PASS    ] student_cerf::student_cerf_tests::test_duplicate_certificate_fails
[ PASS    ] student_cerf::student_cerf_tests::test_has_certificate
[ PASS    ] student_cerf::student_cerf_tests::test_mint_certificate_success
[ PASS    ] student_cerf::student_cerf_tests::test_mint_multiple_certificates
Test result: OK. Total tests: 5; passed: 5; failed: 0
```

### 4. Deploy to Testnet

```bash
# Deploy the contract to Sui testnet
sui client publish --gas-budget 100000000

# Save the output! You'll need:
# - Package ID
# - IssuerCap Object ID
# - Registry Object ID
```

Example output:
```
Transaction Digest: <TX_DIGEST>
...
Published Objects:
  - PackageID: 0x<PACKAGE_ID>
  - Version: 1
  
Created Objects:
  - ObjectID: 0x<ISSUER_CAP_ID>
    Type: <PACKAGE_ID>::student_cerf::IssuerCap
    Owner: Address(0x<YOUR_ADDRESS>)
    
  - ObjectID: 0x<REGISTRY_ID>
    Type: <PACKAGE_ID>::student_cerf::Registry
    Owner: Shared
```

## 💼 Usage Guide

### As a School (Certificate Issuer)

#### Mint a Certificate

```bash
# Set environment variables (replace with your actual IDs)
export PACKAGE_ID=0x<YOUR_PACKAGE_ID>
export ISSUER_CAP=0x<YOUR_ISSUER_CAP_ID>
export REGISTRY=0x<YOUR_REGISTRY_ID>
export STUDENT_ADDRESS=0x<STUDENT_ADDRESS>

# Mint a certificate for a student
sui client call \
  --package $PACKAGE_ID \
  --module student_cerf \
  --function mint_certificate \
  --args $ISSUER_CAP $REGISTRY $STUDENT_ADDRESS '"Alice Smith"' '"Computer Science"' 1734573600 \
  --gas-budget 10000000
```

**Parameters explained:**
- `$ISSUER_CAP` - Your IssuerCap object ID (proves you're the school)
- `$REGISTRY` - The shared Registry object ID
- `$STUDENT_ADDRESS` - The student's Sui address
- `"Alice Smith"` - Student name
- `"Computer Science"` - Course/program name
- `1734573600` - Issue date (Unix timestamp)

#### Check if Student Has Certificate

```bash
# View the Registry object to check all issued certificates
sui client object $REGISTRY --json
```

### As a Student (Certificate Recipient)

#### View Your Certificate

```bash
# List all objects you own
sui client objects

# View specific certificate details
sui client object <CERTIFICATE_OBJECT_ID> --json
```

#### Display Certificate Information

```bash
# Get certificate as JSON
sui client object <CERTIFICATE_OBJECT_ID> --json | jq .

# Extract specific fields
sui client object <CERTIFICATE_OBJECT_ID> --json | jq '.content.fields'
```

Example output:
```json
{
  "student": "0x<STUDENT_ADDRESS>",
  "school_name": "Digital Certification School",
  "student_name": "Alice Smith",
  "course": "Computer Science",
  "issue_date": "1734573600",
  "certificate_id": "1"
}
```

## 🔍 Query Functions

### Check Total Certificates Issued

Since query functions are read-only, you need to view the Registry object:

```bash
# View registry
sui client object $REGISTRY --json | jq '.content.fields'
```

### Verify Certificate Authenticity

```bash
# Get certificate object and verify it exists on-chain
sui client object <CERTIFICATE_OBJECT_ID>

# Verify the owner matches the student address
sui client object <CERTIFICATE_OBJECT_ID> --json | jq '.owner'
```

## 🔐 Security Features

### 1. Capability-Based Access Control
- Only the holder of `IssuerCap` can mint certificates
- `IssuerCap` is transferred to the deployer (school) on initialization
- Students cannot mint certificates for themselves

### 2. Duplicate Prevention
- Registry tracks all issued certificates by student address
- `mint_certificate` checks if student already has a certificate
- Transaction aborts with `EAlreadyHasCertificate` error if duplicate detected

### 3. Immutable Certificates
- Once issued, certificate data cannot be modified
- Certificate ownership can be transferred but content is permanent
- On-chain verification ensures authenticity

## 🛠️ Development Workflow

### Local Development

```bash
# 1. Make changes to the Move code
vim sources/student_cerf.move

# 2. Build to check for errors
sui move build

# 3. Run tests
sui move test

# 4. If tests pass, publish to testnet
sui client publish --gas-budget 100000000
```

### Testing Changes

```bash
# Run all tests with gas profiling
sui move test --gas-report

# Run with coverage
sui move test --coverage

# View coverage report
sui move coverage source
```

### Common Issues and Solutions

#### Issue: "Package dependency does not specify a published address"
```bash
# Solution: Ensure Move.toml has correct Sui dependency
# The dependency should point to testnet framework
```

#### Issue: "Insufficient gas"
```bash
# Solution: Request more testnet tokens
sui client faucet

# Or increase gas budget
--gas-budget 100000000
```

#### Issue: "Object not found"
```bash
# Solution: Verify object IDs are correct
sui client objects  # List your objects
sui client active-address  # Check your address
```

## 📚 Advanced Usage

### Backend Integration

For automated certificate issuance, you can integrate with a backend service:

```typescript
// Example using Sui TypeScript SDK
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';

const client = new SuiClient({ url: getFullnodeUrl('testnet') });
const keypair = Ed25519Keypair.deriveKeypair(process.env.MNEMONIC);

async function mintCertificate(
  packageId: string,
  issuerCapId: string,
  registryId: string,
  studentAddress: string,
  studentName: string,
  course: string,
  issueDate: number
) {
  const tx = new TransactionBlock();
  
  tx.moveCall({
    target: `${packageId}::student_cerf::mint_certificate`,
    arguments: [
      tx.object(issuerCapId),
      tx.object(registryId),
      tx.pure(studentAddress),
      tx.pure(studentName),
      tx.pure(course),
      tx.pure(issueDate),
    ],
  });

  const result = await client.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    signer: keypair,
  });
  
  return result;
}
```

### Event Monitoring

Monitor certificate issuance events:

```bash
# Subscribe to events from your package
sui client events --package $PACKAGE_ID
```

## 📖 Move Language Resources

- [Sui Move Documentation](https://docs.sui.io/concepts/sui-move-concepts)
- [Move Book](https://move-language.github.io/move/)
- [Sui Examples](https://github.com/MystenLabs/sui/tree/main/examples)
- [Sui Move by Example](https://examples.sui.io/)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is for educational and demonstration purposes.

## 🎓 Hackathon Project

This is a hackathon project demonstrating blockchain-based credential verification using Sui Move.

---

**Built with ❤️ using Sui Move**
