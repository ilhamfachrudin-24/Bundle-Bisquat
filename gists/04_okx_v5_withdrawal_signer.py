#!/usr/bin/env python3
"""
Gist: OKX V5 REST API HMAC SHA-256 Signer for Stealth Withdrawals
Author: novi240397 (SolBundler Suite)
Description: Clean, production-ready function to sign requests to OKX V5 API for programmatic SOL asset withdrawals without on-chain cluster footprint.
Requirements: pip install requests
"""

import time
import hmac
import base64
import hashlib
import requests

def generate_okx_headers(api_key: str, api_secret: str, passphrase: str, method: str, request_path: str, body: str = "") -> dict:
    """Generates standard OKX V5 authentication headers."""
    timestamp = time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime())
    pre_hash = timestamp + method.upper() + request_path + body

    signature = hmac.new(
        api_secret.encode("utf-8"),
        pre_hash.encode("utf-8"),
        digestmod=hashlib.sha256
    )
    encoded_sign = base64.b64encode(signature.digest()).decode("utf-8")

    return {
        "OK-ACCESS-KEY": api_key,
        "OK-ACCESS-SIGN": encoded_sign,
        "OK-ACCESS-TIMESTAMP": timestamp,
        "OK-ACCESS-PASSPHRASE": passphrase,
        "Content-Type": "application/json"
    }

def withdraw_sol(api_key: str, api_secret: str, passphrase: str, destination_address: str, amount_sol: float, dry_run: bool = True):
    path = "/api/v5/asset/withdrawal"
    payload_str = f'{{"ccy":"SOL","amt":"{amount_sol}","dest":"4","toAddr":"{destination_address}","fee":"0.0014"}}'

    headers = generate_okx_headers(api_key, api_secret, passphrase, "POST", path, payload_str)

    if dry_run or not api_key:
        print(f"🔒 [DRY-RUN] Headers generated successfully. Simulated withdrawal of {amount_sol} SOL to {destination_address}.")
        print(f"   Signature Header: {headers['OK-ACCESS-SIGN'][:16]}...")
        return {"code": "0", "msg": "dry_run_success"}

    url = "https://www.okx.com" + path
    response = requests.post(url, headers=headers, data=payload_str)
    return response.json()

if __name__ == "__main__":
    # Test signer with placeholder credentials
    res = withdraw_sol("TEST_KEY", "TEST_SECRET", "TEST_PASSPHRASE", "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin", 0.05, dry_run=True)
    print("Result:", res)
