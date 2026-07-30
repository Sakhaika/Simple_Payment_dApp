import { useCallback, useState } from "react";
import {
  isConnected as freighterIsConnected,
  requestAccess,
  getAddress,
  signTransaction,
  getNetwork,
} from "@stellar/freighter-api";

import {
  fetchXlmBalance,
  fundWithFriendbot,
  buildPaymentXDR,
  submitSignedXDR,
  isValidPublicKey,
  NETWORK_PASSPHRASE,
} from "./lib/stellar";

import WalletConnect from "./components/WalletConnect";
import BalanceDisplay from "./components/BalanceDisplay";
import SendPayment from "./components/SendPayment";
import TxResult from "./components/TxResult";
import "./App.css";

export default function App() {
  const [publicKey, setPublicKey] = useState(null);
  const [networkLabel, setNetworkLabel] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const [balance, setBalance] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [notFunded, setNotFunded] = useState(false);
  const [isFunding, setIsFunding] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const [txResult, setTxResult] = useState(null);
  const [globalError, setGlobalError] = useState("");

  const refreshBalance = useCallback(async (pk) => {
    if (!pk) return;
    setIsLoadingBalance(true);
    setGlobalError("");
    try {
      const bal = await fetchXlmBalance(pk);
      if (bal === null) {
        setNotFunded(true);
        setBalance(null);
      } else {
        setNotFunded(false);
        setBalance(bal);
      }
    } catch (err) {
      setGlobalError(`Gagal mengambil balance: ${err.message}`);
    } finally {
      setIsLoadingBalance(false);
    }
  }, []);

  async function handleConnect() {
    setIsConnecting(true);
    setGlobalError("");
    try {
      const connected = await freighterIsConnected();
      if (connected?.error) {
        throw new Error(
          "Freighter tidak terdeteksi. Install extension-nya dulu.",
        );
      }

      // Minta akses (munculkan popup approve di Freighter)
      const access = await requestAccess();
      if (access?.error)
        throw new Error(access.error.message || "Akses ditolak.");

      const addr = access.address || (await getAddress()).address;
      setPublicKey(addr);

      const net = await getNetwork();
      setNetworkLabel(net?.network || "");

      if (
        net?.networkPassphrase &&
        net.networkPassphrase !== NETWORK_PASSPHRASE
      ) {
        setGlobalError(
          "⚠️ Wallet kamu tidak di-set ke Testnet. Buka Freighter → Settings → ganti network ke Testnet.",
        );
      }

      await refreshBalance(addr);
    } catch (err) {
      setGlobalError(err.message || "Gagal connect wallet.");
    } finally {
      setIsConnecting(false);
    }
  }

  function handleDisconnect() {
    setPublicKey(null);
    setBalance(null);
    setNotFunded(false);
    setTxResult(null);
    setNetworkLabel("");
    setGlobalError("");
  }

  async function handleFund() {
    if (!publicKey) return;
    setIsFunding(true);
    setGlobalError("");
    try {
      await fundWithFriendbot(publicKey);
      await refreshBalance(publicKey);
    } catch (err) {
      setGlobalError(`Gagal fund akun: ${err.message}`);
    } finally {
      setIsFunding(false);
    }
  }

  async function handleSend({ destination, amount, memo }) {
    setTxResult(null);
    setGlobalError("");

    if (!isValidPublicKey(destination)) {
      setTxResult({
        status: "error",
        message: "Destination address tidak valid.",
      });
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setTxResult({
        status: "error",
        message: "Amount harus lebih besar dari 0.",
      });
      return;
    }

    setIsSending(true);
    try {
      const xdr = await buildPaymentXDR({
        sourcePublicKey: publicKey,
        destination,
        amount,
        memo,
      });

      const signed = await signTransaction(xdr, {
        networkPassphrase: NETWORK_PASSPHRASE,
        address: publicKey,
      });
      if (signed?.error)
        throw new Error(signed.error.message || "Signing dibatalkan.");

      const result = await submitSignedXDR(signed.signedTxXdr);

      setTxResult({
        status: "success",
        hash: result.hash,
        message: `Berhasil mengirim ${amount} XLM.`,
      });

      await refreshBalance(publicKey);
    } catch (err) {
      const msg =
        err?.response?.data?.extras?.result_codes?.operations?.join(", ") ||
        err?.message ||
        "Transaksi gagal.";
      setTxResult({ status: "error", message: msg });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>⭐ Stellar Payment dApp Sakha</h1>
        <p className="muted">Testnet payment dApp White Belt submission</p>
      </header>

      {globalError && <div className="alert">{globalError}</div>}

      <WalletConnect
        publicKey={publicKey}
        isConnecting={isConnecting}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        networkLabel={networkLabel}
      />

      {publicKey && (
        <>
          <BalanceDisplay
            balance={balance}
            isLoading={isLoadingBalance}
            onRefresh={() => refreshBalance(publicKey)}
            onFund={handleFund}
            isFunding={isFunding}
            notFunded={notFunded}
          />

          <SendPayment
            onSend={handleSend}
            isSending={isSending}
            disabled={notFunded}
          />

          <TxResult result={txResult} />
        </>
      )}

      <footer className="app-footer">
        <span className="muted">
          Network: Stellar Testnet · Powered by Freighter · By Sakha Ibadil
          Kirom
        </span>
      </footer>
    </div>
  );
}
