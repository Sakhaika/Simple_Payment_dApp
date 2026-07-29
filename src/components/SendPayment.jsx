import { useState } from "react";

export default function SendPayment({ onSend, isSending, disabled }) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSend({ destination: destination.trim(), amount: amount.trim(), memo: memo.trim() });
  }

  return (
    <form className="card send-card" onSubmit={handleSubmit}>
      <h3>Kirim XLM</h3>

      <label className="field">
        <span>Destination Address</span>
        <input
          type="text"
          placeholder="G..."
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          disabled={disabled}
          required
        />
      </label>

      <label className="field">
        <span>Amount (XLM)</span>
        <input
          type="number"
          step="0.0000001"
          min="0.0000001"
          placeholder="10"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={disabled}
          required
        />
      </label>

      <label className="field">
        <span>Memo (opsional)</span>
        <input
          type="text"
          placeholder="Pembayaran testnet"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          disabled={disabled}
          maxLength={28}
        />
      </label>

      <button className="btn btn-primary" type="submit" disabled={disabled || isSending}>
        {isSending ? "Mengirim..." : "Send Transaction"}
      </button>
    </form>
  );
}
