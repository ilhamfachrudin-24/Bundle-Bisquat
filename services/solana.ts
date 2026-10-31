import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

export const DEFAULT_SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

let cachedConnection: Connection | null = null;

export function getSolanaConnection(rpcUrl: string = DEFAULT_SOLANA_RPC): Connection {
  if (!cachedConnection) {
    cachedConnection = new Connection(rpcUrl, 'confirmed');
  }
  return cachedConnection;
}

export async function fetchLiveSolBalance(pubkeyString: string): Promise<number | null> {
  if (!isValidSolanaAddress(pubkeyString)) return null;

  // 1. Try our internal server API proxy first (avoids browser CORS & rate limits)
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/solana/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: pubkeyString.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.balanceSol === 'number') {
          return data.balanceSol;
        }
      }
    } catch {
      // Fall through to direct RPC connection
    }
  }

  // 2. Direct RPC fallback
  try {
    const conn = getSolanaConnection();
    const pubkey = new PublicKey(pubkeyString.trim());
    const lamports = await conn.getBalance(pubkey);
    return Number(lamports) / 1_000_000_000;
  } catch (error) {
    try {
      const fallbackConn = new Connection('https://rpc.ankr.com/solana', 'confirmed');
      const pubkey = new PublicKey(pubkeyString.trim());
      const lamports = await fallbackConn.getBalance(pubkey);
      return Number(lamports) / 1_000_000_000;
    } catch {
      return null;
    }
  }
}

export interface GeneratedKeypairData {
  publicKey: string;
  privateKeyBase58: string;
  privateKeyJson: string;
}

/**
 * Generates a real cryptographic Ed25519 Solana Keypair.
 * Returns valid Base58 public key, exportable Base58 private key (Phantom/Solflare format),
 * and standard byte-array JSON (Solana CLI format).
 */
export async function generateRealSolanaKeypair(): Promise<GeneratedKeypairData> {
  const kp = await Keypair.generate();
  const publicKey = kp.publicKey.toBase58();
  const privateKeyBase58 = bs58.encode(kp.secretKey);
  const privateKeyJson = JSON.stringify(Array.from(kp.secretKey));
  return {
    publicKey,
    privateKeyBase58,
    privateKeyJson
  };
}

/**
 * Generates multiple real cryptographic Solana Keypairs
 */
export async function generateRealSolanaKeypairs(count: number): Promise<GeneratedKeypairData[]> {
  const list: GeneratedKeypairData[] = [];
  for (let i = 0; i < count; i++) {
    const kpData = await generateRealSolanaKeypair();
    list.push(kpData);
  }
  return list;
}

/**
 * Fetches confirmed live SOL balances directly from Solana Mainnet RPC for multiple addresses
 */
export async function fetchLiveBalancesForWallets(pubkeys: string[]): Promise<Record<string, number>> {
  const results: Record<string, number> = {};
  const batchSize = 5;
  for (let i = 0; i < pubkeys.length; i += batchSize) {
    const chunk = pubkeys.slice(i, i + batchSize);
    await Promise.all(
      chunk.map(async (pubkey) => {
        const bal = await fetchLiveSolBalance(pubkey);
        if (bal !== null) {
          results[pubkey] = bal;
        }
      })
    );
  }
  return results;
}

export function detectSolanaProviders() {
  if (typeof window === 'undefined') return { phantom: false, solflare: false, backpack: false };
  const anyWindow = window as any;
  return {
    phantom: Boolean(anyWindow.solana?.isPhantom || anyWindow.phantom?.solana?.isPhantom),
    solflare: Boolean(anyWindow.solflare?.isSolflare),
    backpack: Boolean(anyWindow.backpack)
  };
}

export function isValidSolanaAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  try {
    const pubkey = new PublicKey(address.trim());
    return PublicKey.isOnCurve(pubkey.toBytes());
  } catch {
    return false;
  }
}

export function formatAddress(address: string, start = 4, end = 4): string {
  if (!address) return '—';
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function formatSol(amount: number | undefined | null, decimals = 4): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '0.0000 SOL';
  return `${amount.toFixed(decimals)} SOL`;
}

export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export interface OkxCalculationResult {
  spotBalanceSol: number;
  walletCount: number;
  totalSolToSplit: number;
  solPerWallet: number;
  networkFeeSol: number;
  totalRequiredSol: number;
  isSufficient: boolean;
  deficitSol: number;
}

export type BinanceCalculationResult = OkxCalculationResult;

export function calculateOkxFunding(
  spotBalanceSol: number,
  walletCount: number,
  totalSolToSplit: number,
  perTxFeeSol = 0.0014
): OkxCalculationResult {
  const safeCount = Math.max(1, walletCount);
  const totalFees = safeCount * perTxFeeSol;
  const totalRequired = totalSolToSplit + totalFees;
  const isSufficient = spotBalanceSol >= totalRequired;
  const deficit = isSufficient ? 0 : Number((totalRequired - spotBalanceSol).toFixed(4));
  const solPerWallet = Number((totalSolToSplit / safeCount).toFixed(4));

  return {
    spotBalanceSol,
    walletCount: safeCount,
    totalSolToSplit,
    solPerWallet,
    networkFeeSol: Number(totalFees.toFixed(4)),
    totalRequiredSol: Number(totalRequired.toFixed(4)),
    isSufficient,
    deficitSol: deficit
  };
}

export const calculateBinanceFunding = calculateOkxFunding;

