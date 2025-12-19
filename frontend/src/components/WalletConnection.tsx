import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'

export function WalletConnection() {
  const currentAccount = useCurrentAccount()

  return (
    <div className="wallet-connection">
      <div className="wallet-header">
        <h1>Sui Digital Certificate System</h1>
        <p className="subtitle">Blockchain-verified credentials on Sui</p>
      </div>
      
      <div className="wallet-button-container">
        <ConnectButton />
        
        {currentAccount && (
          <div className="wallet-info">
            <span className="status-indicator">🟢</span>
            <span>Connected</span>
          </div>
        )}
      </div>
    </div>
  )
}
