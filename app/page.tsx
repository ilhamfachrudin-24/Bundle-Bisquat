'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import OverviewView from '@/components/OverviewView';
import WalletCatalogView from '@/components/WalletCatalogView';
import ProjectDetailView from '@/components/ProjectDetailView';
import StealthWalletsView from '@/components/StealthWalletsView';
import VolumeBotView from '@/components/VolumeBotView';
import NewLaunchView from '@/components/NewLaunchView';
import HowToUseView from '@/components/HowToUseView';
import ArchivedView from '@/components/ArchivedView';
import PhantomConnectModal from '@/components/PhantomConnectModal';
import {
  INITIAL_PROJECTS,
  INITIAL_CATALOG_WALLETS,
  INITIAL_ARCHIVED_PROJECTS
} from '@/lib/mock-data';
import { Project, CatalogWallet, SolBundlerState } from '@/types/solbundler';
import {
  fetchLiveSolBalance,
  generateRealSolanaKeypairs,
  fetchLiveBalancesForWallets
} from '@/services/solana';

export default function SolBundlerApp() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [catalogWallets, setCatalogWallets] = useState<CatalogWallet[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('solbundler_catalog_wallets');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_CATALOG_WALLETS;
  });
  const [isSyncingBalances, setIsSyncingBalances] = useState(false);
  const [archivedProjects, setArchivedProjects] = useState<Project[]>(INITIAL_ARCHIVED_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<SolBundlerState['activeView']>('overview');
  const [connectedAddress, setConnectedAddress] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('solbundler_connected_wallet');
      } catch {
        return null;
      }
    }
    return null;
  });
  const [walletBalanceSol, setWalletBalanceSol] = useState<number | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // Fetch live on-chain balance whenever connectedAddress changes
  useEffect(() => {
    if (!connectedAddress) return;
    let isCancelled = false;
    fetchLiveSolBalance(connectedAddress).then((bal) => {
      if (!isCancelled && bal !== null) {
        setWalletBalanceSol(bal);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [connectedAddress]);

  // Global real-time listener for Phantom / browser Solana extensions
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).solana) {
      const provider = (window as any).solana;

      const handleAccountChange = (publicKey: any) => {
        if (publicKey) {
          const addr = publicKey.toString();
          setConnectedAddress(addr);
          try {
            localStorage.setItem('solbundler_connected_wallet', addr);
          } catch {}
        } else {
          setConnectedAddress(null);
          try {
            localStorage.removeItem('solbundler_connected_wallet');
          } catch {}
        }
      };

      const handleDisconnect = () => {
        setConnectedAddress(null);
        try {
          localStorage.removeItem('solbundler_connected_wallet');
        } catch {}
      };

      provider.on?.('accountChanged', handleAccountChange);
      provider.on?.('disconnect', handleDisconnect);

      return () => {
        provider.removeListener?.('accountChanged', handleAccountChange);
        provider.removeListener?.('disconnect', handleDisconnect);
      };
    }
  }, []);

  const handleConnectWallet = (address: string) => {
    setConnectedAddress(address);
    try {
      localStorage.setItem('solbundler_connected_wallet', address);
    } catch {}
    fetchLiveSolBalance(address).then((bal) => {
      if (bal !== null) setWalletBalanceSol(bal);
    });
  };

  const handleDisconnectWallet = () => {
    setConnectedAddress(null);
    setWalletBalanceSol(null);
    try {
      localStorage.removeItem('solbundler_connected_wallet');
    } catch {}
  };

  // Selected project memo
  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  // Calculations
  const availableWalletsCount = useMemo(() => {
    return catalogWallets.filter((w) => w.status === 'Available').length;
  }, [catalogWallets]);

  const totalStealthCount = catalogWallets.length;

  const liquidSol = useMemo(() => {
    return catalogWallets.reduce((acc, w) => acc + w.balanceSol, 0);
  }, [catalogWallets]);

  // Actions
  const handleRefresh = () => {
    const timeStr = new Date().toLocaleTimeString();
    setProjects((prev) =>
      prev.map((p) => ({
        ...p,
        logs: [{ timestamp: timeStr, message: 'Portfolio updated.', type: 'info' }, ...p.logs]
      }))
    );
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleGenerateWallets = async (count: number, totalSol: number) => {
    const keypairs = await generateRealSolanaKeypairs(count);
    const solEach = Number((totalSol / count).toFixed(4));
    const batchId = `batch_${Math.random().toString(36).substring(2, 10)}`;
    const newWallets: CatalogWallet[] = keypairs.map((kp, i) => {
      const num = (catalogWallets.length + 1 + i).toString().padStart(4, '0');
      return {
        id: `w-${catalogWallets.length + 1 + i}-${Date.now()}`,
        label: `cat_${num}`,
        pubkey: kp.publicKey,
        privateKeyBase58: kp.privateKeyBase58,
        privateKeyJson: kp.privateKeyJson,
        batchId,
        initialSol: solEach,
        balanceSol: 0, // Starts at 0 SOL on-chain until funded
        status: 'Available',
        createdAt: new Date().toLocaleString(),
        isOnChainFunded: false
      };
    });

    setCatalogWallets((prev) => {
      const updated = [...prev, ...newWallets];
      try {
        localStorage.setItem('solbundler_catalog_wallets', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleSyncOnChainBalances = async () => {
    if (catalogWallets.length === 0) return;
    setIsSyncingBalances(true);
    try {
      const pubkeys = catalogWallets.map((w) => w.pubkey);
      const balances = await fetchLiveBalancesForWallets(pubkeys);
      setCatalogWallets((prev) => {
        const updated = prev.map((w) => {
          if (balances[w.pubkey] !== undefined) {
            const liveBal = balances[w.pubkey];
            return {
              ...w,
              balanceSol: liveBal,
              isOnChainFunded: liveBal > 0,
              lastSyncedAt: new Date().toLocaleTimeString()
            };
          }
          return w;
        });
        try {
          localStorage.setItem('solbundler_catalog_wallets', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    } finally {
      setIsSyncingBalances(false);
    }
  };

  const handleSweepWallet = (walletId: string, destination: string) => {
    setCatalogWallets((prev) => {
      const updated = prev.map((w) => {
        if (w.id === walletId) {
          return {
            ...w,
            balanceSol: 0,
            tokenBalance: 0,
            tokenValueSol: 0,
            status: 'EMPTY' as const
          };
        }
        return w;
      });
      try {
        localStorage.setItem('solbundler_catalog_wallets', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleBulkSweep = (destination: string) => {
    setCatalogWallets((prev) => {
      const updated = prev.map((w) => ({
        ...w,
        balanceSol: 0,
        tokenBalance: 0,
        tokenValueSol: 0,
        status: 'EMPTY' as const
      }));
      try {
        localStorage.setItem('solbundler_catalog_wallets', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleDeleteWallet = (walletId: string) => {
    const targetWallet = catalogWallets.find((w) => w.id === walletId);
    if (!targetWallet) return;

    // 1. Remove from catalogWallets and sync localStorage
    setCatalogWallets((prev) => {
      const updated = prev.filter((w) => w.id !== walletId);
      try {
        localStorage.setItem('solbundler_catalog_wallets', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. Synchronize with active projects if this wallet was assigned
    setProjects((prev) =>
      prev.map((proj) => {
        const hasWallet = proj.wallets.some(
          (w) =>
            w.address.toLowerCase() === targetWallet.pubkey.toLowerCase() ||
            w.walletLabel === targetWallet.label
        );
        if (!hasWallet) return proj;

        const updatedWallets = proj.wallets.filter(
          (w) =>
            w.address.toLowerCase() !== targetWallet.pubkey.toLowerCase() &&
            w.walletLabel !== targetWallet.label
        );

        return {
          ...proj,
          walletCount: updatedWallets.length,
          wallets: updatedWallets,
          logs: [
            {
              timestamp: new Date().toLocaleTimeString(),
              message: `Stealth wallet ${targetWallet.label} removed from catalog and synchronized.`,
              type: 'warn'
            },
            ...proj.logs
          ]
        };
      })
    );
  };

  const handleDeleteAllWallets = () => {
    setCatalogWallets([]);
    try {
      localStorage.removeItem('solbundler_catalog_wallets');
    } catch {}
    // Synchronize: Clear stealth wallets from active projects
    setProjects((prev) =>
      prev.map((proj) => {
        const remainingWallets = proj.wallets.filter((w) => w.isDevWallet);
        return {
          ...proj,
          walletCount: remainingWallets.length,
          wallets: remainingWallets,
          logs: [
            {
              timestamp: new Date().toLocaleTimeString(),
              message: 'All stealth wallets removed from pool and unassigned.',
              type: 'warn'
            },
            ...proj.logs
          ]
        };
      })
    );
  };

  const handleDeleteProject = (projectId: string) => {
    const projectToDelete =
      projects.find((p) => p.id === projectId) ||
      archivedProjects.find((p) => p.id === projectId);
    if (!projectToDelete) return;

    // 1. Remove from active projects & archived
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setArchivedProjects((prev) => prev.filter((p) => p.id !== projectId));

    // 2. Synchronize catalog wallets: unassign any wallet linked to this project
    setCatalogWallets((prev) =>
      prev.map((w) => {
        if (
          w.assignedProjectId === projectId ||
          w.assignedProjectName === projectToDelete.name
        ) {
          return {
            ...w,
            status: 'Available',
            assignedProjectId: undefined,
            assignedProjectName: undefined
          };
        }
        return w;
      })
    );

    // 3. Update selectedProjectId
    if (selectedProjectId === projectId) {
      const remaining = projects.filter((p) => p.id !== projectId);
      setSelectedProjectId(remaining[0]?.id || null);
      if (activeView === 'project-detail' && remaining.length === 0) {
        setActiveView('overview');
      }
    }
  };

  const handleCreateProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
    setActiveView('project-detail');
  };

  const handleArchiveProject = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;

    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setArchivedProjects((prev) => [{ ...proj, status: 'archived', archived: true }, ...prev]);
    if (selectedProjectId === projectId) {
      setSelectedProjectId(projects[0]?.id || null);
    }
    setActiveView('archived');
  };

  const handleUnarchiveProject = (projectId: string) => {
    const proj = archivedProjects.find((p) => p.id === projectId);
    if (!proj) return;

    setArchivedProjects((prev) => prev.filter((p) => p.id !== projectId));
    setProjects((prev) => [{ ...proj, status: '—', archived: false }, ...prev]);
    setSelectedProjectId(proj.id);
    setActiveView('project-detail');
  };

  const handleDevSell = async (projectId: string) => {
    // 1-second simulated dev sell
    await new Promise((res) => setTimeout(res, 1200));
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            status: 'mass sell confirmed',
            statusLabel: 'MassSellConfirmed • Dev Sold',
            tokenBalance: 0,
            tokenValueSol: 0,
            wallets: p.wallets.map((w) =>
              w.isDevWallet
                ? { ...w, tokenBalance: 0, currentValueSol: 0, solBalance: 0.54 }
                : w
            ),
            logs: [
              {
                timestamp: new Date().toLocaleTimeString(),
                message: 'Developer sell order confirmed on Solana Mainnet AMM.',
                type: 'success'
              },
              ...p.logs
            ]
          };
        }
        return p;
      })
    );
  };

  const handleStealthMassSell = async (projectId: string) => {
    await new Promise((res) => setTimeout(res, 1800));
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            status: 'mass sell confirmed',
            statusLabel: 'MassSellConfirmed • 2 wallets',
            portfolioSol: 0,
            pnlSol: -p.investedSol,
            pnlPercent: -100,
            wallets: p.wallets.map((w) => ({
              ...w,
              tokenBalance: 0,
              currentValueSol: 0
            })),
            logs: [
              {
                timestamp: new Date().toLocaleTimeString(),
                message: 'Stealth mass sell executed via Jito RPC bundle.',
                type: 'success'
              },
              ...p.logs
            ]
          };
        }
        return p;
      })
    );
  };

  const handleSellAllAndSweep = async (projectId: string, destinationPubkey: string) => {
    await new Promise((res) => setTimeout(res, 2200));
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            status: 'mass sell confirmed',
            statusLabel: 'MassSellConfirmed • 2 wallets',
            portfolioSol: 0,
            liquidSol: 0,
            pnlSol: -p.investedSol,
            pnlPercent: -100,
            wallets: p.wallets.map((w) => ({
              ...w,
              solBalance: 0,
              tokenBalance: 0,
              currentValueSol: 0
            })),
            logs: [
              {
                timestamp: new Date().toLocaleTimeString(),
                message: `Full sell & sweep complete. Funds transferred to ${destinationPubkey.slice(0, 4)}...${destinationPubkey.slice(-4)}`,
                type: 'success'
              },
              ...p.logs
            ]
          };
        }
        return p;
      })
    );
  };

  const handleSweepStealthSol = async (projectId: string, destinationPubkey: string) => {
    await new Promise((res) => setTimeout(res, 1500));
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            liquidSol: 0,
            wallets: p.wallets.map((w) =>
              !w.isDevWallet ? { ...w, solBalance: 0 } : w
            ),
            logs: [
              {
                timestamp: new Date().toLocaleTimeString(),
                message: `Swept stealth SOL to ${destinationPubkey.slice(0, 4)}...${destinationPubkey.slice(-4)}`,
                type: 'success'
              },
              ...p.logs
            ]
          };
        }
        return p;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#090d14] text-zinc-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <Header
        selectedProject={selectedProject}
        totalStealthCount={totalStealthCount}
        liquidSol={liquidSol}
        onOpenStealth={() => setActiveView('stealth-wallets')}
        onConnectWallet={() => setIsConnectModalOpen(true)}
        connectedWalletAddress={connectedAddress}
        walletBalanceSol={walletBalanceSol}
      />

      {/* Main Workspace: Sidebar + View Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeView={activeView}
          onSelectView={setActiveView}
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={handleSelectProject}
          availableWalletsCount={availableWalletsCount}
          totalStealthCount={totalStealthCount}
          archivedCount={archivedProjects.length}
          onRefresh={handleRefresh}
          onOpenConnectModal={() => setIsConnectModalOpen(true)}
          connectedAddress={connectedAddress}
          onDeleteProject={handleDeleteProject}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#090d14]">
          {activeView === 'overview' && (
            <OverviewView
              projects={projects}
              wallets={catalogWallets}
              onOpenProject={(id) => {
                handleSelectProject(id);
                setActiveView('project-detail');
              }}
              onNewLaunch={() => setActiveView('new-launch')}
              onOpenHowToUse={() => setActiveView('how-to-use')}
              onOpenStealth={() => setActiveView('stealth-wallets')}
              onRefresh={handleRefresh}
              onSweepWallet={handleSweepWallet}
              onDeleteWallet={handleDeleteWallet}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {activeView === 'wallet-catalog' && (
            <WalletCatalogView
              wallets={catalogWallets}
              onGenerateWallets={handleGenerateWallets}
              onRefresh={handleRefresh}
              onDeleteWallet={handleDeleteWallet}
              onDeleteAllWallets={handleDeleteAllWallets}
              onSyncBalances={handleSyncOnChainBalances}
              isSyncingBalances={isSyncingBalances}
            />
          )}

          {activeView === 'project-detail' && (
            selectedProject ? (
              <ProjectDetailView
                project={selectedProject}
                onRefresh={handleRefresh}
                onArchive={handleArchiveProject}
                onDeleteProject={handleDeleteProject}
                onDevSell={handleDevSell}
                onStealthMassSell={handleStealthMassSell}
                onSellAllAndSweep={handleSellAllAndSweep}
                onSweepStealthSol={handleSweepStealthSol}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#090d14] text-zinc-500 font-mono text-xs">
                <div className="w-10 h-10 rounded-full bg-[#161c26] border border-[#262f3f] flex items-center justify-center text-zinc-400 mb-3 text-base">
                  🚀
                </div>
                <p className="text-zinc-200 font-bold text-sm">Belum Ada Project Aktif</p>
                <p className="text-[11px] text-zinc-400 mt-1 max-w-sm">
                  Anda belum pernah membuat project token launch. Gunakan New Launch untuk memulai bundle peluncuran pertama Anda.
                </p>
                <button
                  onClick={() => setActiveView('new-launch')}
                  className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  + Buat Project Pertama
                </button>
              </div>
            )
          )}

          {activeView === 'stealth-wallets' && (
            <StealthWalletsView
              wallets={catalogWallets}
              onRefresh={handleRefresh}
              onSweepWallet={handleSweepWallet}
              onBulkSweep={handleBulkSweep}
              onDeleteWallet={handleDeleteWallet}
              onDeleteAllWallets={handleDeleteAllWallets}
              onSyncBalances={handleSyncOnChainBalances}
              isSyncingBalances={isSyncingBalances}
            />
          )}

          {activeView === 'volume-bot' && (
            <VolumeBotView
              wallets={catalogWallets}
              onRefresh={handleRefresh}
            />
          )}

          {activeView === 'new-launch' && (
            <NewLaunchView
              availableWallets={catalogWallets.filter((w) => w.status === 'Available')}
              onCreateProject={handleCreateProject}
              onCancel={() => setActiveView('overview')}
              connectedAddress={connectedAddress}
            />
          )}

          {activeView === 'how-to-use' && (
            <HowToUseView
              onNavigateToLaunch={() => setActiveView('new-launch')}
              onNavigateToCatalog={() => setActiveView('wallet-catalog')}
            />
          )}

          {activeView === 'archived' && (
            <ArchivedView
              archivedProjects={archivedProjects}
              onUnarchive={handleUnarchiveProject}
              onRefresh={handleRefresh}
              onDeleteProject={handleDeleteProject}
            />
          )}
        </main>
      </div>

      {/* Phantom / Solana Wallet Connector Modal */}
      <PhantomConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        connectedAddress={connectedAddress}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
        walletBalanceSol={walletBalanceSol}
        onRefreshBalance={() => {
          if (connectedAddress) {
            fetchLiveSolBalance(connectedAddress).then((bal) => {
              if (bal !== null) setWalletBalanceSol(bal);
            });
          }
        }}
      />
    </div>
  );
}
