import { useState } from 'react'
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { CONTRACT_CONFIG, validateConfig } from '../config'

export function CertificateMintForm() {
  const currentAccount = useCurrentAccount()
  const suiClient = useSuiClient()
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
  const [studentName, setStudentName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' })

  // Fixed values as per requirements
  const COURSE_NAME = 'Move on Sui'
  const SCHOOL_NAME = 'Sui School'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentAccount) {
      setStatusMessage({ type: 'error', text: 'Please connect your Sui wallet first' })
      return
    }

    if (!studentName.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your full name' })
      return
    }

    // Validate contract configuration
    try {
      validateConfig()
    } catch (error) {
      setStatusMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Contract configuration error' 
      })
      return
    }

    setIsLoading(true)
    setStatusMessage({ type: '', text: '' })

    try {
      // Generate current timestamp
      const issueDate = Math.floor(Date.now() / 1000)

      // Create transaction block
      const tx = new Transaction()
      
      // Call the mint_certificate function
      tx.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::student_cerf::mint_certificate`,
        arguments: [
          tx.object(CONTRACT_CONFIG.ISSUER_CAP_ID),    // IssuerCap
          tx.object(CONTRACT_CONFIG.REGISTRY_ID),      // Registry (shared object)
          tx.pure.address(currentAccount.address),      // student address
          tx.pure.string(studentName.trim()),          // student_name
          tx.pure.string(COURSE_NAME),                 // course
          tx.pure.u64(issueDate),                      // issue_date
        ],
      })

      // Sign and execute the transaction
      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: async (result) => {
            console.log('Transaction successful:', result)
            
            // Wait for transaction to be confirmed
            try {
              await suiClient.waitForTransaction({
                digest: result.digest,
              })
              
              setStatusMessage({ 
                type: 'success', 
                text: `Certificate minted successfully! Transaction: ${result.digest.slice(0, 10)}...` 
              })
              setStudentName('') // Clear form on success
            } catch (waitError) {
              console.error('Error waiting for transaction:', waitError)
              setStatusMessage({ 
                type: 'success', 
                text: `Transaction submitted! Digest: ${result.digest.slice(0, 10)}...` 
              })
              setStudentName('') // Clear form anyway
            }
            setIsLoading(false)
          },
          onError: (error) => {
            console.error('Transaction error:', error)
            setStatusMessage({ 
              type: 'error', 
              text: error.message || 'Failed to mint certificate. Please try again.' 
            })
            setIsLoading(false)
          },
        }
      )
    } catch (error) {
      console.error('Error preparing transaction:', error)
      setStatusMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.' 
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="certificate-form-container">
      <div className="certificate-form-card">
        <h2>Request Digital Certificate</h2>
        
        <div className="form-info">
          <div className="info-row">
            <span className="info-label">Course:</span>
            <span className="info-value">{COURSE_NAME}</span>
          </div>
          <div className="info-row">
            <span className="info-label">School:</span>
            <span className="info-value">{SCHOOL_NAME}</span>
          </div>
          {currentAccount && (
            <div className="info-row">
              <span className="info-label">Your Address:</span>
              <span className="info-value address">{currentAccount.address.slice(0, 8)}...{currentAccount.address.slice(-6)}</span>
            </div>
          )}
        </div>

        {!currentAccount ? (
          <div className="wallet-warning">
            <p>⚠️ Please connect your Sui wallet to request a certificate</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="studentName">Your Full Name</label>
              <input
                id="studentName"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your full name"
                disabled={isLoading}
                required
              />
            </div>

            <button type="submit" disabled={isLoading || !currentAccount}>
              {isLoading ? 'Processing...' : 'Request Certificate'}
            </button>
          </form>
        )}

        {statusMessage.text && (
          <div className={`status-message ${statusMessage.type}`}>
            {statusMessage.text}
          </div>
        )}
      </div>
    </div>
  )
}
