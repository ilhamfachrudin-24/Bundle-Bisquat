'use client';

import React from 'react';
import {
  HelpCircle,
  Terminal,
  Key,
  ShieldCheck,
  Zap,
  Coins,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

interface HowToUseViewProps {
  onNavigateToLaunch: () => void;
  onNavigateToCatalog: () => void;
}

export default function HowToUseView({
  onNavigateToLaunch,
  onNavigateToCatalog
}: HowToUseViewProps) {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#090d14] text-zinc-100 p-5 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-3 border-b border-[#21262d]">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            How to Use SolBundler v0.5.53
          </h1>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Complete operational architecture, environment secret configuration, and launch protocol.
        </p>
      </div>

      {/* Section 1: Quickstart & Deployment */}
      <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-sm font-semibold text-white">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>1. Deployment & Server Execution</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          SolBundler runs with high-performance server-side transaction signing and Jito bundle compilation. Configure your environment secrets in <code className="bg-[#161c26] px-1.5 py-0.5 rounded text-emerald-400">.env</code>:
        </p>

        <div className="bg-[#090d14] border border-[#21262d] rounded-lg p-3 font-mono text-xs text-zinc-300 space-y-1">
          <div className="text-zinc-500"># 1. Clone and enter project</div>
          <div>git clone https://github.com/YOUR_USER/SolBundler.git</div>
          <div>cd SolBundler</div>
          <div className="text-zinc-500 pt-1"># 2. Configure secrets (never commit .env)</div>
          <div>cp .env.example .env</div>
          <div className="text-emerald-400"># Edit .env — PINATA_JWT, OKX_API_KEY, OKX_API_SECRET, OKX_PASSPHRASE, HELIUS_API_KEY</div>
          <div className="text-zinc-500 pt-1"># 3. Build & run production web panel</div>
          <div>npm run build && npm run start</div>
          <div className="text-zinc-500"># Panel available at: http://127.0.0.1:3000 (or cargo :8080)</div>
        </div>
      </div>

      {/* Section 2: Stealth Wallet Pool Architecture */}
      <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-sm font-semibold text-white">
          <Coins className="w-4 h-4 text-emerald-400" />
          <span>2. Stealth Wallet Pool & OKX Equal Distribution</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Standard multi-wallet funding from a single master Solana address leaves an obvious on-chain footprint on Solscan/Bubblemaps. SolBundler breaks clustering by leveraging direct automated OKX spot withdrawals:
        </p>
        <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside">
          <li>
            <strong className="text-white">Project-Independent Catalog:</strong> Generate 5, 10, or 30 wallets once in the <button onClick={onNavigateToCatalog} className="text-emerald-400 underline cursor-pointer">Wallet Catalog</button>.
          </li>
          <li>
            <strong className="text-white">Direct CEX Distribution:</strong> OKX sends funds from its internal hot wallet directly to each stealth address, completely decoupling your stealth wallets from your main dev address.
          </li>
          <li>
            <strong className="text-white">Reusability & Sweeping:</strong> Once a project concludes or mass-sells, all residual SOL is swept back to a single destination pubkey in 1 click.
          </li>
        </ul>
      </div>

      {/* Section 3: Jito MEV Bundling & Launching */}
      <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-sm font-semibold text-white">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>3. Jito Block-0 MEV Bundling</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          When launching on Pump.fun, your token creation transaction, developer buy order, and stealth wallet buy orders are bundled into a single atomic block package:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="bg-[#141923] border border-[#21262d] p-3 rounded-lg">
            <div className="text-emerald-400 font-bold">Atomic Block-0</div>
            <div className="text-zinc-400 text-[11px] mt-1">All buy transactions execute simultaneously inside the very first block.</div>
          </div>
          <div className="bg-[#141923] border border-[#21262d] p-3 rounded-lg">
            <div className="text-emerald-400 font-bold">MEV Sandwich Guard</div>
            <div className="text-zinc-400 text-[11px] mt-1">Zero frontrunning risk; searcher bots cannot slip ahead in the mempool.</div>
          </div>
          <div className="bg-[#141923] border border-[#21262d] p-3 rounded-lg">
            <div className="text-emerald-400 font-bold">Transaction States</div>
            <div className="text-zinc-400 text-[11px] mt-1">Explicit confirmation only after validator consensus verification.</div>
          </div>
        </div>
      </div>

      {/* Section 4: 3-Phase Volume Bot */}
      <div className="bg-[#10141d] border border-[#21262d] rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-sm font-semibold text-white">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>4. 3-Phase Natural Volume Engine</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          SolBundler includes an automated market-making bot designed to generate organic candle movement and momentum on Pump.fun & Raydium charts:
        </p>
        <div className="space-y-2 text-xs font-mono">
          <div className="p-2.5 rounded bg-[#161c26] border border-[#262f3e] flex items-center justify-between">
            <div>
              <span className="text-white font-bold">Phase 1 — Radar:</span>
              <span className="text-zinc-400 ml-2">Initial pulse buys to trigger DEX tracker discovery.</span>
            </div>
            <span className="text-zinc-500 text-[11px]">0-60s</span>
          </div>
          <div className="p-2.5 rounded bg-[#161c26] border border-[#262f3e] flex items-center justify-between">
            <div>
              <span className="text-white font-bold">Phase 2 — Bear Trap:</span>
              <span className="text-zinc-400 ml-2">Controlled 60% partial position trims creating attractive dip entries.</span>
            </div>
            <span className="text-zinc-500 text-[11px]">1-2d</span>
          </div>
          <div className="p-2.5 rounded bg-[#161c26] border border-[#262f3e] flex items-center justify-between">
            <div>
              <span className="text-white font-bold">Phase 3 — FOMO Breakout:</span>
              <span className="text-zinc-400 ml-2">4:1 buy/sell ratio bursts breaking resistance levels.</span>
            </div>
            <span className="text-zinc-500 text-[11px]">2-5d</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onNavigateToLaunch}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded-lg flex items-center space-x-2 cursor-pointer shadow-sm transition-all"
        >
          <span>Launch Your First Stealth Bundle</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
