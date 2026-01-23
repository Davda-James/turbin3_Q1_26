import wallet from "../dev-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQenDes_QiUPlT47zoQii1JGZmjb1ruTDKmqA&s"
        const metadata = {
            name: "Ben10",
            symbol: "Ben10",
            description: "This is nft created by lover of Ben10 for people of solana",
            image: image,
            attributes: [
                {trait_type: 'Character', value: 'Ben10'},
                {trait_type: 'Power', value: 'Omnitrix'},
                {trait_type: 'Age', value: '10'},
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ],
                "category": "image"
            },
            creators: ["lover of solana"]
        };
        const myUri = `data:application/json;utf8,${encodeURIComponent(JSON.stringify(metadata))}`;
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
