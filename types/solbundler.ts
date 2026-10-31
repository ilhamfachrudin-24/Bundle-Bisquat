export type ProjectStatus = 
  | 'draft'
  | 'ready'
  | 'bundled'
  | 'launched'
  | 'mass sell confirmed'
  | 'archived'
  | '—';

export interface WalletHolding {
  walletLabel: string;
  address: string;
  solBalance: number;
  tokenBalance: number;
  costBasisSol: number;
  currentValueSol: number;
  isDevWallet?: boolean;
}

export interface Project {
  id: string;
  name: string;
  symbol?: string;
  shortMint: string;
  fullMint: string;
  status: ProjectStatus;
  statusLabel?: string;
  walletCount: number;
  investedSol: number;
  portfolioSol: number;
  pnlSol: number;
  pnlPercent: number;
  liquidSol: number;
  tokenBalance: number;
  tokenValueSol: number;
  isOnChain: boolean;
  pumpFunUrl?: string;
  createdAt: string;
  archived?: boolean;
  wallets: WalletHolding[];
  logs: {
    timestamp: string;
    message: string;
    type?: 'info' | 'success' | 'warn' | 'error';
  }[];
}

export interface CatalogWallet {
  id: string;
  label: string;
  pubkey: string;
  privateKeyBase58?: string;
  privateKeyJson?: string;
  batchId: string;
  initialSol: number;
  balanceSol: number;
  status: 'Available' | 'Assigned' | 'EMPTY' | 'Holding';
  assignedProjectId?: string;
  assignedProjectName?: string;
  tokenBalance?: number;
  tokenValueSol?: number;
  createdAt: string;
  lastSyncedAt?: string;
  isOnChainFunded?: boolean;
}

export interface VolumeBotConfig {
  id?: string;
  tokenMint: string;
  selectedWalletIds: string[];
  status: 'idle' | 'running' | 'paused' | 'completed';
  currentPhase: 1 | 2 | 3;
  phase1Progress: number; // 0-100%
  phase2Progress: number;
  phase3Progress: number;
  totalVolumeGeneratedSol: number;
  totalTrades: number;
  startedAt?: string;
  logs: {
    timestamp: string;
    phase: number;
    action: string;
    details: string;
    txHash?: string;
  }[];
}

export interface OkxFundingPlan {
  spotBalanceSol: number;
  walletCount: number;
  totalSolToSplit: number;
  solPerWallet: number;
  networkFeeSol: number;
  totalRequiredSol: number;
  isSufficient: boolean;
  deficitSol: number;
}

export type BinanceFundingPlan = OkxFundingPlan;

export type TransactionState = 
  | 'unprepared'
  | 'prepared'
  | 'awaiting_signature'
  | 'submitted'
  | 'confirmed'
  | 'failed';

export interface SolBundlerState {
  selectedProjectId: string | null;
  activeView: 
    | 'overview' 
    | 'how-to-use' 
    | 'new-launch' 
    | 'project-detail' 
    | 'wallet-catalog' 
    | 'stealth-wallets' 
    | 'archived' 
    | 'volume-bot';
  connectedWallet: {
    address: string | null;
    balanceSol: number;
    connected: boolean;
  };
}

export interface JitoRpcNode {
  id: string;
  name: string;
  region: string;
  url: string;
  pingMs?: number;
  recommended?: boolean;
}

export interface JitoBundleConfig {
  tipAmountSol: number;
  tipPreset: 'eco' | 'default' | 'fast' | 'turbo' | 'custom';
  selectedNodeUrl: string;
  tipAccount: string;
  simulateBundleBeforeSend: boolean;
  maxRetries: number;
  antiClusterRouting: boolean;
}

