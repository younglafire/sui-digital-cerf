import { useState } from 'react'
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import './App.css'
import { PACKAGE_ID, MODULE_NAME, ISSUER_CAP_ID, SCHOOL_NAME, DEFAULT_DEGREE_PROGRAM } from './config'

function App() {
  const [studentName, setStudentName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [certificateCount, setCertificateCount] = useState(0)
  
  const currentAccount = useCurrentAccount()
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction()

  // Generate auto-incrementing ID (like SQL primary key)
  const generateCertificateId = () => {
    const newCount = certificateCount + 1
    setCertificateCount(newCount)
    return `CERT-${SCHOOL_NAME.toUpperCase().replace(/\s+/g, '-')}-${String(newCount).padStart(6, '0')}`
  }

  // Generate student ID
  const generateStudentId = () => {
    const timestamp = Date.now()
    return `STU-${String(timestamp).slice(-8)}`
  }

  const handleIssueCertificate = async (e) => {
    e.preventDefault()
    
    if (!studentName.trim()) {
      setMessage('Please enter your name')
      return
    }

    // Allow certificate issuance without wallet for now
    // In a real scenario, you'd need wallet connection for blockchain interaction
    if (!currentAccount) {
      // For demo purposes, show success message even without wallet
      const certId = generateCertificateId()
      const stuId = generateStudentId()
      setMessage(`🎓 Success! Certificate issued!\n\nStudent: ${studentName}\nStudent ID: ${stuId}\nCertificate ID: ${certId}\nSchool: ${SCHOOL_NAME}\n\n(Note: Connect wallet to save on blockchain)`)
      setStudentName('')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const tx = new Transaction()
      const certId = generateCertificateId()
      const stuId = generateStudentId()
      const currentDate = Math.floor(Date.now() / 1000) // Unix timestamp

      // Convert strings to byte arrays for Move contract
      const studentNameBytes = Array.from(new TextEncoder().encode(studentName))
      const studentIdBytes = Array.from(new TextEncoder().encode(stuId))
      const degreeProgramBytes = Array.from(new TextEncoder().encode(DEFAULT_DEGREE_PROGRAM))
      const certificateIdBytes = Array.from(new TextEncoder().encode(certId))

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::issue_certificate`,
        arguments: [
          tx.object(ISSUER_CAP_ID),
          tx.pure.address(currentAccount.address),
          tx.pure(studentNameBytes),
          tx.pure(studentIdBytes),
          tx.pure(degreeProgramBytes),
          tx.pure.u64(currentDate),
          tx.pure(certificateIdBytes),
        ],
      })

      const result = await signAndExecuteTransaction({
        transaction: tx,
      })

      setMessage(`🎓 Certificate issued successfully!\n\nStudent: ${studentName}\nStudent ID: ${stuId}\nCertificate ID: ${certId}\nSchool: ${SCHOOL_NAME}\n\nTransaction: ${result.digest}`)
      setStudentName('')
    } catch (error) {
      console.error('Error issuing certificate:', error)
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎓 {SCHOOL_NAME}</h1>
        <h2>Digital Certification Portal</h2>
        <div className="wallet-section">
          <ConnectButton />
        </div>
      </header>

      <main className="main-content">
        <div className="certificate-form-container">
          <h3>Receive Your Digital Certificate</h3>
          <p className="instruction">
            Enter your name below to receive your digital certificate from {SCHOOL_NAME}.
            {!currentAccount && ' (You can receive a certificate preview without connecting your wallet)'}
          </p>

          <form onSubmit={handleIssueCertificate} className="certificate-form">
            <div className="form-group">
              <label htmlFor="studentName">Your Full Name:</label>
              <input
                type="text"
                id="studentName"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your full name"
                className="input-field"
                disabled={isLoading}
              />
            </div>

            <div className="info-section">
              <p><strong>School:</strong> {SCHOOL_NAME}</p>
              <p><strong>Program:</strong> {DEFAULT_DEGREE_PROGRAM}</p>
              <p><strong>Certificate ID:</strong> Auto-generated</p>
              <p><strong>Student ID:</strong> Auto-generated</p>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : '🎓 Receive Certificate'}
            </button>
          </form>

          {message && (
            <div className={`message ${message.includes('Error') || message.includes('❌') ? 'error' : 'success'}`}>
              <pre>{message}</pre>
            </div>
          )}
        </div>

        <div className="info-panel">
          <h3>ℹ️ About Digital Certificates</h3>
          <ul>
            <li>🔒 Secure blockchain-based certificates</li>
            <li>🎯 Each certificate has a unique ID</li>
            <li>✅ Verifiable and tamper-proof</li>
            <li>🌐 Accessible from anywhere</li>
            <li>💎 Stored as NFTs on the Sui blockchain</li>
          </ul>

          <div className="stats">
            <h4>Certificates Issued (This Session)</h4>
            <p className="stat-number">{certificateCount}</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Powered by Sui Blockchain | {SCHOOL_NAME} Digital Certification System</p>
      </footer>
    </div>
  )
}

export default App
