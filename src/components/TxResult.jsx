export default function TxResult({ result }) {
  if (!result) return null;

  const { status, hash, message } = result;
  const explorerUrl = hash
    ? `https://stellar.expert/explorer/testnet/tx/${hash}`
    : null;

  return (
    <div className={`card tx-result ${status === "success" ? "tx-success" : "tx-error"}`}>
      <p className="tx-status">
        {status === "success" ? "✅ Transaction Successful" : "❌ Transaction Failed"}
      </p>
      {message && <p className="tx-message">{message}</p>}
      {hash && (
        <p className="tx-hash">
          Hash: <code>{hash}</code>
        </p>
      )}
      {explorerUrl && (
        <a className="btn btn-link" href={explorerUrl} target="_blank" rel="noreferrer">
          Lihat di Stellar Expert →
        </a>
      )}
    </div>
  );
}
