import {
  Horizon,
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
  BASE_FEE,
  Memo,
} from "@stellar/stellar-sdk";

// ---- Config ----
export const HORIZON_URL = "https://horizon-testnet.stellar.org";
export const NETWORK_PASSPHRASE = Networks.TESTNET;
export const FRIENDBOT_URL = "https://friendbot.stellar.org";

export const server = new Horizon.Server(HORIZON_URL);

/**
 * Ambil saldo XLM (native) dari sebuah public key di testnet.
 * Jika akun belum ter-fund (belum exist di ledger), return null.
 */
export async function fetchXlmBalance(publicKey) {
  try {
    const account = await server.loadAccount(publicKey);
    const native = account.balances.find((b) => b.asset_type === "native");
    return native ? native.balance : "0";
  } catch (err) {
    if (err?.response?.status === 404) {
      // Akun belum ada di ledger (belum pernah di-fund)
      return null;
    }
    throw err;
  }
}

/**
 * Minta XLM testnet gratis dari Friendbot untuk akun yang belum ter-fund.
 */
export async function fundWithFriendbot(publicKey) {
  const res = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(publicKey)}`);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Friendbot gagal: ${body}`);
  }
  return res.json();
}

/**
 * Bangun transaksi payment XLM (belum ditandatangani), return XDR string.
 */
export async function buildPaymentXDR({ sourcePublicKey, destination, amount, memo }) {
  const sourceAccount = await server.loadAccount(sourcePublicKey);

  const txBuilder = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  }).addOperation(
    Operation.payment({
      destination,
      asset: Asset.native(),
      amount: String(amount),
    })
  );

  if (memo) {
    txBuilder.addMemo(Memo.text(memo));
  }

  const tx = txBuilder.setTimeout(180).build();
  return tx.toXDR();
}

/**
 * Submit XDR transaksi yang sudah ditandatangani (signed) ke Horizon testnet.
 */
export async function submitSignedXDR(signedXDR) {
  const tx = TransactionBuilder.fromXDR(signedXDR, NETWORK_PASSPHRASE);
  const result = await server.submitTransaction(tx);
  return result;
}

/**
 * Validasi format dasar public key Stellar (G... 56 karakter).
 */
export function isValidPublicKey(key) {
  return typeof key === "string" && /^G[A-Z2-7]{55}$/.test(key.trim());
}
