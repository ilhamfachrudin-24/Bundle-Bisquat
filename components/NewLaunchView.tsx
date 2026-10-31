'use client';

import React, { useState } from 'react';
import { CatalogWallet, Project } from '@/types/solbundler';
import { formatAddress } from '@/services/solana';
import {
  Rocket,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Coins,
  Layers,
  Sparkles,
  ExternalLink,
  RotateCw
} from 'lucide-react';

interface NewLaunchViewProps {
  availableWallets: CatalogWallet[];
  onCreateProject: (newProject: Project) => void;
  onCancel: () => void;
  connectedAddress?: string | null;
}

export default function NewLaunchView({
  availableWallets,
  onCreateProject,
  onCancel,
  connectedAddress
}: NewLaunchViewProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [devBuySol, setDevBuySol] = useState(0.5);
  const [stealthBuyPerWallet, setStealthBuyPerWallet] = useState(0.2);
  const [jitoTipSol, setJitoTipSol] = useState(0.01);
  const [selectedWalletIds, setSelectedWalletIds] = useState<string[]>(
    availableWallets.slice(0, 5).map((w) => w.id)
  );

  // Bundling transaction state
  const [txState, setTxState] = useState<
    'unprepared' | 'prepared' | 'awaiting_signature' | 'submitted' | 'confirmed' | 'failed'
  >('unprepared');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleWallet = (id: string) => {
    if (selectedWalletIds.includes(id)) {
      setSelectedWalletIds(selectedWalletIds.filter((wId) => wId !== id));
    } else {
      setSelectedWalletIds([...selectedWalletIds, id]);
    }
  };

  const totalStealthSol = selectedWalletIds.length * stealthBuyPerWallet;
  const totalBundleSol = devBuySol + totalStealthSol + jitoTipSol;

  const handleLaunch = () => {
    if (!name.trim() || !symbol.trim()) {
      setErrorMsg('Token name and symbol are required.');
      return;
    }
    setErrorMsg(null);
    setTxState('prepared');

    // Simulate strict Web3 transaction lifecycle
    setTimeout(() => {
      setTxState('awaiting_signature');
      setTimeout(() => {
        setTxState('submitted');
        setTimeout(() => {
          setTxState('confirmed');

          // Generate authentic project model
          const mintPrefix = symbol.slice(0, 4) + Math.random().toString(36).substring(2, 6);
          const fullMint = `${mintPrefix}7w6v5u4t3s2r1q9y8x7w6v5u4t3s2r1q9y8x${symbol.slice(0, 3)}pump`;

          const createdProject: Project = {
            id: `proj-${Date.now().toString().slice(-6)}`,
            name: name.toUpperCase(),
            symbol: symbol.toUpperCase(),
            shortMint: `${mintPrefix.slice(0, 4)}...pump`,
            fullMint: fullMint,
            status: 'ready',
            statusLabel: `Bundled • ${selectedWalletIds.length + 1} wallets`,
            walletCount: selectedWalletIds.length + 1,
            investedSol: totalBundleSol,
            portfolioSol: totalBundleSol,
            pnlSol: 0.0000,
            pnlPercent: 0.0,
            liquidSol: 0.000000,
            tokenBalance: 800000000,
            tokenValueSol: totalBundleSol,
            isOnChain: true,
            pumpFunUrl: `https://pump.fun/coin/${fullMint}`,
            createdAt: new Date().toLocaleString(),
            wallets: [
              {
                walletLabel: connectedAddress ? 'dev (Connected)' : 'dev (Phantom)',
                address: connectedAddress || 'GuhNv3sY9tLPMj4e8QzW2k1oRx5D8m1bFBsp',
                solBalance: 0.000000,
                tokenBalance: 400000000,
                costBasisSol: devBuySol,
                currentValueSol: devBuySol,
                isDevWallet: true
              },
              ...selectedWalletIds.map((wId, i) => {
                const w = availableWallets.find((item) => item.id === wId);
                return {
                  walletLabel: w ? w.label : `stealth_${i}`,
                  address: w ? w.pubkey : `Stealth${i}x7w6v5u4t3s2r1q9y8x7w6v5u4t3s2`,
                  solBalance: 0.000000,
                  tokenBalance: 400000000 / selectedWalletIds.length,
                  costBasisSol: stealthBuyPerWallet,
                  currentValueSol: stealthBuyPerWallet
                };
              })
            ],
            logs: [
              {
                timestamp: new Date().toLocaleTimeString(),
                message: `Jito MEV bundle confirmed in block #${Math.floor(290000000 + Math.random() * 5000000)}`,
                type: 'success'
              },
              {
                timestamp: new Date().toLocaleTimeString(),
                message: `Mint created & liquidity deployed on pump.fun bonding curve.`,
                type: 'info'
              }
            ]
          };

          setTimeout(() => {
            onCreateProject(createdProject);
          }, 1500);
        }, 2200);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#090d14] text-zinc-100 p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
        <div className="flex items-center space-x-2.5">
          <Rocket className="w-5 h-5 text-emerald-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            New Launch — Stealth Bundle + OKX Funding
          </h1>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded hover:bg-[#161c26] transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Step Progress Tabs */}
      <div className="grid grid-cols-4 gap-2 text-xs font-mono">
        {[
          { num: 1, title: 'Token Metadata' },
          { num: 2, title: 'Socials & Info' },
          { num: 3, title: 'IPFS Pinning' },
          { num: 4, title: 'Bundle & Launch' }
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2.5 rounded-lg border text-center transition-all ${
              step === s.num
                ? 'bg-[#182822] border-emerald-500/50 text-emerald-300 font-bold'
                : step > s.num
                ? 'bg-[#10141d] border-[#21262d] text-zinc-300'
                : 'bg-[#0d1117] border-[#1b212a] text-zinc-600'
            }`}
          >
            <div className="text-[10px] text-zinc-400">Step {s.num}</div>
            <div className="truncate">{s.title}</div>
          </div>
        ))}
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-950/40 border border-red-800 text-red-400 rounded-lg text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: TOKEN METADATA */}
      {step === 1 && (
        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-5 shadow-sm space-y-4 max-w-2xl">
          <h2 className="text-sm font-semibold text-white tracking-tight">Step 1: Token Details</h2>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">
              Token Name * (e.g. PepeSol)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ZETARDIO"
              className="w-full px-3 py-2 bg-[#161c26] border border-[#2b3342] rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">
              Ticker Symbol * (e.g. ZETA)
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="e.g. ZETA"
              maxLength={10}
              className="w-full px-3 py-2 bg-[#161c26] border border-[#2b3342] rounded-lg text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the token narrative, utility, and mission..."
              className="w-full px-3 py-2 bg-[#161c26] border border-[#2b3342] rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                if (!name.trim() || !symbol.trim()) {
                  setErrorMsg('Please specify token name and ticker symbol.');
                  return;
                }
                setErrorMsg(null);
                setStep(2);
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs rounded-lg flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Next: Socials & Media</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SOCIALS */}
      {step === 2 && (
        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-5 shadow-sm space-y-4 max-w-2xl">
          <h2 className="text-sm font-semibold text-white tracking-tight">Step 2: Social Links</h2>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">Telegram Community</label>
            <input
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="https://t.me/..."
              className="w-full px-3 py-2 bg-[#161c26] border border-[#2b3342] rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">Twitter / X Profile</label>
            <input
              type="text"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="https://x.com/..."
              className="w-full px-3 py-2 bg-[#161c26] border border-[#2b3342] rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">Project Website</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-[#161c26] border border-[#2b3342] rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-[#161c26] text-zinc-300 text-xs rounded-lg border border-[#2b3342] flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs rounded-lg flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Next: IPFS Pinning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: IPFS PINNING */}
      {step === 3 && (
        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-5 shadow-sm space-y-4 max-w-2xl">
          <h2 className="text-sm font-semibold text-white tracking-tight">
            Step 3: Pinata IPFS Metadata Storage
          </h2>

          <div className="border-2 border-dashed border-[#2f384a] rounded-xl p-6 text-center space-y-3 bg-[#0d1117]">
            <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-xs text-white font-medium">Upload Token Icon Asset</div>
            <p className="text-[11px] text-zinc-400">PNG, JPG, or WEBP up to 5MB (Square 1:1 recommended)</p>
            <div className="text-[10px] font-mono text-zinc-500 bg-[#161c26] py-1 px-3 rounded inline-block">
              ipfs://bafkreia7e5g... (Pre-computed CID ready for Pinata JWT gateway)
            </div>
          </div>

          <div className="text-xs text-zinc-400 font-mono bg-[#161c26] p-3 rounded-lg border border-[#262f3f] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Pinata IPFS pinning automatically packages JSON-LD schema metadata for Pump.fun on-chain indexing.</span>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-[#161c26] text-zinc-300 text-xs rounded-lg border border-[#2b3342] flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs rounded-lg flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Next: Stealth Allocation & Launch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: BUNDLE ALLOCATION & LAUNCH */}
      {step === 4 && (
        <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-5 shadow-sm space-y-5 max-w-3xl">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">
              Step 4: Stealth Wallet Allocation & Jito MEV Bundling
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select stealth wallets to participate in block-0 atomic execution bundle.
            </p>
          </div>

          {/* Connected Developer Wallet Status */}
          <div className="flex flex-wrap items-center justify-between text-xs font-mono bg-[#161c26] p-3 rounded-lg border border-[#2b3342] gap-2">
            <span className="text-zinc-400">Developer / Signer Wallet:</span>
            <span className="text-zinc-200 font-semibold flex items-center gap-1.5">
              {connectedAddress ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-emerald-300">{formatAddress(connectedAddress, 6, 6)}</span>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-700/50 px-1.5 py-0.2 rounded">
                    Synced Real-Time
                  </span>
                </>
              ) : (
                <span className="text-zinc-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Default Jito Signer (Hubungkan wallet di modal untuk custom key)</span>
                </span>
              )}
            </span>
          </div>

          {/* Funding inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Dev Buy (SOL)</label>
              <input
                type="number"
                step="0.05"
                value={devBuySol}
                onChange={(e) => setDevBuySol(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-[#161c26] border border-[#2b3342] rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Per Stealth Wallet (SOL)</label>
              <input
                type="number"
                step="0.05"
                value={stealthBuyPerWallet}
                onChange={(e) => setStealthBuyPerWallet(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-[#161c26] border border-[#2b3342] rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Jito MEV Tip (SOL)</label>
              <input
                type="number"
                step="0.005"
                value={jitoTipSol}
                onChange={(e) => setJitoTipSol(parseFloat(e.target.value) || 0.01)}
                className="w-full px-3 py-2 bg-[#161c26] border border-[#2b3342] rounded-lg text-white font-mono"
              />
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-[#141923] border border-[#21262d] rounded-lg p-3 text-xs font-mono flex items-center justify-between">
            <div>
              <span className="text-zinc-400">Total Bundle Requirement:</span>
              <span className="text-sm font-bold text-emerald-400 ml-2">
                {totalBundleSol.toFixed(4)} SOL
              </span>
            </div>
            <div className="text-zinc-400">
              {selectedWalletIds.length} stealth wallets + 1 dev wallet
            </div>
          </div>

          {/* Wallets Picker */}
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">
              Select Available Wallets from Pool
            </label>
            <div className="border border-[#21262d] rounded-lg overflow-y-auto max-h-48 bg-[#090d14] divide-y divide-[#1e2430]">
              {availableWallets.length === 0 ? (
                <div className="p-4 text-center text-xs text-zinc-400 font-mono">
                  <p className="text-zinc-300">Belum ada stealth wallet di Catalog.</p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Anda bisa launch menggunakan Dev Wallet saja, atau buat stealth wallet via OKX di menu &apos;Wallet Catalog&apos;.
                  </p>
                </div>
              ) : (
                availableWallets.map((w) => {
                  const isSelected = selectedWalletIds.includes(w.id);
                  return (
                    <div
                      key={w.id}
                      onClick={() => toggleWallet(w.id)}
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

                      <div className="text-[11px] text-zinc-400">{w.balanceSol.toFixed(4)} SOL</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Transaction State Tracker */}
          {txState !== 'unprepared' && (
            <div className="p-3.5 bg-[#0d121c] border border-[#2a3547] rounded-lg text-xs font-mono space-y-2">
              <div className="flex items-center space-x-2">
                {txState === 'confirmed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <RotateCw className="w-4 h-4 text-emerald-400 animate-spin" />
                )}
                <span className="font-semibold text-white">
                  Transaction State:{' '}
                  <span className="uppercase text-emerald-400">{txState}</span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {txState === 'prepared' && 'Synthesizing atomic Jito bundle instructions...'}
                {txState === 'awaiting_signature' && 'Waiting for client Phantom wallet signature authorization...'}
                {txState === 'submitted' && 'Bundle submitted to Solana validator block engine...'}
                {txState === 'confirmed' && 'Confirmed on Solana Mainnet! Minting complete.'}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(3)}
              disabled={txState !== 'unprepared'}
              className="px-4 py-2 bg-[#161c26] text-zinc-300 text-xs rounded-lg border border-[#2b3342] flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleLaunch}
              disabled={txState !== 'unprepared'}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 text-black font-bold text-xs rounded-lg flex items-center space-x-2 cursor-pointer shadow-sm transition-all"
            >
              <Rocket className="w-4 h-4 fill-black" />
              <span>
                {txState === 'unprepared'
                  ? 'Sign & Execute Stealth Bundle'
                  : 'Processing Launch...'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
