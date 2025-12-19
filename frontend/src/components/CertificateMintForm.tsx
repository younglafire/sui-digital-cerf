import { useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'

interface MintResponse {
  success: boolean
  message: string
  transactionDigest?: string
  certificateId?: string
}

export function CertificateMintForm() {
  const currentAccount = useCurrentAccount()
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

    setIsLoading(true)
    setStatusMessage({ type: '', text: '' })

    try {
      // Generate current timestamp
      const issueDate = Math.floor(Date.now() / 1000)

      // Prepare payload for backend
      const payload = {
        studentAddress: currentAccount.address,
        studentName: studentName.trim(),
        course: COURSE_NAME,
        school: SCHOOL_NAME,
        issueDate: issueDate,
      }

      // Get backend API URL from environment
      const backendUrl = import.meta.env.VITE_BACKEND_API_URL
      if (!backendUrl) {
        throw new Error('Backend API URL is not configured. Please set VITE_BACKEND_API_URL in your .env file.')
      }
      
      // Call backend API to mint certificate
      const response = await fetch(`${backendUrl}/mint-certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data: MintResponse = await response.json()

      if (response.ok && data.success) {
        setStatusMessage({ 
          type: 'success', 
          text: `Certificate minted successfully! ${data.transactionDigest ? `Transaction: ${data.transactionDigest.slice(0, 10)}...` : ''}` 
        })
        setStudentName('') // Clear form on success
      } else {
        setStatusMessage({ 
          type: 'error', 
          text: data.message || 'Failed to mint certificate' 
        })
      }
    } catch (error) {
      console.error('Error minting certificate:', error)
      setStatusMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.' 
      })
    } finally {
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
