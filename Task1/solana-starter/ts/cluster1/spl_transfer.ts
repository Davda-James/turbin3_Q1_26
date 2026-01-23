import {
    Commitment,
    Connection,
    Keypair,
    sendAndConfirmTransaction,
    LAMPORTS_PER_SOL,
    PublicKey,
} from "@solana/web3.js";
import wallet from "../dev-wallet.json";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("2K5uY8JgFcEFkdayTEet8vLQxufhiM9xrJeaDDzocHjq");

// Recipient address
const from = new PublicKey("2Vh1TKSvFM9ogGQVPt4B8dR7roHoNf4ynPEk35x44J3o");
const to = new PublicKey("7jQEmuRXp9GVBtQ6z763FRiB7NKk2Ltxumj1QSknAvLN");

// from : 2Vh1TKSvFM9ogGQVPt4B8dR7roHoNf4ynPEk35x44J3o
// to   : 7jQEmuRXp9GVBtQ6z763FRiB7NKk2Ltxumj1QSknAvLN

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        // Get the token account of the toWallet address, and if it does not exist, create it
        // Transfer the new token to the "toTokenAccount" we just created
        const tx = await transfer(
            connection,
            keypair,
            from,
            to,
            keypair,
            10,
            [],
            {
                commitment,
            },
        );
        console.log("tx sig is", tx);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();

// tx signature: 29o2Uyk83fRi9RLqEzR2nsL3ijH951JTKBv14S2yy3pobXPc7oVp5yopL5cs2uG7uWjbg2pNn2dBTWPueCbtQbDy
