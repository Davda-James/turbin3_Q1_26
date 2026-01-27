use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorMsg {
    #[msg("Insufficient balance in vault")]
    InsufficientBalance,
}