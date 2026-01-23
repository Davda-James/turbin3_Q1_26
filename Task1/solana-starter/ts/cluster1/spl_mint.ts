import {
    Keypair,
    PublicKey,
    Connection,
    Commitment,
    ConfirmOptions,
} from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import wallet from "../dev-wallet.json";
import { keypairPayer } from "@metaplex-foundation/umi";

// Import our keypair from the wallet file
// const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const keypair = Keypair.generate();

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("2K5uY8JgFcEFkdayTEet8vLQxufhiM9xrJeaDDzocHjq");

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey,
            false,
            commitment,
        );
        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        const mintTx = await mintTo(
            connection,
            keypair,
            mint,
            ata.address,
            keypair,
            100,
        );
        console.log(`Your mint txid: ${mintTx}`);
    } catch (error) {
        console.log(`Oops, something went wrong: ${error}`);
    }
})();

// ata: 2Vh1TKSvFM9ogGQVPt4B8dR7roHoNf4ynPEk35x44J3o
