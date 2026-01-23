import wallet from "../dev-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
    CollectionArgs,
    createMetadataAccountV3,
    CreateMetadataAccountV3InstructionAccounts,
    CreateMetadataAccountV3InstructionArgs,
    CreatorArgs,
    DataV2Args,
} from "@metaplex-foundation/mpl-token-metadata";
import {
    createSignerFromKeypair,
    signerIdentity,
    publicKey,
} from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { PublicKey } from "@solana/web3.js";

const mint = publicKey("2K5uY8JgFcEFkdayTEet8vLQxufhiM9xrJeaDDzocHjq");

// Create a UMI connection
const umi = createUmi("https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint: mint,
            mintAuthority: signer,
            payer: signer,
            updateAuthority: signer,
        };
        let data: DataV2Args = {
            name: "Chota Bheem",
            symbol: "Bheem",
            uri: "https://gateway.irys.xyz/76SgSJwZ9w5kaGnvY3GCQujqwE6yYCAxzE4FYhe6AvzX",
            sellerFeeBasisPoints: 500,
            creators: null,
            collection: null,
            uses: null,
        };

        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null,
        };
        let tx = createMetadataAccountV3(umi, {
            ...accounts,
            ...args,
        });
        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();

// signature is : 3ZbGNrzDpHqrXQWaSCE1ZAdi4vthM1uNRgcWfzVNNnrkrBTwh8yuKT73G7THQKgR8BCHkvKggToe7evGZFAcTs8C
