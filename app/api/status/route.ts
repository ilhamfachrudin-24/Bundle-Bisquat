import { NextResponse } from 'next/server';

export async function GET() {
  const hasHeliusKey = Boolean(process.env.HELIUS_API_KEY);
  const hasCustomRpc = Boolean(process.env.SOLANA_RPC_ENDPOINT);
  const hasOkxKey = Boolean(
    process.env.OKX_API_KEY && process.env.OKX_API_SECRET && process.env.OKX_PASSPHRASE
  );
  const hasPinata = Boolean(process.env.PINATA_JWT);
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta';

  return NextResponse.json({
    status: 'online',
    version: 'v0.5.53',
    network,
    services: {
      solanaRpc: {
        configured: hasHeliusKey || hasCustomRpc,
        provider: hasHeliusKey ? 'Helius Dedicated RPC' : hasCustomRpc ? 'Custom Solana RPC' : 'Public RPC / Sandbox Mode',
        network: 'Solana Mainnet-Beta'
      },
      okxSpot: {
        configured: hasOkxKey,
        mode: hasOkxKey ? 'Live OKX API Connected' : 'Simulated OKX Sandbox',
        spotSolBalance: 0.0010
      },
      pinataIpfs: {
        configured: hasPinata,
        gateway: process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs/'
      }
    },
    timestamp: new Date().toISOString()
  });
}
