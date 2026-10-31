'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Wallet,
  LogOut,
  AlertCircle,
  RotateCw,
  Sparkles,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import {
  formatAddress,
  isValidSolanaAddress,
  fetchLiveSolBalance,
  detectSolanaProviders
} from '@/services/solana';

interface PhantomConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedAddress: string | null;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
  walletBalanceSol?: number | null;
  onRefreshBalance?: () => void;
}

export default function PhantomConnectModal({
  isOpen,
  onClose,
  connectedAddress,
  onConnect,
  onDisconnect,
  walletBalanceSol,
  onRefreshBalance
}: PhantomConnectModalProps) {
  const [copied, setCopied] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'extension' | 'manual'>('extension');
  const [manualAddress, setManualAddress] = useState('');
  const [isValidatingManual, setIsValidatingManual] = useState(false);
  const [liveBalance, setLiveBalance] = useState<number | null>(walletBalanceSol ?? null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Computed detected extensions
  const detectedExtensions = isOpen
    ? detectSolanaProviders()
    : { phantom: false, solflare: false, backpack: false };

  const handleManualRefresh = async () => {
    if (!connectedAddress) return;
    setIsRefreshing(true);
    try {
      const bal = await fetchLiveSolBalance(connectedAddress);
      setLiveBalance(bal);
      if (onRefreshBalance) onRefreshBalance();
    } finally {
      setIsRefreshing(false);
    }
  };

  const currentDisplayBalance = liveBalance ?? walletBalanceSol;

  if (!isOpen) return null;

  const handleCopy = () => {
    if (connectedAddress) {
      navigator.clipboard.writeText(connectedAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWalletSelect = async (walletName: 'Phantom' | 'Solflare' | 'Backpack') => {
    setConnectingWallet(walletName);
    setErrorMsg(null);

    try {
      const anyWin = typeof window !== 'undefined' ? (window as any) : null;
      let provider: any = null;

      if (walletName === 'Phantom') {
        provider = anyWin?.phantom?.solana || (anyWin?.solana?.isPhantom ? anyWin.solana : null);
      } else if (walletName === 'Solflare') {
        provider = anyWin?.solflare?.isSolflare ? anyWin.solflare : null;
      } else if (walletName === 'Backpack') {
        provider = anyWin?.backpack || null;
      }

      if (provider) {
        // Connect to real browser extension
        const resp = await provider.connect();
        const pubkeyStr = resp.publicKey?.toString() || provider.publicKey?.toString();
        
        if (pubkeyStr) {
          onConnect(pubkeyStr);

          // Setup real-time event listeners
          provider.on?.('accountChanged', (publicKey: any) => {
            if (publicKey) {
              onConnect(publicKey.toString());
            } else {
              onDisconnect();
            }
          });

          provider.on?.('disconnect', () => {
            onDisconnect();
          });

          setConnectingWallet(null);
          onClose();
          return;
        }
      }

      // If provider not found or blocked by iframe sandbox
      setErrorMsg(
        `Ekstensi ${walletName} belum terpasang atau dibatasi oleh sandbox browser. Silakan gunakan tab "Input Manual Public Key" untuk menghubungkan alamat Solana Anda secara langsung.`
      );
      setConnectingWallet(null);
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setErrorMsg(err?.message || 'Koneksi wallet dibatalkan oleh pengguna.');
      setConnectingWallet(null);
    }
  };

  const handleManualConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleaned = manualAddress.trim();

    if (!cleaned) {
      setErrorMsg('Masukkan alamat Public Key Solana.');
      return;
    }

    if (!isValidSolanaAddress(cleaned)) {
      setErrorMsg('Format Public Key Solana tidak valid. Pastikan alamat Base58 benar (32–44 karakter).');
      return;
    }

    setIsValidatingManual(true);
    try {
      // Test fetching live balance from Solana Mainnet RPC
      const bal = await fetchLiveSolBalance(cleaned);
      setLiveBalance(bal);
      onConnect(cleaned);
      setIsValidatingManual(false);
      onClose();
    } catch {
      onConnect(cleaned);
      setIsValidatingManual(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-md bg-[#10141d] border border-[#2b3342] rounded-2xl p-6 shadow-2xl relative text-zinc-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1a212d] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-base font-bold text-white tracking-tight">
              {connectedAddress ? 'Solana Wallet Terhubung' : 'Connect Solana Wallet'}
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {connectedAddress
              ? 'Terhubung secara real-time ke Solana Mainnet-Beta untuk developer signing & Jito bundles'
              : 'Sinkronisasi wallet Anda dengan SolBundler (Phantom, Solflare, atau Public Key)'}
          </p>
        </div>

        {connectedAddress ? (
          /* Connected State */
          <div className="space-y-4">
            <div className="bg-[#161c26] border border-emerald-500/30 rounded-xl p-4 space-y-3 font-mono text-xs shadow-[0_0_15px_rgba(16,185,129,0.06)]">
              {/* Status Row */}
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <span className="text-zinc-400">Sinkronisasi Real-Time:</span>
                <span className="text-emerald-400 flex items-center gap-1.5 font-semibold bg-emerald-950/60 border border-emerald-700/40 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active & Synced
                </span>
              </div>

              {/* Address display */}
              <div className="bg-[#0e1219] p-2.5 rounded-lg border border-[#262f3f] flex items-center justify-between">
                <span className="text-zinc-200 text-sm font-semibold truncate pr-2">
                  {formatAddress(connectedAddress, 8, 8)}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-[#202735] transition-colors cursor-pointer flex-shrink-0"
                  title="Copy full address"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Real-time On-Chain SOL Balance */}
              <div className="p-2.5 bg-[#0e1219] rounded-lg border border-[#262f3f] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Live On-Chain Balance</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    {currentDisplayBalance !== null && currentDisplayBalance !== undefined
                      ? `${currentDisplayBalance.toFixed(6)} SOL`
                      : '0.000000 SOL'}
                  </div>
                </div>
                <button
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="flex items-center space-x-1 text-[11px] bg-[#1a212d] hover:bg-[#262f3f] text-zinc-300 px-2.5 py-1.5 rounded border border-[#303949] transition-colors cursor-pointer"
                  title="Ambil data saldo terbaru dari Solana RPC"
                >
                  <RotateCw className={`w-3 h-3 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Sync RPC</span>
                </button>
              </div>

              {/* Network Details */}
              <div className="text-[11px] text-zinc-400 pt-1 border-t border-[#262f3f] flex items-center justify-between">
                <span>Solana Cluster:</span>
                <span className="text-zinc-300 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Mainnet-Beta (Jito Enabled)
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2">
              <a
                href={`https://solscan.io/account/${connectedAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-lg bg-[#161c26] hover:bg-[#202735] border border-[#2b3342] text-xs font-semibold flex items-center justify-center space-x-1.5 text-zinc-300 transition-colors"
              >
                <span>Cek di Solscan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  onDisconnect();
                  setLiveBalance(null);
                  onClose();
                }}
                className="py-2.5 px-4 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        ) : (
          /* Disconnected State */
          <div className="space-y-3">
            {/* Tab switch: Extension vs Manual Input */}
            <div className="flex bg-[#161c26] p-1 rounded-xl border border-[#262f3f] text-xs">
              <button
                onClick={() => {
                  setActiveTab('extension');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === 'extension'
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Browser Extension
              </button>
              <button
                onClick={() => {
                  setActiveTab('manual');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === 'manual'
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Input Public Key
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/80 text-red-300 text-[11px] flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {activeTab === 'extension' ? (
              <div className="space-y-2">
                {[
                  {
                    name: 'Phantom' as const,
                    icon: '👻',
                    detected: detectedExtensions.phantom,
                    desc: 'Solana standard extension'
                  },
                  {
                    name: 'Solflare' as const,
                    icon: '🔥',
                    detected: detectedExtensions.solflare,
                    desc: 'Solana native web3 wallet'
                  },
                  {
                    name: 'Backpack' as const,
                    icon: '🎒',
                    detected: detectedExtensions.backpack,
                    desc: 'xNFT & Solana wallet'
                  }
                ].map((w) => (
                  <button
                    key={w.name}
                    onClick={() => handleWalletSelect(w.name)}
                    disabled={connectingWallet !== null}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[#161c26] hover:bg-[#1e2535] border border-[#2b3342] hover:border-emerald-500/50 transition-all cursor-pointer group text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{w.icon}</span>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-emerald-400 flex items-center gap-1.5">
                          <span>{w.name}</span>
                          {w.detected && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                              Detected
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          {w.desc}
                        </div>
                      </div>
                    </div>

                    {connectingWallet === w.name ? (
                      <span className="text-xs text-zinc-400 font-mono animate-pulse">
                        Connecting...
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-500 group-hover:text-zinc-300">
                        Connect →
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              /* Manual Address Input */
              <form onSubmit={handleManualConnect} className="space-y-3">
                <div className="p-3 bg-[#161c26] rounded-xl border border-[#262f3f] space-y-2">
                  <label className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Solana Public Key (Alamat Wallet Anda)</span>
                  </label>
                  <input
                    type="text"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="Contoh: 7WzX...pump / GuhNv3s..."
                    className="w-full bg-[#0d1117] border border-[#30363d] focus:border-emerald-500 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-600 outline-none"
                  />
                  <p className="text-[10px] text-zinc-500 font-mono">
                    Masukkan alamat wallet Solana publik Anda. Sistem akan langsung mengambil data saldo on-chain dari RPC secara real-time.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isValidatingManual || !manualAddress.trim()}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  {isValidatingManual ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Memverifikasi On-Chain RPC...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sinkronkan Wallet Ini</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="pt-2 text-[11px] text-zinc-500 font-mono text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Non-custodial. Private key tetap aman di wallet Anda.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
