function shorten(address) {
  if (!address) return "";
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export default function WalletConnect({
  publicKey,
  isConnecting,
  onConnect,
  onDisconnect,
  networkLabel,
}) {
  return (
    <div className="card wallet-card">
      {!publicKey ? (
        <>
          <p className="muted">Belum ada wallet terhubung.</p>
          <button className="btn btn-primary" onClick={onConnect} disabled={isConnecting}>
            {isConnecting ? "Menghubungkan..." : "Connect Freighter Wallet"}
          </button>
        </>
      ) : (
        <div className="wallet-connected">
          <div>
            <span className="badge badge-success">● Connected</span>
            {networkLabel && <span className="badge badge-network">{networkLabel}</span>}
          </div>
          <p className="pubkey" title={publicKey}>
            {shorten(publicKey)}
          </p>
          <button className="btn btn-secondary" onClick={onDisconnect}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
