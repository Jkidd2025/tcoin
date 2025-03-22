require('dotenv').config();
const { 
    Connection, 
    Keypair, 
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
    SystemProgram,
} = require('@solana/web3.js');
const { 
    createCreateMetadataAccountV3Instruction,
    PROGRAM_ID,
} = require('@metaplex-foundation/mpl-token-metadata');
const { 
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccount,
    getAssociatedTokenAddress,
} = require('@solana/spl-token');
const { Buffer } = require('buffer');
const fs = require('fs');

const connection = new Connection(process.env.HELIUS_RPC_URL, 'confirmed');

// Create keypair from private key in .env
const privateKeyBuffer = Buffer.from(process.env.WALLET_PRIVATE_KEY, 'base64');
const payer = Keypair.fromSecretKey(privateKeyBuffer);

async function main() {
    try {
        console.log('Using wallet:', payer.publicKey.toBase58());

        // Create new token mint
        console.log('Creating new token mint...');
        const mint = await createMint(
            connection,
            payer,
            payer.publicKey, // mint authority
            payer.publicKey, // freeze authority
            9 // decimals
        );
        console.log('Token mint created:', mint.toBase58());

        // Get the associated token account address
        console.log('Getting associated token account address...');
        const associatedTokenAddress = await getAssociatedTokenAddress(
            mint,
            payer.publicKey
        );
        console.log('Associated token account address:', associatedTokenAddress.toBase58());

        // Create the associated token account
        console.log('Creating associated token account...');
        await createAssociatedTokenAccount(
            connection,
            payer,
            mint,
            payer.publicKey
        );
        console.log('Associated token account created');

        // Mint tokens to the token account
        console.log('Minting initial supply...');
        const initialSupply = 1000000000 * Math.pow(10, 9); // 1 billion tokens
        await mintTo(
            connection,
            payer,
            mint,
            associatedTokenAddress,
            payer,
            initialSupply
        );
        console.log('Initial supply minted');

        // Create metadata
        console.log('Creating metadata...');
        const [metadataPDA] = PublicKey.findProgramAddressSync(
            [
                Buffer.from('metadata'),
                PROGRAM_ID.toBuffer(),
                mint.toBuffer(),
            ],
            PROGRAM_ID
        );

        // Read metadata from file
        const metadataJson = JSON.parse(fs.readFileSync('metadata.json', 'utf8'));

        const metadata = {
            name: metadataJson.name,
            symbol: metadataJson.symbol,
            uri: "https://ipfs.io/ipfs/QmXEW3RsWgFL68wZhjDvd4UhRd9HeKghEXVHxDHw8yKmcb/metadata.json",
            sellerFeeBasisPoints: 0,
            creators: metadataJson.properties.creators ? metadataJson.properties.creators.map(creator => ({
                address: new PublicKey(creator.address),
                verified: false,
                share: creator.share
            })) : null,
            collection: null,
            uses: null
        };

        const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
            {
                metadata: metadataPDA,
                mint: mint,
                mintAuthority: payer.publicKey,
                payer: payer.publicKey,
                updateAuthority: payer.publicKey,
            },
            {
                createMetadataAccountArgsV3: {
                    data: metadata,
                    isMutable: true,
                    collectionDetails: null,
                },
            }
        );

        const transaction = new Transaction();
        transaction.add(createMetadataInstruction);
        transaction.feePayer = payer.publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        console.log('Sending metadata transaction...');
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [payer],
            { commitment: 'confirmed' }
        );

        console.log('Transaction successful!');
        console.log('Signature:', signature);
        console.log('Token mint:', mint.toBase58());
        console.log('Token account:', associatedTokenAddress.toBase58());
        console.log('Metadata account:', metadataPDA.toBase58());

    } catch (error) {
        console.error('Error:', error);
        if (error.logs) {
            console.error('Transaction logs:', error.logs);
        }
    }
}

main(); 