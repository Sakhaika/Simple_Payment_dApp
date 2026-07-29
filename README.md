# ⭐ Stellar Payment dApp — White Belt Submission

Simple Payment dApp di **Stellar Testnet**. Connect wallet Freighter, cek balance XLM, dan kirim XLM ke address manapun langsung dari browser.

## Project Description

Aplikasi ini adalah dApp pembayaran sederhana yang dibangun untuk menyelesaikan **Level 1 — White Belt** dari Stellar Frontend Challenge. Fitur utama:

- 🔌 **Connect / Disconnect** wallet Freighter
- 💰 **Fetch & display** balance XLM dari akun yang terhubung (real-time dari Horizon Testnet)
- 🚿 **Fund via Friendbot** satu klik jika akun belum punya XLM testnet
- 💸 **Send XLM transaction** ke address tujuan manapun, dengan input amount & memo opsional
- ✅ **Transaction feedback** — status sukses/gagal beserta transaction hash & link ke Stellar Expert

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | React 19 + Vite |
| Wallet | [Freighter Wallet](https://www.freighter.app/) (browser extension) |
| Wallet API | `@stellar/freighter-api` |
| Blockchain SDK | `@stellar/stellar-sdk` |
| Network | Stellar **Testnet** (Horizon: `https://horizon-testnet.stellar.org`) |

## Setup Instructions (Run Locally)

### 1. Prasyarat
- Node.js ≥ 18
- Browser (Chrome/Brave/Firefox) dengan extension [Freighter Wallet](https://www.freighter.app/) terinstall
- Di Freighter: buat/import akun, lalu set network ke **Test Net** (klik logo network di pojok kanan atas Freighter → pilih Test Net)

### 2. Clone & Install
```bash
git clone <URL_REPO_KAMU>
cd stellar-payment-dapp
npm install
```

### 3. Jalankan Dev Server
```bash
npm run dev
```
Buka `http://localhost:5173` di browser.

### 4. Build untuk Production (opsional)
```bash
npm run build
npm run preview
```

## Cara Pakai

1. Klik **Connect Freighter Wallet** → approve popup di extension Freighter.
2. Kalau akun belum punya saldo, klik **Fund via Friendbot** untuk dapat XLM testnet gratis.
3. Balance XLM akan otomatis tampil dan bisa di-refresh manual.
4. Isi form **Kirim XLM**: destination address (`G...`), amount, memo (opsional) → klik **Send Transaction**.
5. Approve signing di popup Freighter.
6. Hasil transaksi (sukses/gagal + hash) akan tampil di bawah form, dengan link ke Stellar Expert Explorer.

## Project Structure
```
src/
├── App.jsx                  # State management utama (wallet, balance, tx)
├── App.css                  # Styling
├── lib/
│   └── stellar.js           # Helper: Horizon, build/submit transaction, friendbot
└── components/
    ├── WalletConnect.jsx    # UI connect/disconnect
    ├── BalanceDisplay.jsx   # UI balance + fund button
    ├── SendPayment.jsx      # Form kirim XLM
    └── TxResult.jsx         # UI feedback transaksi
```

## Error Handling

- Freighter tidak terinstall → pesan error jelas + arahan install
- Wallet tidak di-set ke Testnet → warning ditampilkan
- Akun belum ter-fund (404 dari Horizon) → tombol Fund via Friendbot muncul otomatis
- Address tujuan tidak valid → validasi sebelum submit
- Transaksi gagal (insufficient balance, dll) → pesan error dari Horizon ditampilkan apa adanya

## Screenshots

> Tambahkan screenshot berikut sebelum submit:

| State | Screenshot |
|---|---|
| Wallet connected | `screenshots/wallet-connected.png` |
| Balance displayed | `screenshots/balance-displayed.png` |
| Successful testnet transaction | `screenshots/tx-success.png` |
| Transaction result shown to user | `screenshots/tx-result.png` |

## Deployment

Deploy gampang ke **Vercel** atau **Netlify**:
```bash
npm run build
# upload folder dist/ atau connect repo langsung
```

## Network Info

- Network: **Stellar Testnet**
- Horizon: `https://horizon-testnet.stellar.org`
- Friendbot: `https://friendbot.stellar.org`
- Explorer: `https://stellar.expert/explorer/testnet`
