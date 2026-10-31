#!/usr/bin/env python3
"""
SolBundler Automated GitHub Gists Publisher (Python)
Publishes all standalone utility files in the `gists/` directory directly to GitHub Gist using the GitHub REST API.

Usage:
    python3 scripts/publish_gists.py --token <GITHUB_PAT> [--public]
"""

import os
import sys
import glob
import argparse
import requests

GISTS_METADATA = {
    "01_solana_keypair_generator.py": "Solana Stealth Batch Keypair Generator (Ed25519) - SolBundler Suite",
    "02_jito_mev_tip_checker.py": "Real-time Jito MEV Tip Floor Percentiles Checker - SolBundler Suite",
    "03_quick_volume_swap.py": "Solana Micro-Volume Swap Simulation with Gaussian Jitter - SolBundler Suite",
    "04_okx_v5_withdrawal_signer.py": "OKX V5 REST API HMAC SHA-256 Signer for Stealth Withdrawals - SolBundler Suite",
    "05_rust_solana_balance_checker.rs": "Concurrent Solana Multi-Wallet Balance Checker in Rust (Tokio) - SolBundler Suite",
    "06_docker_compose_vps.yml": "Docker Compose Deployment for SolBundler App & Volume Bot Worker - SolBundler Suite"
}

def publish_all_gists(token: str, is_public: bool = True):
    gists_dir = os.path.join(os.path.dirname(__file__), "..", "gists")
    files = sorted(glob.glob(os.path.join(gists_dir, "*.*")))
    target_files = [f for f in files if not f.endswith("README.md")]

    if not target_files:
        print("❌ Tidak ada file gist yang ditemukan di folder gists/.")
        return

    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }

    print(f"🚀 Mempublikasikan {len(target_files)} Gists ke akun GitHub Anda...")
    print(f"🔒 Visibilitas: {'Public' if is_public else 'Secret'}\n")

    published_count = 0
    for file_path in target_files:
        filename = os.path.basename(file_path)
        desc = GISTS_METADATA.get(filename, f"SolBundler Utility: {filename}")

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        payload = {
            "description": desc,
            "public": is_public,
            "files": {
                filename: {
                    "content": content
                }
            }
        }

        resp = requests.post("https://api.github.com/gists", headers=headers, json=payload)
        if resp.status_code == 201:
            data = resp.json()
            print(f"  ✅ [{filename}] Terpublikasi!")
            print(f"     URL: {data.get('html_url')}")
            published_count += 1
        else:
            print(f"  ❌ Gagal mempublikasikan {filename}: HTTP {resp.status_code}")
            try:
                print(f"     Error: {resp.json().get('message')}")
            except Exception:
                pass

    print(f"\n🎉 Selesai! {published_count}/{len(target_files)} Gists berhasil dibuat di https://gist.github.com")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Publish SolBundler utility scripts to GitHub Gists")
    parser.add_argument("--token", help="GitHub Personal Access Token (dengan scope 'gist')", required=False)
    parser.add_argument("--public", action="store_true", default=True, help="Set gist sebagai public (default: True)")

    args = parser.parse_args()

    if not args.token:
        print("💡 Informasi Penggunaan:")
        print("Jalankan dengan menyertakan token GitHub PAT yang memiliki izin 'gist':")
        print("   python3 scripts/publish_gists.py --token ghp_yourPersonalAccessTokenHere\n")
        print("Daftar Gist yang siap dipublikasikan:")
        for fn, desc in GISTS_METADATA.items():
            print(f"  • {fn} -> {desc}")
        sys.exit(0)

    publish_all_gists(args.token, args.public)
