//! Gist: Concurrent Solana Multi-Wallet Balance Checker (Rust)
//! Author: novi240397 (SolBundler Suite)
//! Description: Queries 20+ Solana public addresses concurrently using Tokio and Solana RPC Client in <200ms.
//! Cargo deps: solana-client = "1.18", solana-sdk = "1.18", tokio = { version = "1", features = ["full"] }

use solana_client::rpc_client::RpcClient;
use solana_sdk::pubkey::Pubkey;
use std::{str::FromStr, sync::Arc, time::Instant};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let rpc_url = "https://api.mainnet-beta.solana.com".to_string();
    let client = Arc::new(RpcClient::new(rpc_url));

    let sample_wallets = vec![
        "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        "8sTz2vG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
    ];

    println!("🦀 Querying balances for {} wallets concurrently...", sample_wallets.len());
    let start = Instant::now();

    let mut tasks = vec![];
    for addr_str in sample_wallets {
        let client_clone = Arc::clone(&client);
        let task = tokio::spawn(async move {
            match Pubkey::from_str(addr_str) {
                Ok(pubkey) => match client_clone.get_balance(&pubkey) {
                    Ok(lamports) => (addr_str, Ok(lamports as f64 / 1_000_000_000.0)),
                    Err(e) => (addr_str, Err(e.to_string())),
                },
                Err(e) => (addr_str, Err(e.to_string())),
            }
        });
        tasks.push(task);
    }

    for task in tasks {
        let (addr, res) = task.await?;
        match res {
            Ok(sol) => println!("  💰 {} -> {:.4} SOL", &addr[..8], sol),
            Err(e) => println!("  ⚠️ {} -> Error ({})", &addr[..8], e),
        }
    }

    println!("⚡ Done in {:.2}ms!", start.elapsed().as_millis());
    Ok(())
}
