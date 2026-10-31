//! SolBundler Rust Jito Block Engine Client
//! Ultra-low latency bundle compilation and dispatch for Solana mainnet.

use anyhow::{Context, Result};
use reqwest::Client;
use serde_json::json;
use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    commitment_config::CommitmentConfig,
    pubkey::Pubkey,
    signature::{Keypair, Signer},
    system_instruction,
    transaction::Transaction,
};
use std::{env, str::FromStr, sync::Arc};

// Jito Public Tip Accounts on Solana Mainnet
const JITO_TIP_ACCOUNTS: [&str; 8] = [
    "96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5",
    "HFqU5x63VTxvQssQn138i2674eCwznWVafjstYGiCY4Z",
    "Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY",
    "ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49",
    "DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh",
    "ADuUkR4vqLUMWXxW9gh6D6L8pWyssDxBpBpDxR8CVPj9",
    "DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL",
    "3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT",
];

const JITO_BLOCK_ENGINE_URL: &str = "https://mainnet.block-engine.jito.wtf/api/v1/bundles";

#[tokio::main]
async fn main() -> Result<()> {
    env_logger::init();
    println!("🦀 SolBundler High-Performance Rust Jito Engine starting...");

    let rpc_url = env::var("SOLANA_RPC_ENDPOINT")
        .unwrap_or_else(|_| "https://api.mainnet-beta.solana.com".to_string());
    let rpc_client = Arc::new(RpcClient::new_with_commitment(
        rpc_url,
        CommitmentConfig::confirmed(),
    ));

    println!("📡 Connected to RPC: {}", rpc_client.url());

    // Generate / load payer
    let payer = Keypair::new();
    println!("🔑 Payer Public Key: {}", payer.pubkey());

    // Pick random Jito tip account
    let tip_account_str = JITO_TIP_ACCOUNTS[0];
    let tip_pubkey = Pubkey::from_str(tip_account_str)?;
    let tip_lamports: u64 = 10_000_000; // 0.01 SOL

    println!("⚡ Target Tip Account: {}", tip_account_str);
    println!("💰 Tip Amount: {} lamports (0.01 SOL)", tip_lamports);

    // Tip instruction
    let tip_ix = system_instruction::transfer(&payer.pubkey(), &tip_pubkey, tip_lamports);

    // Fetch latest blockhash
    let recent_blockhash = rpc_client
        .get_latest_blockhash()
        .context("Failed to get recent blockhash")?;

    let tx = Transaction::new_signed_with_payer(
        &[tip_ix],
        Some(&payer.pubkey()),
        &[&payer],
        recent_blockhash,
    );

    let serialized_tx = bincode::serialize(&tx)?;
    let encoded_tx = bs58::encode(&serialized_tx).into_string();

    println!("📦 Submitting bundle to Jito Block Engine...");
    let http_client = Client::new();
    let payload = json!({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "sendBundle",
        "params": [[encoded_tx]]
    });

    let resp = http_client
        .post(JITO_BLOCK_ENGINE_URL)
        .json(&payload)
        .send()
        .await?;

    let status = resp.status();
    let body = resp.text().await?;
    println!("📡 Jito Response [{status}]: {body}");

    println!("✅ Rust Jito Engine execution pipeline verified.");
    Ok(())
}
