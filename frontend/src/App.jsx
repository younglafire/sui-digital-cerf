import { useState } from 'react'
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import './App.css'
import { PACKAGE_ID, MODULE_NAME, SCHOOL_NAME } from './config'

function App() {
  const [studentName, setStudentName] = useState('')
  const [course, setCourse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [certificateCount, setCertificateCount] = useState(0)
  
  const currentAccount = useCurrentAccount()
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction()

  const handleIssueCertificate = async (e) => {
    e.preventDefault()
    
    if (!studentName.trim()) {
      setMessage('Please enter your name')
      return
    }

    if (!course.trim()) {
      setMessage('Please enter a course name')
      return
    }

    // Require wallet connection for blockchain interaction
    if (!currentAccount) {
      setMessage('⚠️ Please connect your wallet to issue a certificate on the blockchain')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const tx = new Transaction()

      // Convert strings to byte arrays for Move contract
      const studentNameBytes = Array.from(new TextEncoder().encode(studentName))
      const courseBytes = Array.from(new TextEncoder().encode(course))

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::issue_certificate`,
        arguments: [
          tx.pure(studentNameBytes),
          tx.pure(courseBytes),
        ],
      })

      const result = await signAndExecuteTransaction({
        transaction: tx,
      })

      setCertificateCount(certificateCount + 1)
      setMessage(`🎓 Certificate issued successfully!\n\nStudent: ${studentName}\nCourse: ${course}\nSchool: ${SCHOOL_NAME}\n\nTransaction: ${result.digest}`)
      setStudentName('')
      setCourse('')
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
            Connect your wallet and enter your details to receive your digital certificate from {SCHOOL_NAME} on the blockchain.
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

            <div className="form-group">
              <label htmlFor="course">Course Name:</label>
              <input
                type="text"
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g., Blockchain Development"
                className="input-field"
                disabled={isLoading}
              />
            </div>

            <div className="info-section">
              <p><strong>School:</strong> {SCHOOL_NAME}</p>
              <p><strong>Note:</strong> Certificate will be issued to your connected wallet address</p>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading || !currentAccount}
            >
              {isLoading ? 'Processing...' : '🎓 Issue Certificate'}
            </button>
          </form>

          {message && (
            <div className={`message ${message.includes('Error') || message.includes('❌') || message.includes('⚠️') ? 'error' : 'success'}`}>
              <pre>{message}</pre>
            </div>
          )}
        </div>

        <div className="info-panel">
          <h3>ℹ️ About Digital Certificates</h3>
          <ul>
            <li>🔒 Secure blockchain-based certificates</li>
            <li>🎓 Store your name and course on-chain</li>
            <li>✅ Verifiable and tamper-proof</li>
            <li>🌐 Accessible from anywhere</li>
            <li>💎 Stored as NFTs on the Sui blockchain</li>
            <li>🔑 Only you can issue your own certificate</li>
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
