'use client';

import React from 'react';
import { Project } from '@/types/solbundler';
import {
  Archive,
  RotateCcw,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Coins,
  Trash2
} from 'lucide-react';
import { formatAddress } from '@/services/solana';

interface ArchivedViewProps {
  archivedProjects: Project[];
  onUnarchive: (projectId: string) => void;
  onRefresh: () => void;
  onDeleteProject?: (projectId: string) => void;
}

export default function ArchivedView({
  archivedProjects,
  onUnarchive,
  onRefresh,
  onDeleteProject
}: ArchivedViewProps) {
  const totalRealizedPnl = archivedProjects.reduce((acc, p) => acc + p.pnlSol, 0);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#090d14] text-zinc-100 p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
        <div>
          <div className="flex items-center space-x-2">
            <Archive className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Archived Projects</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Historical token launches, realized P&L performance, and post-launch sweep audits.
          </p>
        </div>

        <div className="bg-[#10141d] border border-[#21262d] px-3.5 py-1.5 rounded-lg text-xs font-mono">
          <span className="text-zinc-400">Total Realized P&L: </span>
          <span
            className={`font-bold ${
              totalRealizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {totalRealizedPnl >= 0 ? '+' : ''}
            {totalRealizedPnl.toFixed(4)} SOL
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#10141d] border border-[#21262d] rounded-xl overflow-hidden shadow-sm flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#141923] text-zinc-400 text-[11px] uppercase tracking-wider font-mono border-b border-[#21262d]">
                <th className="py-2.5 px-4">TOKEN</th>
                <th className="py-2.5 px-4">MINT</th>
                <th className="py-2.5 px-4">WALLETS</th>
                <th className="py-2.5 px-4">INVESTED</th>
                <th className="py-2.5 px-4">REALIZED P&L</th>
                <th className="py-2.5 px-4">DATE</th>
                <th className="py-2.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d] font-mono">
              {archivedProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-zinc-500 font-mono text-xs">
                    Belum ada project yang diarsipkan.
                  </td>
                </tr>
              ) : (
                archivedProjects.map((p) => {
                  const isPositive = p.pnlSol > 0;
                  const isNegative = p.pnlSol < 0;

                  return (
                    <tr key={p.id} className="hover:bg-[#161c26] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{p.name}</div>
                      {p.symbol && (
                        <div className="text-[10px] text-zinc-400">${p.symbol}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-zinc-300">
                      {formatAddress(p.fullMint, 4, 4)}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{p.walletCount}</td>
                    <td className="py-3 px-4 text-zinc-300">{p.investedSol.toFixed(4)} SOL</td>
                    <td className="py-3 px-4">
                      <span
                        className={
                          isPositive
                            ? 'text-emerald-400'
                            : isNegative
                            ? 'text-red-400'
                            : 'text-zinc-400'
                        }
                      >
                        {isPositive ? '+' : ''}
                        {p.pnlSol.toFixed(4)} SOL ({p.pnlPercent.toFixed(1)}%)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-500 text-[11px]">{p.createdAt}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onUnarchive(p.id)}
                          className="px-2.5 py-1 bg-[#161c26] hover:bg-[#202735] text-zinc-300 hover:text-white border border-[#2b3342] text-[11px] rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restore</span>
                        </button>
                        {onDeleteProject && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus permanen arsip project ${p.name}? Riwayat ini tidak dapat dikembalikan.`)) {
                                onDeleteProject(p.id);
                              }
                            }}
                            className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-800/60 transition-colors cursor-pointer"
                            title="Hapus arsip permanen"
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
    </div>
  );
}
