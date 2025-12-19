import { WalletConnection } from './components/WalletConnection'
import { CertificateMintForm } from './components/CertificateMintForm'
import './App.css'

function App() {
  return (
    <div className="app">
      <WalletConnection />
      <main className="main-content">
        <CertificateMintForm />
      </main>
      <footer className="footer">
        <p>Built with ❤️ on Sui Blockchain</p>
      </footer>
    </div>
  )
}

export default App
