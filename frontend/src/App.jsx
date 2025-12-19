import { useState } from 'react'
import './App.css'
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { CONTRACT_CONFIG, SETUP_INSTRUCTIONS } from './config'

function App() {
  const account = useCurrentAccount()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()
  
  const [formData, setFormData] = useState({
    studentAddress: '',
    studentName: '',
    course: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [txResult, setTxResult] = useState(null)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!account) {
      setError('Please connect your wallet first')
      return
    }

    // Validate contract configuration
    if (CONTRACT_CONFIG.PACKAGE_ID === '0x0' || 
        CONTRACT_CONFIG.ISSUER_CAP === '0x0' || 
        CONTRACT_CONFIG.REGISTRY === '0x0') {
      setError('Contract not configured. Please update config.js with deployed contract IDs.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setTxResult(null)

    try {
      const tx = new Transaction()
      
      // Get current timestamp in seconds
      const issueDate = Math.floor(Date.now() / 1000)

      // Call the mint_certificate function
      tx.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::${CONTRACT_CONFIG.MINT_FUNCTION}`,
        arguments: [
          tx.object(CONTRACT_CONFIG.ISSUER_CAP),
          tx.object(CONTRACT_CONFIG.REGISTRY),
          tx.pure.address(formData.studentAddress),
          tx.pure.string(formData.studentName),
          tx.pure.string(formData.course),
          tx.pure.u64(issueDate),
        ],
      })

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: async (result) => {
            console.log('Transaction successful:', result)
            setTxResult({
              digest: result.digest,
              success: true,
              message: 'Certificate minted successfully!'
            })
            // Reset form
            setFormData({
              studentAddress: '',
              studentName: '',
              course: '',
            })
            setIsSubmitting(false)
          },
          onError: (err) => {
            console.error('Transaction failed:', err)
            setError(err.message || 'Failed to mint certificate')
            setIsSubmitting(false)
          }
        }
      )
    } catch (err) {
      console.error('Error preparing transaction:', err)
      setError(err.message || 'Failed to prepare transaction')
      setIsSubmitting(false)
    }
  }

  const isConfigured = CONTRACT_CONFIG.PACKAGE_ID !== '0x0'

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎓 Sui Digital Certificate System</h1>
        <p className="subtitle">Mint certificates for students on the Sui blockchain</p>
        <div className="wallet-section">
          <ConnectButton />
        </div>
      </header>

      <main className="app-main">
        {!isConfigured && (
          <div className="warning-banner">
            <h3>⚠️ Contract Not Configured</h3>
            <pre className="setup-instructions">{SETUP_INSTRUCTIONS}</pre>
          </div>
        )}

        {account && isConfigured && (
          <div className="mint-container">
            <h2>Mint Certificate</h2>
            <p className="connected-wallet">
              Connected: <code>{account.address.slice(0, 10)}...{account.address.slice(-8)}</code>
            </p>
            
            <form onSubmit={handleSubmit} className="mint-form">
              <div className="form-group">
                <label htmlFor="studentAddress">Student Wallet Address *</label>
                <input
                  type="text"
                  id="studentAddress"
                  name="studentAddress"
                  value={formData.studentAddress}
                  onChange={handleInputChange}
                  placeholder="0x..."
                  required
                  disabled={isSubmitting}
                />
                <small>The Sui wallet address of the student receiving the certificate</small>
              </div>

              <div className="form-group">
                <label htmlFor="studentName">Student Name *</label>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="course">Course/Program *</label>
                <input
                  type="text"
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  placeholder="Computer Science"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Minting...' : 'Mint Certificate'}
              </button>
            </form>

            {error && (
              <div className="alert alert-error">
                <strong>Error:</strong> {error}
              </div>
            )}

            {txResult && (
              <div className="alert alert-success">
                <strong>✓ {txResult.message}</strong>
                <p>
                  Transaction Digest: <code>{txResult.digest}</code>
                </p>
                <a 
                  href={`https://suiscan.xyz/testnet/tx/${txResult.digest}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-tx-link"
                >
                  View on Explorer →
                </a>
              </div>
            )}
          </div>
        )}

        {!account && isConfigured && (
          <div className="connect-prompt">
            <p>👆 Please connect your wallet to mint certificates</p>
          </div>
        )}

        <div className="info-section">
          <h3>ℹ️ About</h3>
          <p>
            This interface allows schools to mint digital certificates on the Sui blockchain.
            Only the wallet holding the IssuerCap can mint certificates.
          </p>
          <ul>
            <li>Each student can receive exactly one certificate</li>
            <li>Certificates are immutable and verifiable on-chain</li>
            <li>Certificate ownership is transferred directly to the student</li>
          </ul>
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with ❤️ using Sui Move | Hackathon Project</p>
      </footer>
    </div>
  )
}

export default App
