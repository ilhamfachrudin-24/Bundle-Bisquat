'use client';

import React, { useState } from 'react';
import { Project, CatalogWallet } from '@/types/solbundler';
import {
  PlusCircle,
  RotateCw,
  HelpCircle,
  Shield,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  ExternalLink,
  Copy,
  Check,
  Search,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { formatAddress } from '@/services/solana';

interface OverviewViewProps {
  projects: Project[];
  wallets: CatalogWallet[];
  onOpenProject: (projectId: string) => void;
  onNewLaunch: () => void;
  onOpenHowToUse: () => void;
  onOpenStealth: () => void;
  onRefresh: () => void;
  onSweepWallet: (walletId: string, destination: string) => void;
  onDeleteWallet?: (walletId: string) => void;
  onDeleteProject?: (projectId: string) => void;
}

export default function OverviewView({
  projects,
  wallets,
  onOpenProject,
  onNewLaunch,
  onOpenHowToUse,
  onOpenStealth,
  onRefresh,
  onSweepWallet,
  onDeleteWallet,
  onDeleteProject
}: OverviewViewProps) {
  const [drawerCollapsed, setDrawerCollapsed] = useState(false);
  const [drawerFullScreen, setDrawerFullScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Assigned'>('All');
  const [sweepDestination, setSweepDestination] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

    const matchesFilter =
      statusFilter === 'All' ? true : w.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const availableCount = wallets.filter((w) => w.status === 'Available').length;
  const holdingCount = wallets.filter((w) => (w.tokenBalance || 0) > 0).length;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#090d14] text-zinc-100 p-5 space-y-5">
      {/* 1. Operations summary */}
      <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-white tracking-tight">Operations summary</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Active projects and quick access.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* + New Launch */}
          <button
            onClick={onNewLaunch}
            className="flex flex-col text-left p-3.5 rounded-lg bg-[#161c27] hover:bg-[#1e2535] border border-[#2b3240] hover:border-emerald-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-2 text-white font-semibold text-xs group-hover:text-emerald-400">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>+ New Launch</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">Stealth bundle + OKX funding</p>
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            className="flex flex-col text-left p-3.5 rounded-lg bg-[#161c27] hover:bg-[#1e2535] border border-[#2b3240] hover:border-emerald-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-2 text-white font-semibold text-xs group-hover:text-emerald-400">
              <RotateCw className="w-4 h-4 text-emerald-400" />
              <span>Refresh</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">Update portfolio and stealth data</p>
          </button>

          {/* How to Use */}
          <button
            onClick={onOpenHowToUse}
            className="flex flex-col text-left p-3.5 rounded-lg bg-[#161c27] hover:bg-[#1e2535] border border-[#2b3240] hover:border-emerald-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-2 text-white font-semibold text-xs group-hover:text-emerald-400">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>How to Use</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">Step-by-step guide and settings</p>
          </button>

          {/* Stealth */}
          <button
            onClick={onOpenStealth}
            className="flex flex-col text-left p-3.5 rounded-lg bg-[#161c27] hover:bg-[#1e2535] border border-[#2b3240] hover:border-emerald-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-2 text-white font-semibold text-xs group-hover:text-emerald-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Stealth</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">View all stealth wallets</p>
          </button>
        </div>
      </div>

      {/* 2. Active projects table */}
      <div className="bg-[#10141d] border border-[#21262d] rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-[#21262d]">
          <h2 className="text-base font-semibold text-white tracking-tight">Active projects</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#141923] text-zinc-400 text-[11px] uppercase tracking-wider font-mono border-b border-[#21262d]">
                <th className="py-2.5 px-5">TOKEN</th>
                <th className="py-2.5 px-4">STATUS</th>
                <th className="py-2.5 px-4">PORTFOLIO</th>
                <th className="py-2.5 px-4">P/L</th>
                <th className="py-2.5 px-5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d]">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-zinc-500 font-mono text-xs">
                    <p>Belum ada active project yang dibuat.</p>
                    <button
                      onClick={onNewLaunch}
                      className="mt-2.5 inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#161c26] hover:bg-emerald-500 hover:text-black text-emerald-400 border border-[#2b3342] hover:border-emerald-500 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>+ Buat Project Pertama (New Launch)</span>
                    </button>
                  </td>
                </tr>
              ) : (
                projects.map((proj) => {
                  const isNegative = proj.pnlSol < 0;
                  const isPositive = proj.pnlSol > 0;

                  return (
                    <tr
                      key={proj.id}
                      className="hover:bg-[#161c26] transition-colors group cursor-pointer"
                      onClick={() => onOpenProject(proj.id)}
                    >
                    <td className="py-3 px-5">
                      <div className="font-semibold text-white text-xs">{proj.name}</div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                        {proj.shortMint}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {proj.status === '—' ? (
                        <span className="text-zinc-500 font-mono">—</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
                          {proj.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">
                      {proj.status === '—' && proj.portfolioSol === 0 && proj.walletCount === 0 ? (
                        <span className="text-zinc-500">—</span>
                      ) : (
                        `${proj.portfolioSol.toFixed(4)} SOL`
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">
                      {proj.status === '—' && proj.pnlSol === 0 && proj.walletCount === 0 ? (
                        <span className="text-zinc-500">—</span>
                      ) : (
                        <span
                          className={
                            isNegative
                              ? 'text-red-400'
                              : isPositive
                              ? 'text-emerald-400'
                              : 'text-zinc-400'
                          }
                        >
                          {proj.pnlSol > 0 ? '+' : ''}
                          {proj.pnlSol.toFixed(4)} SOL
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onOpenProject(proj.id)}
                          className="px-3 py-1 rounded text-xs font-medium bg-[#1c2230] hover:bg-emerald-600 hover:text-white text-zinc-300 border border-[#2f3747] hover:border-emerald-500 transition-colors cursor-pointer"
                        >
                          Open
                        </button>
                        {onDeleteProject && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus project ${proj.name} (${proj.shortMint})? Stealth wallet terkait akan dilepas kembali ke catalog.`)) {
                                onDeleteProject(proj.id);
                              }
                            }}
                            className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-800/60 transition-colors cursor-pointer"
                            title="Hapus project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Bottom Drawer: STEALTH WALLETS */}
      <div
        className={`bg-[#10141d] border border-[#21262d] rounded-xl transition-all shadow-sm ${
          drawerFullScreen ? 'fixed inset-4 z-50 overflow-hidden flex flex-col' : ''
        }`}
      >
        {/* Drawer Header */}
        <div className="px-5 py-3.5 border-b border-[#21262d] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-400 text-xs">◎</span>
            <span className="text-xs font-semibold text-white font-mono uppercase tracking-wider">
              STEALTH WALLETS — {wallets.length} • 0.0000 SOL
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setDrawerFullScreen(!drawerFullScreen)}
              className="text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-[#1a202c] transition-colors flex items-center gap-1 font-mono text-[11px]"
            >
              {drawerFullScreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Exit full screen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full screen</span>
                </>
              )}
            </button>

            <button
              onClick={() => setDrawerCollapsed(!drawerCollapsed)}
              className="text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-[#1a202c] transition-colors flex items-center gap-1 font-mono text-[11px]"
            >
              {drawerCollapsed ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Expand</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Drawer Controls & Table (visible when not collapsed) */}
        {!drawerCollapsed && (
          <div className="p-4 space-y-3 flex-1 flex flex-col overflow-hidden">
            {/* Search and Sweep Destination Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search address, label, project..."
                    className="w-full pl-9 pr-3 py-1.5 bg-[#161c26] border border-[#2b3342] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Filter Dropdown */}
                <div className="flex items-center gap-1.5 bg-[#161c26] border border-[#2b3342] rounded-lg px-2.5 py-1 text-xs">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-transparent text-zinc-300 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="All" className="bg-[#161c26]">
                      All ({wallets.length} wallets • 0.0000 SOL • {holdingCount} holding • {availableCount} available)
                    </option>
                    <option value="Available" className="bg-[#161c26]">
                      Available only ({availableCount})
                    </option>
                    <option value="Assigned" className="bg-[#161c26]">
                      Assigned only ({wallets.length - availableCount})
                    </option>
                  </select>
                </div>
              </div>

              {/* Sweep destination quick input */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">Sweep destination</span>
                <input
                  type="text"
                  value={sweepDestination}
                  onChange={(e) => setSweepDestination(e.target.value)}
                  placeholder="Destination wallet pubkey..."
                  className="w-56 px-3 py-1.5 bg-[#161c26] border border-[#2b3342] rounded-lg text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Wallets Table */}
            <div className="border border-[#21262d] rounded-lg overflow-x-auto overflow-y-auto max-h-[360px] flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#141923] text-zinc-400 text-[11px] uppercase tracking-wider font-mono sticky top-0 z-10 border-b border-[#21262d]">
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
                      <td colSpan={8} className="py-8 text-center text-zinc-500">
                        <p className="text-zinc-400 font-medium">Semua wallet sudah dihapus (0 stealth wallets)</p>
                        <p className="text-[11px] text-zinc-600 mt-0.5">Buka Wallet Catalog untuk membuat batch wallet baru jika diperlukan.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredWallets.map((w) => (
                      <tr key={w.id} className="hover:bg-[#161c26] transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-white">{w.label}</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-medium">
                        {w.assignedProjectName || '—'}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-zinc-300">{formatAddress(w.pubkey, 4, 4)}</span>
                          <button
                            onClick={() => handleCopy(w.pubkey, w.id)}
                            className="text-zinc-500 hover:text-white p-0.5 rounded"
                            title="Copy public key"
                          >
                            {copiedId === w.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-zinc-300">{w.balanceSol.toFixed(6)}</td>
                      <td className="py-2.5 px-4 text-zinc-400">{(w.tokenBalance || 0).toFixed(2)}</td>
                      <td className="py-2.5 px-4 text-zinc-400">{(w.tokenValueSol || 0).toFixed(4)}</td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            w.status === 'Available'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}
                        >
                          {w.status === 'Available' ? 'AVAILABLE' : 'EMPTY'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onSweepWallet(w.id, sweepDestination)}
                            className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-[#1c2230] hover:bg-[#252e42] text-zinc-300 hover:text-white border border-[#2f3747] transition-colors cursor-pointer"
                          >
                            Sweep
                          </button>
                          {onDeleteWallet && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Hapus stealth wallet ${w.label} (${w.pubkey.slice(0, 4)}...${w.pubkey.slice(-4)})?`)) {
                                  onDeleteWallet(w.id);
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
        )}
      </div>
    </div>
  );
}
