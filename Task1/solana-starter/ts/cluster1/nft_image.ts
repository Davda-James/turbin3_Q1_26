import wallet from "../dev-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
    createGenericFile,
    createSignerFromKeypair,
    signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        const image = await readFile(
            "/home/nimrod/fun/turbin3/Task1/solana-starter/ts/mysub.jpg",
        );
        const umiImageFile = createGenericFile(image, "mysub.jpg", {
            tags: [{ name: "Content-Type", value: "image/jpg" }],
        });

        const imageUri = await umi.uploader
            .upload([umiImageFile])
            .catch((err) => {
                throw new Error(err);
            });

        console.log("Your image URI: ", imageUri);
    } catch (error) {
        console.log("Oops.. Something went wrong", error);
    }
})();

// Uploaded image url: 'https://gateway.irys.xyz/76SgSJwZ9w5kaGnvY3GCQujqwE6yYCAxzE4FYhe6AvzX'
