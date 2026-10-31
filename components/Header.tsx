'use client';

import React from 'react';
import { Project } from '@/types/solbundler';
import { ShieldCheck, Activity, Layers, ArrowUpRight, Wallet, RotateCw } from 'lucide-react';
import { formatAddress } from '@/services/solana';

interface HeaderProps {
  selectedProject: Project | null;
  totalStealthCount: number;
  liquidSol: number;
  onOpenStealth: () => void;
  onConnectWallet: () => void;
  connectedWalletAddress: string | null;
  walletBalanceSol?: number | null;
  isSyncingBalance?: boolean;
  onSyncBalance?: () => void;
}

export default function Header({
  selectedProject,
  totalStealthCount,
  liquidSol,
  onOpenStealth,
  onConnectWallet,
  connectedWalletAddress,
  walletBalanceSol,
  isSyncingBalance,
  onSyncBalance
}: HeaderProps) {
  const pnlIsNegative = selectedProject ? selectedProject.pnlSol < 0 : false;
  const pnlIsPositive = selectedProject ? selectedProject.pnlSol > 0 : false;

  return (
    <header className="w-full bg-[#0d1117] border-b border-[#21262d] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 select-none">
      {/* Brand */}
      <div className="flex items-center space-x-2.5 min-w-[200px]">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
          <Layers className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white text-base tracking-tight">SolBundler</span>
            <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/60">
              v0.5.53
            </span>
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Solana Mainnet-Beta</span>
          </div>
        </div>
      </div>

      {/* Top Bar Metrics */}
      <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 text-xs">
        {/* Selected Project */}
        <div className="flex-1 min-w-[140px] bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-1.5">
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Selected project</div>
          <div className="font-semibold text-white truncate text-sm mt-0.5">
            {selectedProject ? selectedProject.name : '—'}
          </div>
        </div>

        {/* Portfolio */}
        <div className="flex-1 min-w-[130px] bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-1.5">
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Portfolio</div>
          <div className="font-semibold text-zinc-100 font-mono text-sm mt-0.5">
            {selectedProject ? `${selectedProject.portfolioSol.toFixed(4)} SOL` : '—'}
          </div>
        </div>

        {/* P&L */}
        <div className="flex-1 min-w-[160px] bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-1.5">
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">P&L</div>
          <div
            className={`font-semibold font-mono text-sm mt-0.5 flex items-center gap-1 ${
              pnlIsNegative
                ? 'text-red-400'
                : pnlIsPositive
                ? 'text-emerald-400'
                : 'text-zinc-400'
            }`}
          >
            {selectedProject ? (
              <>
                <span>{selectedProject.pnlSol > 0 ? '+' : ''}{selectedProject.pnlSol.toFixed(4)} SOL</span>
                <span className="text-[11px] opacity-80">({selectedProject.pnlPercent > 0 ? '+' : ''}{selectedProject.pnlPercent.toFixed(2)}%)</span>
              </>
            ) : (
              '—'
            )}
          </div>
        </div>

        {/* Stealth Wallets */}
        <button
          onClick={onOpenStealth}
          className="min-w-[100px] bg-[#161b22] hover:bg-[#1f242c] border border-[#30363d] rounded-lg px-3 py-1.5 text-left transition-colors cursor-pointer group"
        >
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono flex items-center justify-between">
            <span>Stealth</span>
            <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-emerald-400" />
          </div>
          <div className="font-bold text-white font-mono text-sm mt-0.5 group-hover:text-emerald-400">
            {totalStealthCount}
          </div>
        </button>

        {/* Liquid SOL */}
        <div className="min-w-[140px] bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-1.5">
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Liquid SOL</div>
          <div className="font-semibold text-emerald-400 font-mono text-sm mt-0.5">
            {liquidSol.toFixed(6)} SOL
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-2">
        <div className="hidden xl:flex items-center text-[11px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 rounded px-2.5 py-1.5 gap-1.5 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Jito MEV Bundler Ready</span>
        </div>

        {/* Connect Wallet Header Button & Live Sync */}
        {connectedWalletAddress ? (
          <div className="flex items-center space-x-1 bg-emerald-950/40 border border-emerald-500/40 rounded-lg p-0.5 shadow-sm">
            <button
              onClick={onConnectWallet}
              className="flex items-center space-x-2 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:text-white transition-all cursor-pointer"
              title="Kelola wallet terhubung"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-zinc-200">{formatAddress(connectedWalletAddress, 4, 4)}</span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold pl-1 border-l border-emerald-800/60">
                {walletBalanceSol !== null && walletBalanceSol !== undefined
                  ? `${walletBalanceSol.toFixed(4)} SOL`
                  : 'Syncing...'}
              </span>
            </button>

            {onSyncBalance && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSyncBalance();
                }}
                disabled={isSyncingBalance}
                title="Sinkronisasi saldo real-time (Solana RPC)"
                className="p-1 rounded text-emerald-400 hover:text-white hover:bg-emerald-900/60 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isSyncingBalance ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onConnectWallet}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1c182a] hover:bg-[#251f38] border border-purple-500/40 text-purple-300 hover:text-purple-200 shadow-sm transition-all cursor-pointer"
          >
            <span className="text-sm">👻</span>
            <span>Connect Wallet</span>
          </button>
        )}
      </div>
    </header>
  );
}
