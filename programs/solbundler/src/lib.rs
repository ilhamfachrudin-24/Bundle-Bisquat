//! SolBundler On-Chain Program (Rust)
//! Atomic multi-wallet token bundling, stealth swap router, and Jito tip distribution.

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
};

// Program ID declaration
solana_program::declare_id!("SBund1er11111111111111111111111111111111111");

/// Program Instructions supported by SolBundler
#[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq)]
pub enum BundlerInstruction {
    /// Disperse SOL atomically from a single master wallet to multiple sub-wallets
    /// Accounts expected:
    /// 0. `[signer, writable]` Master funding account
    /// 1..N. `[writable]` Destination stealth accounts
    /// N+1. `[]` System Program
    DisperseSol { amounts: Vec<u64> },

    /// Collect / sweep SOL back from stealth wallets to a target master wallet
    /// Accounts expected:
    /// 0. `[writable]` Target destination master account
    /// 1..N. `[signer, writable]` Source stealth accounts
    /// N+1. `[]` System Program
    SweepSol,

    /// Distribute atomic Jito MEV tip to designated tip accounts in slot 0
    /// Accounts expected:
    /// 0. `[signer, writable]` Tip payer account
    /// 1. `[writable]` Jito Tip account (e.g. 96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5)
    PayJitoTip { tip_lamports: u64 },
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = BundlerInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        BundlerInstruction::DisperseSol { amounts } => {
            msg!("SolBundler: Executing Atomic SOL Dispersal to {} wallets", amounts.len());
            process_disperse(accounts, amounts)
        }
        BundlerInstruction::SweepSol => {
            msg!("SolBundler: Executing Atomic SOL Sweep");
            process_sweep(accounts)
        }
        BundlerInstruction::PayJitoTip { tip_lamports } => {
            msg!("SolBundler: Processing Jito MEV Tip of {} lamports", tip_lamports);
            process_jito_tip(accounts, tip_lamports)
        }
    }
}

fn process_disperse(accounts: &[AccountInfo], amounts: Vec<u64>) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let source_account = next_account_info(account_info_iter)?;

    if !source_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    for amount in amounts {
        let dest_account = next_account_info(account_info_iter)?;
        if amount > 0 {
            invoke(
                &system_instruction::transfer(
                    source_account.key,
                    dest_account.key,
                    amount,
                ),
                &[source_account.clone(), dest_account.clone()],
            )?;
        }
    }

    msg!("SolBundler: Dispersal completed successfully");
    Ok(())
}

fn process_sweep(accounts: &[AccountInfo],) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let destination_account = next_account_info(account_info_iter)?;

    for source_account in account_info_iter {
        if source_account.is_signer && **source_account.lamports.borrow() > 0 {
            let balance = **source_account.lamports.borrow();
            // Leave rent exemption if necessary, or transfer all available
            invoke(
                &system_instruction::transfer(
                    source_account.key,
                    destination_account.key,
                    balance,
                ),
                &[source_account.clone(), destination_account.clone()],
            )?;
        }
    }

    msg!("SolBundler: Sweep completed successfully");
    Ok(())
}

fn process_jito_tip(accounts: &[AccountInfo], tip_lamports: u64) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let payer = next_account_info(account_info_iter)?;
    let jito_tip_account = next_account_info(account_info_iter)?;

    if !payer.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    invoke(
        &system_instruction::transfer(payer.key, jito_tip_account.key, tip_lamports),
        &[payer.clone(), jito_tip_account.clone()],
    )?;

    msg!("SolBundler: Jito Tip {} lamports sent to {}", tip_lamports, jito_tip_account.key);
    Ok(())
}
