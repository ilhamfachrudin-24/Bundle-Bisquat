#!/usr/bin/env python3
"""
Gist: Solana Stealth Batch Keypair Generator (Ed25519)
Author: novi240397 (SolBundler Suite)
Description: Generates batch cryptographic Solana keypairs and exports public addresses and Phantom/Solflare-compatible Base58 private keys.
Requirements: pip install solders base58
"""

import sys
import json
from solders.keypair import Keypair
import base58

def generate_wallets(count: int = 5, output_file: str = "stealth_wallets.json"):
    print(f"🔑 Generating {count} Solana cryptographic keypairs...")
    wallets = []

    for i in range(1, count + 1):
        kp = Keypair()
        pubkey = str(kp.pubkey())
        # 64-byte secret key encoded to base58
        privkey_b58 = base58.b58encode(bytes(kp)).decode("utf-8")

        wallets.append({
            "index": i,
            "label": f"stealth_{i:03d}",
            "publicKey": pubkey,
            "privateKeyBase58": privkey_b58,
            "solscanUrl": f"https://solscan.io/account/{pubkey}"
        })
        print(f"  [{i:02d}/{count:02d}] {pubkey} -> Saved")

    with open(output_file, "w") as f:
        json.dump(wallets, f, indent=2)

    print(f"\n✅ {count} wallets saved to {output_file}")
    print("⚠️  PENTING: Jaga kerahasiaan file ini. Jangan pernah mengunggah private key ke repositori publik!")

if __name__ == "__main__":
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 5
    generate_wallets(count)
