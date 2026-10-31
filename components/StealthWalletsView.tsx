'use client';

import React, { useState } from 'react';
import { CatalogWallet } from '@/types/solbundler';
import { formatAddress, isValidSolanaAddress } from '@/services/solana';
import {
  Search,
  Copy,
  Check,
  RotateCw,
  ShieldCheck,
  Send,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Key,
  Eye,
  EyeOff,
  Radio,
  X
} from 'lucide-react';

interface StealthWalletsViewProps {
  wallets: CatalogWallet[];
  onRefresh: () => void;
  onSweepWallet: (walletId: string, destinationPubkey: string) => void;
  onBulkSweep: (destinationPubkey: string) => void;
  onDeleteWallet?: (walletId: string) => void;
  onDeleteAllWallets?: () => void;
  onSyncBalances?: () => Promise<void> | void;
  isSyncingBalances?: boolean;
}

export default function StealthWalletsView({
  wallets,
  onRefresh,
  onSweepWallet,
  onBulkSweep,
  onDeleteWallet,
  onDeleteAllWallets,
  onSyncBalances,
  isSyncingBalances
}: StealthWalletsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Available' | 'Assigned' | 'Holding'>('All');
  const [bulkDestination, setBulkDestination] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedWalletForKeys, setSelectedWalletForKeys] = useState<CatalogWallet | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const totalCount = wallets.length;
  const totalSol = wallets.reduce((acc, w) => acc + w.balanceSol, 0);
  const holdingCount = wallets.filter((w) => (w.tokenBalance || 0) > 0).length;
  const availableCount = wallets.filter((w) => w.status === 'Available').length;
  const liquidSol = totalSol;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredWallets = wallets.filter((w) => {
    const matchesSearch =
      w.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.pubkey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.assignedProjectName && w.assignedProjectName.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesFilter = true;
    if (filterType === 'Available') matchesFilter = w.status === 'Available';
    if (filterType === 'Assigned') matchesFilter = w.status === 'Assigned';
    if (filterType === 'Holding') matchesFilter = (w.tokenBalance || 0) > 0;

    return matchesSearch && matchesFilter;
  });

  const handleExecuteBulkSweep = () => {
    if (!bulkDestination) {
      setAlert({
        type: 'error',
        text: 'Please enter a valid destination public key for bulk sweep.'
      });
      return;
    }
    if (!isValidSolanaAddress(bulkDestination)) {
      setAlert({
        type: 'error',
        text: 'The sweep destination is not a valid Solana public key.'
      });
      return;
    }

    onBulkSweep(bulkDestination);
    setAlert({
      type: 'success',
      text: `Bulk sweep transaction dispatched for ${wallets.length} stealth wallets.`
    });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleIndividualSweep = (walletId: string) => {
    if (!bulkDestination) {
      setAlert({
        type: 'error',
        text: 'Specify destination wallet pubkey above first before sweeping.'
      });
      return;
    }
    if (!isValidSolanaAddress(bulkDestination)) {
      setAlert({
        type: 'error',
        text: 'Invalid Solana address format.'
      });
      return;
    }
    onSweepWallet(walletId, bulkDestination);
    setAlert({
      type: 'success',
      text: `Swept wallet ${walletId} to ${formatAddress(bulkDestination, 4, 4)}.`
    });
    setTimeout(() => setAlert(null), 3500);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#090d14] text-zinc-100 p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">All stealth wallets</h1>
          <p className="text-xs text-zinc-400 mt-1">
            All available and project-assigned wallets in the catalog.
          </p>
        </div>

        {onSyncBalances && (
          <button
            onClick={() => onSyncBalances()}
            disabled={isSyncingBalances || wallets.length === 0}
            className="px-3.5 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-xs rounded-lg border border-emerald-800/60 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 transition-colors cursor-pointer font-mono"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSyncingBalances ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isSyncingBalances ? 'Querying Solana RPC...' : 'Sync Balances (Solana RPC)'}</span>
          </button>
        )}
      </div>

      {alert && (
        <div
          className={`p-3 rounded-lg border text-xs font-mono flex items-center gap-2 ${
            alert.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
              : 'bg-red-950/40 border-red-800 text-red-400'
          }`}
        >
          {alert.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{alert.text}</span>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-400 font-mono">Total</div>
          <div className="text-xl font-bold text-white font-mono mt-0.5">{totalCount}</div>
        </div>

        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-400 font-mono">SOL</div>
          <div className="text-xl font-bold text-white font-mono mt-0.5">
            {totalSol.toFixed(4)}
          </div>
        </div>

        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-400 font-mono">Holding</div>
          <div className="text-xl font-bold text-white font-mono mt-0.5">{holdingCount}</div>
        </div>

        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-400 font-mono">Liquid</div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
            {liquidSol.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Filter & Search */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[300px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search address, label, proj..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#161c26] border border-[#2b3342] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-[#161c26] border border-[#2b3342] text-zinc-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="All">
              All ({totalCount} wallets • {totalSol.toFixed(4)} SOL • {holdingCount} holding • {availableCount} available)
            </option>
            <option value="Available">Available Only ({availableCount})</option>
            <option value="Assigned">Assigned Only ({totalCount - availableCount})</option>
            <option value="Holding">Holding Tokens Only ({holdingCount})</option>
          </select>
        </div>

        {/* Bulk Sweep Destination */}
        <div className="flex items-center space-x-2">
          <div className="text-[11px] text-zinc-400 font-mono hidden sm:inline">Bulk sweep destination</div>
          <input
            type="text"
            value={bulkDestination}
            onChange={(e) => setBulkDestination(e.target.value)}
            placeholder="Destination wallet pubkey"
            className="w-60 px-3 py-1.5 bg-[#161c26] border border-[#2b3342] rounded-lg text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleExecuteBulkSweep}
            className="px-3.5 py-1.5 bg-[#1c2230] hover:bg-emerald-600 hover:text-white text-zinc-200 border border-[#2f3747] hover:border-emerald-500 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Sweep
          </button>
          {onDeleteAllWallets && (
            <button
              onClick={() => {
                if (window.confirm(`Hapus SELURUH ${wallets.length} stealth wallet dari pool? Tindakan ini akan mengosongkan catalog.`)) {
                  onDeleteAllWallets();
                  setAlert({
                    type: 'success',
                    text: 'Seluruh stealth wallet berhasil dihapus.'
                  });
                  setTimeout(() => setAlert(null), 3000);
                }
              }}
              disabled={wallets.length === 0}
              className="px-3 py-1.5 bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 text-xs rounded-lg border border-red-800/60 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Hapus semua wallet di pool"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>
      </div>

      {/* Full Wallets Table */}
      <div className="bg-[#10141d] border border-[#21262d] rounded-xl overflow-hidden shadow-sm flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#141923] text-zinc-400 text-[11px] uppercase tracking-wider font-mono border-b border-[#21262d]">
                <th className="py-2.5 px-4">WALLET</th>
                <th className="py-2.5 px-4">PROJECT</th>
                <th className="py-2.5 px-4">ADDRESS</th>
                <th className="py-2.5 px-4">SOL</th>
                <th className="py-2.5 px-4">TOKEN</th>
                <th className="py-2.5 px-4">VALUE</th>
                <th className="py-2.5 px-4">STATUS</th>
                <th className="py-2.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d] font-mono">
              {filteredWallets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    <p className="text-zinc-400 font-medium">Tidak ada wallet ditemukan (0 stealth wallets)</p>
                    <p className="text-[11px] text-zinc-600 mt-1">Semua wallet telah dihapus dari sistem atau belum dibuat.</p>
                  </td>
                </tr>
              ) : (
                filteredWallets.map((w) => (
                  <tr key={w.id} className="hover:bg-[#161c26] transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-white">{w.label}</td>
                  <td className="py-2.5 px-4">
                    {w.assignedProjectName ? (
                      <span className="text-emerald-400 font-medium">{w.assignedProjectName}</span>
                    ) : (
                      <span className="text-zinc-500">—</span>
                    )}
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-zinc-300 font-mono">{formatAddress(w.pubkey, 4, 4)}</span>
                      <button
                        onClick={() => handleCopy(w.pubkey, w.id)}
                        className="text-zinc-500 hover:text-white p-0.5 rounded cursor-pointer"
                        title="Copy Address"
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
                  <td className="py-2.5 px-4 text-zinc-300">
                    <span className={w.balanceSol > 0 ? 'text-emerald-400 font-bold' : ''}>
                      {w.balanceSol.toFixed(4)} SOL
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-zinc-400">{(w.tokenBalance || 0).toFixed(2)}</td>
                  <td className="py-2.5 px-4 text-zinc-400">{(w.tokenValueSol || 0).toFixed(4)}</td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        w.status === 'Available'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                          : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700/60'
                      }`}
                    >
                      {w.status === 'Available' ? 'AVAILABLE' : 'EMPTY'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => {
                          setSelectedWalletForKeys(w);
                          setShowPrivateKey(false);
                        }}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#161c26] hover:bg-[#202735] text-zinc-300 hover:text-amber-400 border border-[#2b3342] transition-colors cursor-pointer flex items-center space-x-1"
                        title="Lihat & Export Keys"
                      >
                        <Key className="w-3 h-3 text-amber-400" />
                        <span>Keys</span>
                      </button>

                      <button
                        onClick={() => handleIndividualSweep(w.id)}
                        className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-[#1c2230] hover:bg-[#252e42] text-zinc-300 hover:text-white border border-[#2f3747] transition-colors cursor-pointer"
                      >
                        Sweep
                      </button>
                      {onDeleteWallet && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus stealth wallet ${w.label} (${w.pubkey.slice(0, 4)}...${w.pubkey.slice(-4)})?`)) {
                              onDeleteWallet(w.id);
                              setAlert({
                                type: 'success',
                                text: `Wallet ${w.label} berhasil dihapus dan disinkronkan.`
                              });
                              setTimeout(() => setAlert(null), 3000);
                            }
                          }}
                          className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-800/60 transition-colors cursor-pointer"
                          title="Hapus wallet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
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
                <span>Public Address (Solana Address)</span>
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
                  onClick={() => handleCopy(selectedWalletForKeys.pubkey, 'sw_keys_pub')}
                  className="ml-2 text-zinc-400 hover:text-white p-1"
                  title="Copy Public Key"
                >
                  {copiedId === 'sw_keys_pub' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
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
                      handleCopy(selectedWalletForKeys.privateKeyBase58!, 'sw_keys_priv')
                    }
                    className="ml-2 text-zinc-400 hover:text-amber-400 p-1"
                    title="Copy Private Key"
                  >
                    {copiedId === 'sw_keys_priv' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-zinc-500 text-xs italic bg-[#161c26] p-2.5 rounded-lg border border-[#2b3342]">
                  Kunci privat di-generate sebelumnya tanpa cache lokal.
                </div>
              )}
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
    </div>
  );
}
