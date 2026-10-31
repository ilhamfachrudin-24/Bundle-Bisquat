'use client';

import React, { useState } from 'react';
import { Project } from '@/types/solbundler';
import { formatAddress, isValidSolanaAddress } from '@/services/solana';
import {
  RotateCw,
  ExternalLink,
  Archive,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Terminal,
  Zap,
  Trash2,
  X
} from 'lucide-react';

interface ProjectDetailViewProps {
  project: Project;
  onRefresh: () => void;
  onArchive: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onDevSell: (projectId: string) => Promise<void>;
  onStealthMassSell: (projectId: string) => Promise<void>;
  onSellAllAndSweep: (projectId: string, destinationPubkey: string) => Promise<void>;
  onSweepStealthSol: (projectId: string, destinationPubkey: string) => Promise<void>;
}

export default function ProjectDetailView({
  project,
  onRefresh,
  onArchive,
  onDeleteProject,
  onDevSell,
  onStealthMassSell,
  onSellAllAndSweep,
  onSweepStealthSol
}: ProjectDetailViewProps) {
  const [sweepDestination, setSweepDestination] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const pnlIsNegative = project.pnlSol < 0;
  const pnlIsPositive = project.pnlSol > 0;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const executeAction = async (actionName: string, actionFn: () => Promise<void>) => {
    setActionLoading(actionName);
    setNotification(null);
    try {
      await actionFn();
      setNotification({
        type: 'success',
        text: `Action '${actionName}' successfully completed on Solana Mainnet.`
      });
    } catch (err: any) {
      setNotification({
        type: 'error',
        text: err?.message || `Failed to execute ${actionName}.`
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSweepOnly = () => {
    if (!sweepDestination) {
      setNotification({
        type: 'error',
        text: 'Please provide a valid destination Solana public key.'
      });
      return;
    }
    if (!isValidSolanaAddress(sweepDestination)) {
      setNotification({
        type: 'error',
        text: 'The destination address is not a valid Solana public key on the ed25519 curve.'
      });
      return;
    }

    executeAction('Sweep Stealth SOL', () =>
      onSweepStealthSol(project.id, sweepDestination)
    );
  };

  const handleSellAllSweep = () => {
    if (!sweepDestination) {
      setNotification({
        type: 'error',
        text: 'Please provide a valid destination Solana public key for sweeping.'
      });
      return;
    }
    if (!isValidSolanaAddress(sweepDestination)) {
      setNotification({
        type: 'error',
        text: 'Invalid Solana address format for sweep destination.'
      });
      return;
    }

    executeAction('Sell All + Sweep', () =>
      onSellAllAndSweep(project.id, sweepDestination)
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#090d14] text-zinc-100 p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#21262d]">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-white tracking-tight">{project.name}</h1>
            <span className="text-xs font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/60">
              {project.statusLabel || project.status}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 mt-1">
            <span>Mint:</span>
            <span className="text-zinc-200">{project.fullMint}</span>
            <button
              onClick={() => handleCopy(project.fullMint, 'mint')}
              className="text-zinc-500 hover:text-white p-0.5 rounded"
            >
              {copiedId === 'mint' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <span className="text-emerald-400 text-[11px]">• on chain ✓</span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            className="px-3 py-1.5 bg-[#161c26] hover:bg-[#202735] text-zinc-300 text-xs rounded-lg border border-[#2b3342] flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          {project.pumpFunUrl && (
            <a
              href={project.pumpFunUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#161c26] hover:bg-[#202735] text-emerald-400 text-xs rounded-lg border border-[#2b3342] flex items-center space-x-1.5 transition-colors"
            >
              <span>pump.fun</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <button
            onClick={() => onArchive(project.id)}
            className="px-3 py-1.5 bg-[#161c26] hover:bg-amber-950/40 text-amber-300 hover:text-amber-200 text-xs rounded-lg border border-[#2b3342] hover:border-amber-700/60 flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Archive</span>
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-3 py-1.5 bg-[#161c26] hover:bg-red-950/50 text-red-400 hover:text-red-300 text-xs rounded-lg border border-[#2b3342] hover:border-red-800/60 flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Hapus project secara permanen"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Project</span>
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-3 rounded-lg border text-xs font-mono flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
              : 'bg-red-950/40 border-red-800 text-red-400'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-400 font-mono">Invested</div>
          <div className="text-lg font-bold text-white font-mono mt-0.5">
            {project.investedSol.toFixed(4)} SOL
          </div>
        </div>

        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-400 font-mono">Portfolio</div>
          <div className="text-lg font-bold text-white font-mono mt-0.5">
            {project.portfolioSol.toFixed(4)} SOL
          </div>
        </div>

        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-400 font-mono">P&L</div>
          <div
            className={`text-lg font-bold font-mono mt-0.5 ${
              pnlIsNegative
                ? 'text-red-400'
                : pnlIsPositive
                ? 'text-emerald-400'
                : 'text-zinc-400'
            }`}
          >
            {project.pnlSol > 0 ? '+' : ''}
            {project.pnlSol.toFixed(4)} SOL
            <span className="text-xs opacity-75 ml-1">
              ({project.pnlPercent > 0 ? '+' : ''}
              {project.pnlPercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-400 font-mono">Liquid SOL</div>
          <div className="text-lg font-bold text-white font-mono mt-0.5">
            {project.liquidSol.toFixed(6)} SOL
          </div>
        </div>

        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-400 font-mono">Token</div>
          <div className="text-lg font-bold text-white font-mono mt-0.5">
            {project.tokenBalance.toFixed(2)}
          </div>
        </div>

        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-400 font-mono">Token value</div>
          <div className="text-lg font-bold text-white font-mono mt-0.5">
            {project.tokenValueSol.toFixed(4)} SOL
          </div>
        </div>
      </div>

      {/* Wallet Distribution */}
      <div className="bg-[#10141d] border border-[#21262d] rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-[#21262d]">
          <h2 className="text-sm font-semibold text-white tracking-tight">Wallet Distribution</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#141923] text-zinc-400 text-[11px] uppercase tracking-wider font-mono border-b border-[#21262d]">
                <th className="py-2.5 px-5">WALLET</th>
                <th className="py-2.5 px-4">ADDRESS</th>
                <th className="py-2.5 px-4">SOL</th>
                <th className="py-2.5 px-4">TOKEN</th>
                <th className="py-2.5 px-4">COST</th>
                <th className="py-2.5 px-5">VALUE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d] font-mono">
              {project.wallets.map((w, idx) => (
                <tr key={idx} className="hover:bg-[#161c26] transition-colors">
                  <td className="py-3 px-5 font-semibold text-white">{w.walletLabel}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-zinc-300">{formatAddress(w.address, 4, 4)}</span>
                      <button
                        onClick={() => handleCopy(w.address, `w-${idx}`)}
                        className="text-zinc-500 hover:text-white p-0.5 rounded"
                      >
                        {copiedId === `w-${idx}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-zinc-300">{w.solBalance.toFixed(6)}</td>
                  <td className="py-3 px-4 text-zinc-400">{w.tokenBalance.toFixed(2)}</td>
                  <td className="py-3 px-4 text-zinc-300">{w.costBasisSol.toFixed(4)}</td>
                  <td className="py-3 px-5 text-zinc-400">{w.currentValueSol.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight">Actions</h2>
        </div>

        {/* 3 Main Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => executeAction('Dev Sell (Phantom)', () => onDevSell(project.id))}
            disabled={actionLoading !== null}
            className="py-2.5 px-4 rounded-lg bg-[#161c26] hover:bg-[#202735] text-zinc-300 hover:text-white border border-[#2b3342] text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <span>{actionLoading === 'Dev Sell (Phantom)' ? 'Awaiting Signature...' : 'Dev Sell (Phantom)'}</span>
          </button>

          <button
            onClick={() => executeAction('Stealth Mass Sell (RPC)', () => onStealthMassSell(project.id))}
            disabled={actionLoading !== null}
            className="py-2.5 px-4 rounded-lg bg-[#161c26] hover:bg-[#202735] text-zinc-300 hover:text-white border border-[#2b3342] text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <span>{actionLoading === 'Stealth Mass Sell (RPC)' ? 'Broadcasting Jito Bundles...' : 'Stealth Mass Sell (RPC)'}</span>
          </button>

          <button
            onClick={handleSellAllSweep}
            disabled={actionLoading !== null}
            className="py-2.5 px-4 rounded-lg bg-[#144331] hover:bg-[#1a553e] text-emerald-300 hover:text-white border border-emerald-600/40 text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-sm"
          >
            <span>{actionLoading === 'Sell All + Sweep' ? 'Executing Full Exit & Sweep...' : 'Sell All + Sweep'}</span>
          </button>
        </div>

        {/* Sweep Destination Input & Button */}
        <div className="space-y-1.5 pt-2 border-t border-[#21262d]">
          <label className="text-[11px] font-mono text-zinc-400">SOL sweep destination</label>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={sweepDestination}
              onChange={(e) => setSweepDestination(e.target.value)}
              placeholder="Destination wallet pubkey..."
              className="flex-1 min-w-[280px] px-3.5 py-2 bg-[#161c26] border border-[#2b3342] rounded-lg text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSweepOnly}
              disabled={actionLoading !== null}
              className="px-4 py-2 bg-[#1c2230] hover:bg-[#252e42] text-zinc-300 hover:text-white border border-[#2f3747] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Sweep Stealth SOL
            </button>
          </div>
        </div>
      </div>

      {/* Project Log */}
      <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-white tracking-tight">Project Log</h2>
        </div>

        <div className="bg-[#090d14] border border-[#21262d] rounded-lg p-3 font-mono text-xs text-sky-400 space-y-1 max-h-48 overflow-y-auto scrollbar-thin">
          {project.logs.length === 0 ? (
            <div className="text-zinc-600">No events logged yet.</div>
          ) : (
            project.logs.map((log, i) => (
              <div key={i} className="flex items-start space-x-2">
                <span className="text-sky-500 flex-shrink-0">[{log.timestamp}]</span>
                <span className={log.type === 'success' ? 'text-emerald-400' : 'text-zinc-300'}>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal for Project Deletion */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#10141d] border border-red-800/60 rounded-xl p-5 shadow-2xl text-zinc-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
              <div className="flex items-center space-x-2 text-red-400">
                <Trash2 className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Hapus Project Permanen</h3>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-2.5 font-mono">
              <p className="text-zinc-300">
                Apakah Anda yakin ingin menghapus project <strong className="text-white">{project.name}</strong> ({project.shortMint})?
              </p>
              <div className="p-3 bg-[#161c26] border border-[#262f3f] rounded-lg text-zinc-300 text-[11px] space-y-1">
                <div className="text-emerald-400 font-bold">Sinkronisasi Otomatis:</div>
                <p>Seluruh stealth wallet yang saat ini ditugaskan ke project ini ({project.walletCount} wallet) akan otomatis dilepas dan berstatus <strong>Available</strong> kembali di Wallet Catalog.</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 rounded-lg bg-[#161c26] hover:bg-[#202735] text-zinc-300 text-xs border border-[#2b3342] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  onDeleteProject(project.id);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Project</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
