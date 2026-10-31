#!/usr/bin/env python3
"""
SolBundler GitHub Project & Issue Seeder (Python)
Automates the creation of standard labels, milestones, and issues directly on your GitHub repository.
Usage:
    python3 scripts/setup_github_project.py --token <GITHUB_TOKEN> --repo <OWNER/REPO>
"""

import argparse
import sys
import requests

DEFAULT_REPO = "novi240397/SolBundler"

LABELS = [
    {"name": "bug", "color": "d73a4a", "description": "Masalah teknis atau galat sistem"},
    {"name": "enhancement", "color": "a2eeef", "description": "Fitur baru atau peningkatan"},
    {"name": "launch-support", "color": "ff7b00", "description": "Kendala bundling token & Jito MEV"},
    {"name": "security", "color": "000000", "description": "Keamanan kriptografis & audit anti-bocor"},
    {"name": "triage", "color": "fbca04", "description": "Issue baru yang menunggu tinjauan"},
    {"name": "needs-review", "color": "0e8a16", "description": "Menunggu review kode"},
    {"name": "module:wallet", "color": "5319e7", "description": "Modul Wallet Catalog & Keypairs"},
    {"name": "module:jito", "color": "1f883d", "description": "Modul Jito MEV Engine"},
    {"name": "module:volumebot", "color": "f9d0c4", "description": "Modul Volume & Maker Bot"},
    {"name": "lang:rust", "color": "dea584", "description": "Komponen Rust (On-Chain / Engine)"},
    {"name": "lang:python", "color": "3572A5", "description": "Komponen Python (Bot & Script)"},
    {"name": "lang:typescript", "color": "3178c6", "description": "Komponen TypeScript / Web App"}
]

SEED_ISSUES = [
    {
        "title": "🚀 [Sprint 1] Client-Side Ed25519 Cryptographic Wallet Generator",
        "body": "Implementasikan pembuatan keypair kriptografis resmi Solana Ed25519 di browser secara aman tanpa menyentuh server backend.",
        "labels": ["module:wallet", "lang:typescript", "security"]
    },
    {
        "title": "🦀 [Sprint 2] Rust On-Chain Bundling Program (programs/solbundler)",
        "body": "Smart contract Solana native dalam bahasa Rust untuk eksekusi transfer multi-wallet dan Jito Tip atomik di Slot 0.",
        "labels": ["module:jito", "lang:rust"]
    },
    {
        "title": "⚡ [Sprint 2] Rust Jito MEV Searcher Client (crates/jito-bundler)",
        "body": "Searcher engine client Rust berkecepatan tinggi (<10ms) untuk menyusun transaksi dan mengirim bundle ke Jito Block Engine.",
        "labels": ["module:jito", "lang:rust"]
    },
    {
        "title": "🐍 [Sprint 3] Python Autonomous Volume Bot with Gaussian Jitter",
        "body": "Skrip Python independen untuk menjalankan maker bot dengan siklus 3-phase (Radar, Bear Trap, FOMO Breakout) dan delay acak 3-15 detik.",
        "labels": ["module:volumebot", "lang:python"]
    },
    {
        "title": "💸 [Sprint 3] Python OKX Stealth Disperser Integration",
        "body": "Otomasi penarikan SOL dari API CEX OKX ke sub-wallet stealth via HMAC SHA256.",
        "labels": ["module:wallet", "lang:python"]
    },
    {
        "title": "🔄 [Sprint 3] Real-time Solana Balance Synchronization (8s Polling + Backup RPC)",
        "body": "Sinkronisasi saldo wallet real-time dengan polling otomatis setiap 8 detik dan auto-failover ke RPC sekunder jika node utama limit.",
        "labels": ["module:wallet", "lang:typescript"]
    },
    {
        "title": "📢 [Sprint 4] Telegram Alert Bot Integration for Volume Spikes",
        "body": "Notifikasi Telegram otomatis saat bot volume berganti fase atau mendeteksi lonjakan transaksi.",
        "labels": ["module:volumebot", "lang:python", "enhancement"]
    }
]

def setup_github_project(token: str, repo: str):
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    base_url = f"https://api.github.com/repos/{repo}"

    print(f"🔗 Menghubungkan ke repository: {repo}")

    # 1. Buat / Update Labels
    print("\n🏷️  Membuat Label Standar...")
    for label in LABELS:
        res = requests.post(f"{base_url}/labels", headers=headers, json=label)
        if res.status_code == 201:
            print(f"   [+] Label dibuat: {label['name']}")
        elif res.status_code == 422:
            print(f"   [*] Label sudah ada: {label['name']}")
        else:
            print(f"   [-] Gagal membuat label {label['name']}: {res.status_code}")

    # 2. Buat Issue Seed
    print("\n📋 Membuat Kartu Tugas / Issues Proyek...")
    for issue in SEED_ISSUES:
        res = requests.post(f"{base_url}/issues", headers=headers, json=issue)
        if res.status_code == 201:
            data = res.json()
            print(f"   [+] Issue #{data['number']} dibuat: {issue['title']}")
        else:
            print(f"   [-] Gagal membuat issue: {res.status_code}")

    print("\n✅ Setup GitHub Project selesai!")
    print(f"Buka https://github.com/{repo}/projects untuk melihat dan menambahkan issue ke Kanban Board.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed GitHub Project & Labels for SolBundler")
    parser.add_argument("--token", help="GitHub Personal Access Token (PAT)", required=False)
    parser.add_argument("--repo", default=DEFAULT_REPO, help="Target GitHub repo (contoh: novi240397/SolBundler)")

    args = parser.parse_args()
    if not args.token:
        print("💡 Mode Info: Masukkan --token <PAT> untuk mengeksekusi pembuatan otomatis ke GitHub.")
        print(f"Target Repo: {args.repo}")
        print(f"Jumlah label terdaftar: {len(LABELS)}")
        print(f"Jumlah kartu tugas seed: {len(SEED_ISSUES)}")
        sys.exit(0)

    setup_github_project(args.token, args.repo)
