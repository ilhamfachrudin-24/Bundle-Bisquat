'use client';

import React from 'react';
import { Project, SolBundlerState } from '@/types/solbundler';
import {
  Layers,
  HelpCircle,
  PlusCircle,
  LayoutDashboard,
  Wallet,
  Shield,
  Archive,
  Zap,
  RotateCw,
  Wallet2,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { formatAddress } from '@/services/solana';

interface SidebarProps {
  activeView: SolBundlerState['activeView'];
  onSelectView: (view: SolBundlerState['activeView']) => void;
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  availableWalletsCount: number;
  totalStealthCount: number;
  archivedCount: number;
  onRefresh: () => void;
  onOpenConnectModal: () => void;
  connectedAddress: string | null;
  onDeleteProject?: (projectId: string) => void;
}

export default function Sidebar({
  activeView,
  onSelectView,
  projects,
  selectedProjectId,
  onSelectProject,
  availableWalletsCount,
  totalStealthCount,
  archivedCount,
  onRefresh,
  onOpenConnectModal,
  connectedAddress,
  onDeleteProject
}: SidebarProps) {
  const navItems = [
    {
      id: 'overview' as const,
      label: 'Overview',
      icon: Layers,
      showActiveDot: true
    },
    {
      id: 'how-to-use' as const,
      label: 'How to Use',
      icon: HelpCircle
    },
    {
      id: 'new-launch' as const,
      label: 'New Launch',
      icon: PlusCircle,
      prefix: '+'
    },
    {
      id: 'project-detail' as const,
      label: 'Project Detail',
      icon: LayoutDashboard
    },
    {
      id: 'wallet-catalog' as const,
      label: 'Wallet Catalog',
      icon: Wallet,
      badge: availableWalletsCount
    },
    {
      id: 'stealth-wallets' as const,
      label: 'Stealth Wallets',
      icon: Shield,
      badge: totalStealthCount
    },
    {
      id: 'archived' as const,
      label: 'Archived',
      icon: Archive,
      badge: archivedCount
    },
    {
      id: 'volume-bot' as const,
      label: 'Volume Bot',
      icon: Zap,
      badge: '—'
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0d1117] border-r border-[#21262d] flex flex-col h-[calc(100vh-53px)] select-none">
      {/* Navigation menu */}
      <div className="p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#1b2f28] text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-[#161b22]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                {item.showActiveDot && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-emerald-400 ring-2 ring-emerald-500/20' : 'bg-zinc-600'
                    }`}
                  />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <span>
                  {item.prefix ? `${item.prefix} ` : ''}
                  {item.label}
                </span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[11px] font-mono ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-[#21262d] text-zinc-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Connect Phantom Button */}
      <div className="px-3 py-2">
        <button
          onClick={onOpenConnectModal}
          className={`w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
            connectedAddress
              ? 'bg-[#161b22] border-emerald-500/40 text-emerald-400 hover:bg-[#1f242c]'
              : 'bg-[#1b1f27] hover:bg-[#252a35] border-[#30363d] text-purple-300 hover:text-purple-200 shadow-sm'
          }`}
        >
          {connectedAddress ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono">{formatAddress(connectedAddress, 4, 4)}</span>
            </>
          ) : (
            <>
              {/* Phantom Ghost Icon */}
              <div className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-[10px]">
                👻
              </div>
              <span>Connect Phantom</span>
            </>
          )}
        </button>
      </div>

      {/* Active Projects Header */}
      <div className="px-3 pt-3 pb-1 flex items-center justify-between border-t border-[#21262d]">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
          Active Projects
        </span>
        <button
          onClick={onRefresh}
          title="Refresh projects"
          className="p-1 rounded text-zinc-500 hover:text-emerald-400 hover:bg-[#161b22] transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Active Projects Scrollable List */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-700">
        {projects.length === 0 ? (
          <div className="p-3 text-center text-zinc-500 font-mono text-[11px] bg-[#161c22]/40 rounded-lg border border-dashed border-[#21262d] my-1">
            Belum ada active project.
            <div className="mt-1 text-[10px] text-zinc-600">Klik &quot;+ New Launch&quot; untuk memulai.</div>
          </div>
        ) : (
          projects.map((project) => {
          const isSelected = selectedProjectId === project.id;
          const isNegative = project.pnlSol < 0;
          const isPositive = project.pnlSol > 0;

          return (
            <div
              key={project.id}
              onClick={() => {
                onSelectProject(project.id);
                onSelectView('project-detail');
              }}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#141e1b] border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.1)]'
                  : 'bg-[#161b22]/70 border-[#21262d] hover:bg-[#1c212a] hover:border-[#30363d]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-xs tracking-tight truncate">
                  {project.name}
                </span>
                <div className="flex items-center space-x-1.5">
                  {onDeleteProject && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Hapus project ${project.name}? Stealth wallet terkait akan dilepas kembali ke catalog.`)) {
                          onDeleteProject(project.id);
                        }
                      }}
                      className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                      title="Hapus project"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  )}
                </div>
              </div>

              <div className="text-[10px] text-zinc-400 font-mono truncate mt-0.5">
                {project.shortMint} • {project.status} • {project.walletCount} wallets
              </div>

              <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
                {project.status === '—' && project.investedSol === 0 && project.walletCount === 0 ? (
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
                    {project.pnlSol > 0 ? '+' : ''}
                    {project.pnlSol.toFixed(4)} SOL{' '}
                    <span className="text-[10px] opacity-80">
                      ({project.pnlPercent > 0 ? '+' : ''}
                      {project.pnlPercent.toFixed(2)}%)
                    </span>
                  </span>
                )}
              </div>
            </div>
          );
        }))}
      </div>
    </aside>
  );
}
