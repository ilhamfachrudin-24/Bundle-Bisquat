'use client';

import React, { useState, useEffect } from 'react';
import { CatalogWallet } from '@/types/solbundler';
import { formatAddress, isValidSolanaAddress } from '@/services/solana';
import {
  Zap,
  RotateCw,
  Play,
  Square,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Terminal,
  Copy,
  Check,
  Code2,
  Cpu,
  ExternalLink,
  ShieldCheck,
  FileCode,
  Download
} from 'lucide-react';

interface VolumeBotViewProps {
  wallets: CatalogWallet[];
  onRefresh: () => void;
  onQuickGenerateWallets?: () => void;
}

export default function VolumeBotView({
  wallets,
  onRefresh,
  onQuickGenerateWallets
}: VolumeBotViewProps) {
  const [activeTab, setActiveTab] = useState<'live' | 'rust' | 'python'>('live');
  const [tokenMint, setTokenMint] = useState('Fq2twFvM2ttSK4gqpbYeXWkDubJH3ZUv6r2g9HikSXru');
  const [selectedWalletIds, setSelectedWalletIds] = useState<string[]>(() =>
    wallets.slice(0, Math.min(5, wallets.length)).map((w) => w.id)
  );
  const [botRunning, setBotRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);
  const [volumeGenerated, setVolumeGenerated] = useState<number>(0);
  const [tradesCount, setTradesCount] = useState<number>(0);
  const [logs, setLogs] = useState<
    { timestamp: string; phase: number; action: string; details: string; txHash?: string }[]
  >([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleWalletSelection = (id: string) => {
    if (selectedWalletIds.includes(id)) {
      setSelectedWalletIds(selectedWalletIds.filter((wId) => wId !== id));
    } else {
      setSelectedWalletIds([...selectedWalletIds, id]);
    }
  };

  const handleSelectAll = () => {
    setSelectedWalletIds(wallets.map((w) => w.id));
  };

  const handleClear = () => {
    setSelectedWalletIds([]);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleStartBot = () => {
    setValidationError(null);
    if (wallets.length === 0) {
      setValidationError(
        'Belum ada wallet di Catalog. Buka menu "Wallet Catalog" untuk generate wallet, atau klik tombol Quick Start di bawah.'
      );
      return;
    }
    if (!tokenMint.trim()) {
      setValidationError('Token Mint Address is required.');
      return;
    }
    if (!isValidSolanaAddress(tokenMint.trim())) {
      setValidationError('Please enter a valid Solana token mint address on the ed25519 curve.');
      return;
    }
    if (selectedWalletIds.length < 2) {
      setValidationError('Pilih minimal 2 catalog wallets untuk simulasi volume bot yang natural.');
      return;
    }

    setBotRunning(true);
    setCurrentPhase(1);
    setVolumeGenerated(0.184);
    setTradesCount(3);
    const initialLog = {
      timestamp: new Date().toLocaleTimeString(),
      phase: 1,
      action: 'Phase 1: Radar Initiated',
      details: 'Dispatched 3 micro-buys (0.045 SOL, 0.062 SOL, 0.077 SOL) through Jito bundle.'
    };
    setLogs([initialLog]);
  };

  const handleStopBot = () => {
    setBotRunning(false);
    setLogs((prev) => [
      {
        timestamp: new Date().toLocaleTimeString(),
        phase: currentPhase,
        action: 'Bot Suspended',
        details: 'Volume execution paused by operator.'
      },
      ...prev
    ]);
  };

  // Automated step progression when bot is running
  useEffect(() => {
    if (!botRunning) return;

    const interval = setInterval(() => {
      setLogs((prev) => {
        const randAmount = (0.03 + Math.random() * 0.08).toFixed(4);
        const activePool =
          selectedWalletIds.length > 0
            ? wallets.filter((w) => selectedWalletIds.includes(w.id))
            : wallets;
        const randomWallet =
          activePool.length > 0
            ? activePool[Math.floor(Math.random() * activePool.length)]
            : null;
        const walletDisplay = randomWallet
          ? formatAddress(randomWallet.pubkey, 4, 4)
          : 'Active Sub-Wallet';

        const newTrade = {
          timestamp: new Date().toLocaleTimeString(),
          phase: currentPhase,
          action: currentPhase === 2 ? 'Phase 2: Bear Trap Dip' : 'Volume Buy Order',
          details: `Wallet ${walletDisplay} executed swap: +${randAmount} SOL equivalent.`
        };
        return [newTrade, ...prev.slice(0, 40)];
      });

      setVolumeGenerated((prev) => Number((prev + 0.05).toFixed(4)));
      setTradesCount((prev) => prev + 1);

      // Phase cycling: 1 -> 2 -> 3 -> 1
      setCurrentPhase((prev) => (prev === 1 ? 2 : prev === 2 ? 3 : 1));
    }, 5500);

    return () => clearInterval(interval);
  }, [botRunning, currentPhase, wallets, selectedWalletIds]);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#090d14] text-zinc-100 p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#21262d]">
        <div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Volume Bot Suite</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Engine pembuat volume otomatis Solana & Pump.fun — didukung web interactive bot, program on-chain <strong>Rust</strong>, dan skrip mandiri <strong>Python</strong>.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 bg-[#141923] border border-[#2b3342] p-1 rounded-lg text-xs font-mono">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'live'
                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>⚡ Live Web Bot</span>
          </button>
          <button
            onClick={() => setActiveTab('rust')}
            className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'rust'
                ? 'bg-amber-500 text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>🦀 Rust Engine</span>
          </button>
          <button
            onClick={() => setActiveTab('python')}
            className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'python'
                ? 'bg-sky-500 text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>🐍 Python Bot</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LIVE INTERACTIVE BOT */}
      {activeTab === 'live' && (
        <>
          {validationError && (
            <div className="p-3 bg-red-950/40 border border-red-800 text-red-400 rounded-lg text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1">
            {/* Left Column: Bot Settings */}
            <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white tracking-tight">Bot Parameters</h2>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/60">
                  {selectedWalletIds.length} Wallets Active
                </span>
              </div>

              {/* Token Mint Address */}
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                  Token Mint Address *
                </label>
                <input
                  type="text"
                  value={tokenMint}
                  onChange={(e) => setTokenMint(e.target.value)}
                  placeholder="Pump.fun token mint pubkey..."
                  className="w-full px-3 py-2 bg-[#161c26] border border-[#2b3342] rounded-lg text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Catalog Wallets Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-mono text-zinc-400">
                    Pilih Stealth Wallets ({selectedWalletIds.length}/{wallets.length}) *
                  </label>
                  <div className="flex items-center space-x-2 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      Pilih Semua
                    </button>
                    <span className="text-zinc-600">•</span>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      Bersihkan
                    </button>
                  </div>
                </div>

                {/* Scrollable list */}
                <div className="border border-[#21262d] rounded-lg overflow-y-auto max-h-48 bg-[#090d14] divide-y divide-[#1e2430]">
                  {wallets.length === 0 ? (
                    <div className="p-4 text-center text-zinc-500 text-xs font-mono space-y-2">
                      <p>Belum ada wallet di Catalog.</p>
                      <p className="text-[10px] text-zinc-600">
                        Buka tab Wallet Catalog untuk generate batch keypair, atau jalankan bot langsung menggunakan skrip Python di tab &quot;🐍 Python Bot&quot;.
                      </p>
                    </div>
                  ) : (
                    wallets.map((w) => {
                      const isSelected = selectedWalletIds.includes(w.id);
                      return (
                        <div
                          key={w.id}
                          onClick={() => toggleWalletSelection(w.id)}
                          className={`flex items-center justify-between px-3 py-2 text-xs font-mono cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#14231f] text-emerald-300' : 'hover:bg-[#131922] text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="rounded border-[#30363d] text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                            />
                            <span className="font-semibold text-white">{w.label}</span>
                            <span className="text-zinc-400">{formatAddress(w.pubkey, 4, 4)}</span>
                          </div>

                          <div className="flex items-center space-x-3 text-[11px]">
                            <span className="text-zinc-400">{w.balanceSol.toFixed(4)} SOL</span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] ${
                                w.status === 'Available'
                                  ? 'bg-emerald-950/60 text-emerald-400'
                                  : 'bg-zinc-800 text-zinc-400'
                              }`}
                            >
                              {w.status}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 3-Phase Strategy Card */}
              <div className="bg-[#141923] border border-[#21262d] rounded-lg p-3 text-xs space-y-2 font-mono">
                <div className="flex items-center justify-between pb-1 border-b border-[#21262d]">
                  <div>
                    <span className="font-semibold text-white">Phase 1 — Radar</span>
                    <p className="text-[10px] text-zinc-400">0-60s • 3 quick buys • 0.03–0.10 SOL</p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-white">Phase 2 — Bear Trap</span>
                    <p className="text-[10px] text-zinc-400">1-2m • ~60% position sell • 10-20s wait</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="font-semibold text-white">Phase 3 — FOMO Breakout</span>
                    <p className="text-[10px] text-zinc-400">2-5m • 4:1 buy/sell ratio • Sustained volume</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-400">Jitter 3-12s • anti-detection</span>
                  </div>
                </div>
              </div>

              {/* Start / Stop Button */}
              <div>
                {!botRunning ? (
                  <button
                    onClick={handleStartBot}
                    className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Mulai Volume Bot Sekarang</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStopBot}
                    className="w-full py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>Hentikan Bot (Pause)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Bot Status */}
            <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-5 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white tracking-tight">Live Telemetry & Logs</h2>
                {botRunning ? (
                  <span className="flex items-center space-x-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Aktif (Phase {currentPhase})</span>
                  </span>
                ) : (
                  <span className="text-xs font-mono text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">
                    Standby
                  </span>
                )}
              </div>

              {!botRunning && logs.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-zinc-500 font-mono text-xs">
                  <Zap className="w-8 h-8 text-zinc-600 mb-2 stroke-1" />
                  <span className="text-zinc-300 font-semibold">Volume bot belum berjalan</span>
                  <p className="text-[11px] text-zinc-500 mt-1 max-w-xs">
                    Klik <strong>&quot;Mulai Volume Bot Sekarang&quot;</strong> di sebelah kiri untuk mengaktifkan alur trading 3-phase otomatis.
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col space-y-4">
                  {/* Real-time metrics */}
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="bg-[#141923] border border-[#21262d] p-3 rounded-lg">
                      <div className="text-[11px] text-zinc-400">Total Volume Tergenerate</div>
                      <div className="text-lg font-bold text-emerald-400 mt-0.5">
                        +{volumeGenerated.toFixed(4)} SOL
                      </div>
                    </div>
                    <div className="bg-[#141923] border border-[#21262d] p-3 rounded-lg">
                      <div className="text-[11px] text-zinc-400">Transaksi Selesai (Swaps)</div>
                      <div className="text-lg font-bold text-white mt-0.5">{tradesCount}</div>
                    </div>
                  </div>

                  {/* Live activity log */}
                  <div className="flex-1 bg-[#090d14] border border-[#21262d] rounded-lg p-3 font-mono text-xs overflow-y-auto max-h-[320px] space-y-2">
                    {logs.map((log, idx) => (
                      <div key={idx} className="border-b border-[#1c2230] pb-2 text-[11px]">
                        <div className="flex items-center justify-between text-zinc-400">
                          <span className="text-sky-400">[{log.timestamp}]</span>
                          <span className="text-amber-400 font-semibold">{log.action}</span>
                        </div>
                        <p className="text-zinc-200 mt-0.5">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* TAB 2: RUST HIGH-PERFORMANCE ENGINE */}
      {activeTab === 'rust' && (
        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-5 shadow-sm space-y-5 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#21262d]">
            <div>
              <div className="flex items-center space-x-2 text-amber-400">
                <Cpu className="w-4 h-4" />
                <h2 className="text-sm font-bold text-white">🦀 Solana On-Chain & Jito Engine (Rust)</h2>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Program Solana native dalam bahasa <strong>Rust</strong> untuk bundling multi-wallet atomik, tip Jito MEV, dan client engine berkecepatan tinggi (&lt;10ms).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-amber-950/60 text-amber-400 border border-amber-800/60 text-[10px]">
                Rust Edition 2021
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Box 1: On-Chain Program */}
            <div className="bg-[#141923] border border-[#2b3342] rounded-lg p-4 space-y-2.5">
              <div className="flex items-center justify-between text-white font-bold text-xs pb-1 border-b border-[#21262d]">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>programs/solbundler/src/lib.rs</span>
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      'cargo build-sbf --manifest-path programs/solbundler/Cargo.toml',
                      'rust_build'
                    )
                  }
                  className="text-zinc-400 hover:text-white flex items-center gap-1 text-[10px]"
                >
                  {copiedKey === 'rust_build' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Build Command</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">
                Instruksi program on-chain: <code>DisperseSol</code> (dispersi modal), <code>SweepSol</code> (penarikan saldo bersih), dan <code>PayJitoTip</code> (slot MEV priority fee).
              </p>
              <pre className="p-3 bg-[#0a0d14] rounded border border-[#1e2430] text-[10px] text-zinc-300 overflow-x-auto">
{`# 1. Kompilasi smart contract Solana Rust:
cargo build-sbf --manifest-path programs/solbundler/Cargo.toml

# 2. Deploy ke Solana Mainnet / Devnet:
solana program deploy programs/solbundler/target/deploy/solbundler.so`}
              </pre>
            </div>

            {/* Box 2: Jito Engine Client */}
            <div className="bg-[#141923] border border-[#2b3342] rounded-lg p-4 space-y-2.5">
              <div className="flex items-center justify-between text-white font-bold text-xs pb-1 border-b border-[#21262d]">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>crates/jito-bundler/src/main.rs</span>
                </span>
                <button
                  onClick={() =>
                    handleCopy('cargo run --release --manifest-path crates/jito-bundler/Cargo.toml', 'rust_run')
                  }
                  className="text-zinc-400 hover:text-white flex items-center gap-1 text-[10px]"
                >
                  {copiedKey === 'rust_run' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Run Command</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">
                Searcher engine multi-threaded untuk merakit bundle transaksi, menandatangani keypair Ed25519, dan mengirim payload JSON-RPC langsung ke Jito Block Engine.
              </p>
              <pre className="p-3 bg-[#0a0d14] rounded border border-[#1e2430] text-[10px] text-zinc-300 overflow-x-auto">
{`# Jalankan Rust Jito Searcher Client:
cargo run --release --manifest-path crates/jito-bundler/Cargo.toml`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PYTHON AUTONOMOUS BOT */}
      {activeTab === 'python' && (
        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-5 shadow-sm space-y-5 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#21262d]">
            <div>
              <div className="flex items-center space-x-2 text-sky-400">
                <Terminal className="w-4 h-4" />
                <h2 className="text-sm font-bold text-white">🐍 Python Autonomous Volume & Maker Bot</h2>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Skrip <strong>Python</strong> mandiri untuk menjalankan bot market maker, micro-swap, jitter delays, dan penarikan CEX OKX di terminal VPS atau lokal.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-sky-950/60 text-sky-400 border border-sky-800/60 text-[10px]">
                Python 3.10+
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Box 1: volume_bot.py */}
            <div className="bg-[#141923] border border-[#2b3342] rounded-lg p-4 space-y-2.5">
              <div className="flex items-center justify-between text-white font-bold text-xs pb-1 border-b border-[#21262d]">
                <span className="flex items-center gap-1.5 text-sky-300">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>scripts/python/volume_bot.py</span>
                </span>
                <button
                  onClick={() =>
                    handleCopy(`python3 scripts/python/volume_bot.py --token ${tokenMint}`, 'py_vol')
                  }
                  className="text-zinc-400 hover:text-white flex items-center gap-1 text-[10px]"
                >
                  {copiedKey === 'py_vol' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy CLI Command</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">
                Mengeksekusi siklus 3 fase natural: Radar Phase &rarr; Bear Trap Dip &rarr; High-frequency Volume dengan interval delay acak (jitter 3-12s).
              </p>
              <pre className="p-3 bg-[#0a0d14] rounded border border-[#1e2430] text-[10px] text-zinc-300 overflow-x-auto">
{`# 1. Install dependencies:
pip install -r scripts/python/requirements.txt

# 2. Jalankan bot untuk token Anda:
python3 scripts/python/volume_bot.py --token ${tokenMint} --min-delay 3.0 --max-delay 10.0 --cycles 100`}
              </pre>
            </div>

            {/* Box 2: okx_stealth_disperser.py */}
            <div className="bg-[#141923] border border-[#2b3342] rounded-lg p-4 space-y-2.5">
              <div className="flex items-center justify-between text-white font-bold text-xs pb-1 border-b border-[#21262d]">
                <span className="flex items-center gap-1.5 text-sky-300">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>scripts/python/okx_stealth_disperser.py</span>
                </span>
                <button
                  onClick={() =>
                    handleCopy('python3 scripts/python/okx_stealth_disperser.py', 'py_okx')
                  }
                  className="text-zinc-400 hover:text-white flex items-center gap-1 text-[10px]"
                >
                  {copiedKey === 'py_okx' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy CLI Command</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">
                Mendistribusikan modal SOL dari CEX OKX ke seluruh sub-wallet stealth dengan enkripsi HMAC SHA256 tanpa relasi on-chain.
              </p>
              <pre className="p-3 bg-[#0a0d14] rounded border border-[#1e2430] text-[10px] text-zinc-300 overflow-x-auto">
{`# Jalankan pendanaan otomatis OKX:
python3 scripts/python/okx_stealth_disperser.py`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
