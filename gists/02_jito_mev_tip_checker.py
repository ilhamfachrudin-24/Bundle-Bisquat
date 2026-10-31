#!/usr/bin/env python3
"""
Gist: Real-time Jito MEV Tip Floor Checker
Author: novi240397 (SolBundler Suite)
Description: Queries Jito Block Engine's live tip floor percentiles to determine the optimal tip for landing in Slot 0.
Requirements: pip install requests
"""

import requests
import json

JITO_TIP_FLOOR_URL = "https://bundles.jito.wtf/api/v1/bundles/tip_floor"

def fetch_jito_tip_floor():
    print("📡 Querying real-time Jito MEV Tip Floor from Jito Block Engine...")
    try:
        resp = requests.get(JITO_TIP_FLOOR_URL, timeout=10)
        resp.raise_for_status()
        data = resp.json()

        if isinstance(data, list) and len(data) > 0:
            latest = data[0]
            print("\n📊 Current Jito MEV Tip Percentiles (Live Mainnet-Beta):")
            print("=" * 55)
            # Tip values are in lamports (1 SOL = 1,000,000,000 lamports)
            p25 = latest.get("landed_tips_25th_percentile", 0) / 1e9
            p50 = latest.get("landed_tips_50th_percentile", 0) / 1e9
            p75 = latest.get("landed_tips_75th_percentile", 0) / 1e9
            p95 = latest.get("landed_tips_95th_percentile", 0) / 1e9
            p99 = latest.get("landed_tips_99th_percentile", 0) / 1e9

            print(f"  • 25th Percentile (Low Priority)  : {p25:.6f} SOL")
            print(f"  • 50th Percentile (Standard)      : {p50:.6f} SOL (Median)")
            print(f"  • 75th Percentile (Fast Landing)  : {p75:.6f} SOL")
            print(f"  • 95th Percentile (High Priority) : {p95:.6f} SOL (Recommended for Launch)")
            print(f"  • 99th Percentile (Slot 0 Front)  : {p99:.6f} SOL")
            print("=" * 55)
            print("💡 Tip: Untuk peluncuran token stealth di Pump.fun/Raydium, gunakan nilai di atas p75 atau p95.")
        else:
            print("Raw Jito response:", json.dumps(data, indent=2))
    except Exception as e:
        print(f"❌ Error querying Jito Tip API: {e}")

if __name__ == "__main__":
    fetch_jito_tip_floor()
