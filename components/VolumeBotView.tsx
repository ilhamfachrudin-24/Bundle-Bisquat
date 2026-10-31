'use client';

import React, { useState, useEffect } from 'react';
import { CatalogWallet, VolumeBotConfig } from '@/types/solbundler';
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
  Clock
} from 'lucide-react';

interface VolumeBotViewProps {
  wallets: CatalogWallet[];
  onRefresh: () => void;
}

export default function VolumeBotView({ wallets, onRefresh }: VolumeBotViewProps) {
  const [tokenMint, setTokenMint] = useState('Fq2twFvM2ttSK4gqpbYeXWkDubJH3ZUv6r2g9HikSXru');
  const [selectedWalletIds, setSelectedWalletIds] = useState<string[]>([]);
  const [botRunning, setBotRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);
  const [volumeGenerated, setVolumeGenerated] = useState<number>(0);
  const [tradesCount, setTradesCount] = useState<number>(0);
  const [logs, setLogs] = useState<
    { timestamp: string; phase: number; action: string; details: string; txHash?: string }[]
  >([]);
  const [validationError, setValidationError] = useState<string | null>(null);

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

  const handleStartBot = () => {
    setValidationError(null);
    if (wallets.length === 0) {
      setValidationError('Belum ada wallet di Catalog. Silakan buka menu "Wallet Catalog" dan lakukan Generate Wallet (via OKX distribution) terlebih dahulu.');
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
    if (selectedWalletIds.length < 3) {
      setValidationError('Minimal 3 catalog wallets harus dipilih untuk simulasi volume bot yang natural.');
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
        const newTrade = {
          timestamp: new Date().toLocaleTimeString(),
          phase: currentPhase,
          action: currentPhase === 2 ? 'Phase 2: Bear Trap Dip' : 'Volume Buy Order',
          details: `Wallet ${formatAddress(wallets[Math.floor(Math.random() * wallets.length)]?.pubkey || '', 4, 4)} executed swap: +${randAmount} SOL equivalent.`
        };
        return [newTrade, ...prev.slice(0, 40)];
      });

      setVolumeGenerated((prev) => Number((prev + 0.05).toFixed(4)));
      setTradesCount((prev) => prev + 1);

      // Phase cycling
      setCurrentPhase((prev) => (prev === 1 ? 2 : prev === 2 ? 3 : 1));
    }, 6000);

    return () => clearInterval(interval);
  }, [botRunning, currentPhase, wallets]);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#090d14] text-zinc-100 p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#21262d]">
        <div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Volume Bot</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            3-phase natural volume strategy with catalog wallets. Selected wallets need at least 0.05 SOL each.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="px-3 py-1.5 bg-[#161c26] hover:bg-[#202735] text-zinc-300 text-xs rounded-lg border border-[#2b3342] flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

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
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">Bot Settings</h2>
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
                Catalog Wallets (min 3) *
              </label>
              <div className="flex items-center space-x-2 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-zinc-600">•</span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Scrollable list */}
            <div className="border border-[#21262d] rounded-lg overflow-y-auto max-h-48 bg-[#090d14] divide-y divide-[#1e2430]">
              {wallets.map((w) => {
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
              })}
            </div>
            <div className="text-[11px] font-mono text-zinc-400 mt-1">
              {selectedWalletIds.length} wallets selected
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
                <p className="text-[10px] text-zinc-400">1-2d • ~60% position sell • 10-20s wait between cycles</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="font-semibold text-white">Phase 3 — FOMO Breakout</span>
                <p className="text-[10px] text-zinc-400">2-5d • 4:1 buy/sell ratio • 2-3min duration</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-400">30-60s • cycle repeats</span>
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
                <span>Start Bot</span>
              </button>
            ) : (
              <button
                onClick={handleStopBot}
                className="w-full py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Stop Bot</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Bot Status */}
        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white tracking-tight">Bot Status</h2>
            {botRunning && (
              <span className="flex items-center space-x-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Active (Phase {currentPhase})</span>
              </span>
            )}
          </div>

          {!botRunning && logs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-zinc-500 font-mono text-xs">
              <Zap className="w-8 h-8 text-zinc-600 mb-2 stroke-1" />
              <span>No active bots yet.</span>
              <p className="text-[11px] text-zinc-600 mt-1 max-w-xs">
                Select your catalog wallets, verify mint pubkey, and start the automated 3-phase pump engine.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-4">
              {/* Real-time metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-[#141923] border border-[#21262d] p-3 rounded-lg">
                  <div className="text-[11px] text-zinc-400">Total Volume</div>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">
                    +{volumeGenerated.toFixed(4)} SOL
                  </div>
                </div>
                <div className="bg-[#141923] border border-[#21262d] p-3 rounded-lg">
                  <div className="text-[11px] text-zinc-400">Dispatched Swaps</div>
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
    </div>
  );
}
