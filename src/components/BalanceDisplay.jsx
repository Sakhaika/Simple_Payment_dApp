export default function BalanceDisplay({
  balance,
  isLoading,
  onRefresh,
  onFund,
  isFunding,
  notFunded,
}) {
  return (
    <div className="card balance-card">
      <div className="balance-header">
        <span className="label">XLM Balance (Testnet)</span>
        <button className="btn btn-link" onClick={onRefresh} disabled={isLoading}>
          {isLoading ? "..." : "⟳ Refresh"}
        </button>
      </div>

      {notFunded ? (
        <>
          <p className="balance-value muted">Akun belum ter-fund</p>
          <button className="btn btn-primary" onClick={onFund} disabled={isFunding}>
            {isFunding ? "Requesting..." : "Fund via Friendbot"}
          </button>
        </>
      ) : (
        <p className="balance-value">
          {isLoading ? "Loading..." : balance !== null ? `${balance} XLM` : "-"}
        </p>
      )}
    </div>
  );
}
