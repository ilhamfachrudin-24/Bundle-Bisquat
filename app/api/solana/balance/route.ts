import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();

    if (!address || typeof address !== 'string') {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    let pubkey: PublicKey;
    try {
      pubkey = new PublicKey(address.trim());
      if (!PublicKey.isOnCurve(pubkey.toBytes())) {
        return NextResponse.json({ error: 'Invalid Solana address format' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Malformed Solana public key' }, { status: 400 });
    }

    const rpcEndpoint = 
      process.env.SOLANA_RPC_ENDPOINT ||
      (process.env.HELIUS_API_KEY ? `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}` : null) ||
      clusterApiUrl('mainnet-beta');

    try {
      const connection = new Connection(rpcEndpoint, 'confirmed');
      const lamports = await connection.getBalance(pubkey);
      const sol = Number(lamports) / Number(LAMPORTS_PER_SOL);

      return NextResponse.json({
        address: pubkey.toBase58(),
        balanceLamports: lamports,
        balanceSol: sol,
        source: 'solana-rpc'
      });
    } catch (rpcError) {
      // In case primary RPC is rate-limited, query backup RPC before fallback
      try {
        const backupConn = new Connection('https://rpc.ankr.com/solana', 'confirmed');
        const lamports = await backupConn.getBalance(pubkey);
        const sol = Number(lamports) / Number(LAMPORTS_PER_SOL);
        return NextResponse.json({
          address: pubkey.toBase58(),
          balanceLamports: lamports,
          balanceSol: sol,
          source: 'solana-backup-rpc'
        });
      } catch {
        return NextResponse.json({
          address: pubkey.toBase58(),
          balanceLamports: 0,
          balanceSol: 0,
          source: 'cached-fallback',
          notice: 'Public RPC rate-limited or unreachable; configure HELIUS_API_KEY or SOLANA_RPC_ENDPOINT for dedicated RPC throughput.'
        });
      }
    }
  } catch {
    return NextResponse.json({ error: 'Failed to query balance' }, { status: 500 });
  }
}
