'use client';

import React, { useState } from 'react';
import { CatalogWallet } from '@/types/solbundler';
import { calculateOkxFunding, formatAddress } from '@/services/solana';
import {
  Wallet,
  RotateCw,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Plus,
  Coins,
  ShieldCheck,
  ExternalLink,
  Trash2,
  X,
  Key,
  Eye,
  EyeOff,
  Radio,
  Download
} from 'lucide-react';

interface WalletCatalogViewProps {
  wallets: CatalogWallet[];
  onGenerateWallets: (count: number, totalSol: number) => Promise<void> | void;
  onRefresh: () => void;
  onDeleteWallet: (walletId: string) => void;
  onDeleteAllWallets: () => void;
  onSyncBalances?: () => Promise<void> | void;
  isSyncingBalances?: boolean;
}

export default function WalletCatalogView({
  wallets,
  onGenerateWallets,
  onRefresh,
  onDeleteWallet,
  onDeleteAllWallets,
  onSyncBalances,
  isSyncingBalances
}: WalletCatalogViewProps) {
  const [walletCountInput, setWalletCountInput] = useState<number>(5);
  const [totalSolInput, setTotalSolInput] = useState<number>(0.5);
  const [okxSpotSol, setOkxSpotSol] = useState<number>(0.0010);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [walletToDelete, setWalletToDelete] = useState<CatalogWallet | null>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [selectedWalletForKeys, setSelectedWalletForKeys] = useState<CatalogWallet | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const fundingPlan = calculateOkxFunding(
    okxSpotSol,
    walletCountInput,
    totalSolInput
  );

  const totalWallets = wallets.length;
  const availableWallets = wallets.filter((w) => w.status === 'Available').length;
  const assignedWallets = wallets.filter((w) => w.status === 'Assigned').length;
  const totalSol = wallets.reduce((acc, w) => acc + w.balanceSol, 0);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerateWallets(walletCountInput, totalSolInput);
      setSuccessMessage(
        `Sukses membuat ${walletCountInput} Solana Keypair kriptografis resmi (Ed25519). Alamat publik siap diisi saldo dan terhubung langsung ke Solana Mainnet.`
      );
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#090d14] text-zinc-100 p-5 space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Stealth Wallet Catalog</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Katalog pool wallet independen. Generate cryptographic keypair → distribusi saldo OKX / deposit mandiri → pilih saat bundle launch.
        </p>
      </div>

      {/* On-Chain Verification & Connectivity Banner */}
      <div className="bg-[#10141d] border border-emerald-900/50 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white">Solana Mainnet RPC Connection Active</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Setiap wallet yang digenerate adalah <strong>Solana Keypair nyata (Ed25519)</strong>. Jika Anda mengirim saldo SOL ke alamat publik wallet mana pun, saldo langsung masuk secara on-chain dan terdeteksi real-time via RPC.
            </p>
          </div>
        </div>

        {onSyncBalances && (
          <button
            onClick={() => onSyncBalances()}
            disabled={isSyncingBalances || wallets.length === 0}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2 transition-all flex-shrink-0 cursor-pointer shadow-sm"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSyncingBalances ? 'animate-spin' : ''}`} />
            <span>{isSyncingBalances ? 'Querying Solana RPC...' : 'Sync Balances (Solana RPC)'}</span>
          </button>
        )}
      </div>

      {/* OKX Spot Funding Box */}
      <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-5 shadow-sm space-y-4">
        {/* Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <div className="text-[11px] text-zinc-400">OKX spot SOL</div>
            <div className="text-base font-bold text-white mt-0.5">
              {okxSpotSol.toFixed(4)} SOL
            </div>
          </div>

          <div>
            <div className="text-[11px] text-zinc-400">Required for generation</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">
              {fundingPlan.totalRequiredSol.toFixed(4)} SOL{' '}
              <span className="text-xs text-zinc-400 font-normal">
                ({walletCountInput} wallets)
              </span>
            </div>
          </div>
        </div>

        {/* Shortage / Info Warning banner */}
        {!fundingPlan.isSufficient ? (
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 bg-amber-950/30 border border-amber-800/50 rounded-lg p-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              Saldo OKX spot ({okxSpotSol.toFixed(4)} SOL) di bawah rencana distribusi otomatis ({fundingPlan.totalRequiredSol.toFixed(4)} SOL). Anda tetap dapat men-generate wallet kriptografis dan mengirim SOL secara manual/dari Phantom ke alamat public key masing-masing wallet.
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-800/50 rounded-lg p-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Sufficient OKX spot balance available for automated withdrawal split.</span>
          </div>
        )}

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">
              Wallet count
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={walletCountInput}
              onChange={(e) => setWalletCountInput(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 bg-[#161c26] border border-[#2b3342] rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">
              Total SOL (equal split)
            </label>
            <input
              type="number"
              step="0.05"
              min="0.01"
              value={totalSolInput}
              onChange={(e) => setTotalSolInput(Math.max(0.01, parseFloat(e.target.value) || 0.1))}
              className="w-full px-3 py-2 bg-[#161c26] border border-[#2b3342] rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
            <div className="text-[10px] text-zinc-500 font-mono mt-1">
              Alokasi target: ~{fundingPlan.solPerWallet.toFixed(4)} SOL per wallet (+ OKX network fees)
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 text-black font-semibold text-xs rounded-lg flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
          >
            {isGenerating ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Coins className="w-3.5 h-3.5" />
            )}
            <span>
              {isGenerating ? 'Generating Cryptographic Keypairs...' : 'Generate Real Solana Wallets'}
            </span>
          </button>

          <button
            onClick={onRefresh}
            className="px-3 py-2 bg-[#161c26] hover:bg-[#202735] text-zinc-300 text-xs rounded-lg border border-[#2b3342] flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setShowDeleteAllModal(true)}
            disabled={wallets.length === 0}
            className="px-3 py-2 bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 text-xs rounded-lg border border-red-800/60 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Semua Wallet</span>
          </button>
        </div>

        {successMessage && (
          <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800 p-2.5 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Catalog Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-400 font-mono">Total Wallets</div>
          <div className="text-xl font-bold text-white font-mono mt-1">{totalWallets}</div>
        </div>

        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-400 font-mono">Available (Ready)</div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">{availableWallets}</div>
        </div>

        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-400 font-mono">Assigned to Projects</div>
          <div className="text-xl font-bold text-zinc-300 font-mono mt-1">{assignedWallets}</div>
        </div>

        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-400 font-mono">Total Confirmed SOL</div>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {totalSol.toFixed(4)} SOL
          </div>
        </div>
      </div>

      {/* Catalog Wallets Table */}
      <div className="bg-[#10141d] border border-[#21262d] rounded-xl overflow-hidden shadow-sm flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#141923] text-zinc-400 text-[11px] uppercase tracking-wider font-mono border-b border-[#21262d]">
                <th className="py-2.5 px-4">LABEL</th>
                <th className="py-2.5 px-4">PUBKEY (ON-CHAIN)</th>
                <th className="py-2.5 px-4">BATCH</th>
                <th className="py-2.5 px-4">LIVE RPC BALANCE</th>
                <th className="py-2.5 px-4">STATUS</th>
                <th className="py-2.5 px-4">PROJECT</th>
                <th className="py-2.5 px-4 text-right">ACTIONS & KEYS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d] font-mono">
              {wallets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Wallet className="w-8 h-8 text-zinc-600 mb-1" />
                      <p className="text-zinc-300 font-medium">Semua wallet sudah dihapus / Belum ada wallet di katalog</p>
                      <p className="text-[11px] text-zinc-500 max-w-sm">
                        Katalog wallet saat ini kosong (0 wallet). Klik <strong>Generate Real Solana Wallets</strong> di atas untuk membuat batch Keypair kriptografis baru kapan saja.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                wallets.map((w) => (
                  <tr key={w.id} className="hover:bg-[#161c26] transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-white">{w.label}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-zinc-300 font-mono">{formatAddress(w.pubkey, 4, 4)}</span>
                        <button
                          onClick={() => handleCopy(w.pubkey, w.id)}
                          className="text-zinc-500 hover:text-white p-0.5 rounded cursor-pointer"
                          title="Copy public address"
                        >
                          {copiedId === w.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <a
                          href={`https://solscan.io/account/${w.pubkey}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-zinc-500 hover:text-emerald-400 p-0.5"
                          title="Lihat di Solscan"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-zinc-400">{w.batchId}</td>
                    <td className="py-2.5 px-4">
                      <span className={w.balanceSol > 0 ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                        {w.balanceSol.toFixed(4)} SOL
                      </span>
                      {w.lastSyncedAt && (
                        <span className="text-[9px] text-zinc-500 block">synced {w.lastSyncedAt}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          w.status === 'Available'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                            : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/60'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      {w.assignedProjectName ? (
                        <span className="text-emerald-400 font-medium">{w.assignedProjectName}</span>
                      ) : (
                        <span className="text-zinc-500">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* View / Export Key Details */}
                        <button
                          onClick={() => {
                            setSelectedWalletForKeys(w);
                            setShowPrivateKey(false);
                          }}
                          className="px-2 py-1 rounded bg-[#161c26] hover:bg-[#212b3a] text-zinc-300 hover:text-amber-400 border border-[#2b3342] text-[11px] flex items-center space-x-1 transition-colors cursor-pointer"
                          title="Lihat & Export Private Key"
                        >
                          <Key className="w-3 h-3 text-amber-400" />
                          <span>Keys</span>
                        </button>

                        {/* Delete Single Wallet */}
                        <button
                          onClick={() => setWalletToDelete(w)}
                          className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-800/60 transition-colors cursor-pointer"
                          title="Hapus wallet dari catalog"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export / Keys Detail Modal */}
      {selectedWalletForKeys && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#10141d] border border-[#2b3342] rounded-xl p-5 shadow-2xl text-zinc-100 space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
              <div className="flex items-center space-x-2 text-amber-400">
                <Key className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">
                  Kunci Kriptografis ({selectedWalletForKeys.label})
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedWalletForKeys(null);
                  setShowPrivateKey(false);
                }}
                className="p-1 rounded text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Public Address */}
            <div className="space-y-1.5">
              <div className="text-[11px] text-zinc-400 uppercase tracking-wide flex justify-between">
                <span>Public Address (Deposit / Solana Address)</span>
                <a
                  href={`https://solscan.io/account/${selectedWalletForKeys.pubkey}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-emerald-400 hover:underline flex items-center gap-1 text-[10px]"
                >
                  <span>Buka di Solscan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center bg-[#161c26] border border-[#2b3342] rounded-lg px-3 py-2 text-xs text-white break-all">
                <span className="flex-1 select-all">{selectedWalletForKeys.pubkey}</span>
                <button
                  onClick={() => handleCopy(selectedWalletForKeys.pubkey, 'keys_pub')}
                  className="ml-2 text-zinc-400 hover:text-white p-1"
                  title="Copy Public Key"
                >
                  {copiedId === 'keys_pub' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-zinc-500">
                Alamat ini adalah akun Solana resmi. Anda dapat langsung mengirim SOL ke alamat ini dari exchange (OKX/Binance) atau wallet Phantom Anda.
              </p>
            </div>

            {/* Private Key Base58 (Phantom / Solflare format) */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-amber-400 uppercase tracking-wide font-bold">
                  Private Key (Base58 - Phantom / Solflare Import)
                </span>
                <button
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="text-[11px] text-zinc-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                >
                  {showPrivateKey ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>Sembunyikan</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Perlihatkan</span>
                    </>
                  )}
                </button>
              </div>

              {selectedWalletForKeys.privateKeyBase58 ? (
                <div className="flex items-center bg-[#161c26] border border-amber-900/60 rounded-lg px-3 py-2 text-xs text-amber-200 break-all">
                  <span className="flex-1 select-all font-mono">
                    {showPrivateKey
                      ? selectedWalletForKeys.privateKeyBase58
                      : '•'.repeat(44)}
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(selectedWalletForKeys.privateKeyBase58!, 'keys_priv')
                    }
                    className="ml-2 text-zinc-400 hover:text-amber-400 p-1"
                    title="Copy Private Key"
                  >
                    {copiedId === 'keys_priv' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-zinc-500 text-xs italic bg-[#161c26] p-2.5 rounded-lg border border-[#2b3342]">
                  Kunci privat di-generate sebelumnya tanpa cache lokal. Generate batch baru untuk melihat kunci privat lengkap.
                </div>
              )}

              <div className="p-2.5 bg-amber-950/30 border border-amber-800/40 rounded-lg text-amber-300 text-[10px] space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Kerahasiaan Kunci Privat:</span>
                </div>
                <p>
                  Kunci privat ini tersimpan secara lokal di browser Anda dan tidak pernah dikirim ke server backend mana pun. Anda dapat mengimpor string Base58 ini langsung ke Phantom (&apos;Add / Connect Wallet&apos; &rarr; &apos;Import Private Key&apos;) untuk memegang kendali penuh atas dana Anda kapan saja.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => {
                  setSelectedWalletForKeys(null);
                  setShowPrivateKey(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#161c26] hover:bg-[#202735] text-zinc-300 text-xs border border-[#2b3342] transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Wallet Deletion */}
      {walletToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#10141d] border border-[#2b3342] rounded-xl p-5 shadow-2xl text-zinc-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
              <div className="flex items-center space-x-2 text-red-400">
                <Trash2 className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">Hapus Stealth Wallet</h3>
              </div>
              <button
                onClick={() => setWalletToDelete(null)}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-2 font-mono">
              <p className="text-zinc-300">
                Apakah Anda yakin ingin menghapus wallet <strong className="text-white">{walletToDelete.label}</strong> ({formatAddress(walletToDelete.pubkey, 4, 4)})?
              </p>
              {walletToDelete.balanceSol > 0 && (
                <div className="p-2.5 bg-amber-950/40 border border-amber-800/60 rounded text-amber-300 text-[11px]">
                  ⚠️ Perhatian: Wallet ini masih memiliki saldo {walletToDelete.balanceSol.toFixed(4)} SOL.
                </div>
              )}
              {walletToDelete.assignedProjectName && (
                <div className="p-2.5 bg-zinc-800/80 border border-zinc-700/60 rounded text-zinc-300 text-[11px]">
                  Wallet ini terhubung dengan project <strong>{walletToDelete.assignedProjectName}</strong>. Jika dihapus, alokasi project akan disinkronkan secara otomatis.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setWalletToDelete(null)}
                className="px-3 py-1.5 rounded-lg bg-[#161c26] hover:bg-[#202735] text-zinc-300 text-xs border border-[#2b3342] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteWallet(walletToDelete.id);
                  setWalletToDelete(null);
                  setSuccessMessage(`Wallet ${walletToDelete.label} berhasil dihapus dan disinkronkan.`);
                  setTimeout(() => setSuccessMessage(null), 3500);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deleting ALL Wallets */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#10141d] border border-red-800/60 rounded-xl p-5 shadow-2xl text-zinc-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
              <div className="flex items-center space-x-2 text-red-400">
                <Trash2 className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Hapus Semua Wallet Catalog</h3>
              </div>
              <button
                onClick={() => setShowDeleteAllModal(false)}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-2.5 font-mono">
              <p className="text-zinc-300">
                Tindakan ini akan menghapus seluruh <strong className="text-red-400">{wallets.length} wallet</strong> dari pool stealth catalog Anda.
              </p>
              <div className="p-3 bg-red-950/40 border border-red-800 rounded-lg text-red-300 text-[11px] space-y-1">
                <div className="font-bold">⚠️ Peringatan Kritis:</div>
                <p>Seluruh alokasi project aktif yang menggunakan wallet ini akan dilepas dan disinkronkan ke 0.</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowDeleteAllModal(false)}
                className="px-3 py-1.5 rounded-lg bg-[#161c26] hover:bg-[#202735] text-zinc-300 text-xs border border-[#2b3342] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteAllWallets();
                  setShowDeleteAllModal(false);
                  setSuccessMessage('Seluruh stealth wallet berhasil dihapus dan disinkronkan.');
                  setTimeout(() => setSuccessMessage(null), 3500);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Semua</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
