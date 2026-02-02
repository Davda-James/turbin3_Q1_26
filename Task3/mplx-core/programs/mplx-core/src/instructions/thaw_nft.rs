use anchor_lang::prelude::*;
use mpl_core::{
    instructions::UpdatePluginV1CpiBuilder,
    types::{FreezeDelegate, Plugin},
    ID as CORE_PROGRAM_ID,
};

use crate::{error::MPLXCoreError, state::CollectionAuthority};

#[derive(Accounts)]
pub struct ThawNft<'info> {
    #[account(
        mut,
        constraint = creator.key() == collection_authority.creator @ MPLXCoreError::NotAuthorized,
    )]
    pub creator: Signer<'info>,
    #[account(
        mut,
        constraint = !asset.data_is_empty() @ MPLXCoreError::AssetNotInitialized,
    )]
    /// CHECK: This is the asset account will automatically checked in the CPI
    pub asset: UncheckedAccount<'info>,
    #[account(
        mut,
        constraint = collection.owner == &CORE_PROGRAM_ID @ MPLXCoreError::InvalidCollection,
        constraint = !collection.data_is_empty() @ MPLXCoreError::CollectionNotInitialized
    )]
    /// CHECK: This is the collection account will automatically checked in the CPI
    pub collection: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [b"collection_authority", collection.key().as_ref()],
        bump
    )]
    pub collection_authority: Account<'info, CollectionAuthority>,

    #[account(address = CORE_PROGRAM_ID)]
    /// CHECK: This is the MPL Core program
    pub core_program: UncheckedAccount<'info>,
pub system_program: Program<'info, System>,
}

impl<'info> ThawNft<'info> {
    pub fn thaw_nft(&mut self) -> Result<()> {
        let collection_key = self.collection.key();
        let signer_seeds: &[&[&[u8]]] = &[&[
            b"collection_authority",
            collection_key.as_ref(),
            &[self.collection_authority.bump],
        ]];
        UpdatePluginV1CpiBuilder::new(&self.core_program.to_account_info())
            .asset(&self.asset.to_account_info())
            .collection(Some(&self.collection.to_account_info()))
            .payer(&self.creator.to_account_info())
            .authority(Some(&self.collection_authority.to_account_info()))
            .system_program(&self.system_program.to_account_info())
            .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
            .invoke_signed(signer_seeds)?;
        Ok(())
    }
}
