require('dotenv').config();
const { 
    Connection, 
    Keypair, 
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
} = require('@solana/web3.js');
const { 
    createCreateMetadataAccountV3Instruction,
    PROGRAM_ID,
} = require('@metaplex-foundation/mpl-token-metadata');
const { Buffer } = require('buffer');
const { TOKEN_PROGRAM_ID, getMint } = require('@solana/spl-token');

const connection = new Connection(process.env.HELIUS_RPC_URL, 'confirmed');

// Create keypair from private key in .env
const privateKeyBuffer = Buffer.from(process.env.WALLET_PRIVATE_KEY, 'base64');
const payer = Keypair.fromSecretKey(privateKeyBuffer);

async function main() {
    try {
        console.log('Using wallet:', payer.publicKey.toBase58());

        // Token mint address
        const mintAddress = new PublicKey('Dk8Cy9vo8fwTizjfdGwJQHzL3P4Wn61p9fkfCwbyNYYv');

        // Get mint info
        const mintInfo = await getMint(connection, mintAddress);
        console.log('Mint authority:', mintInfo.mintAuthority?.toBase58() || 'None');
        console.log('Freeze authority:', mintInfo.freezeAuthority?.toBase58() || 'None');

        // Derive the metadata account address
        const [metadataPDA] = PublicKey.findProgramAddressSync(
            [
                Buffer.from('metadata'),
                PROGRAM_ID.toBuffer(),
                mintAddress.toBuffer(),
            ],
            PROGRAM_ID
        );

        console.log('Metadata account:', metadataPDA.toBase58());

        // Check if metadata account exists
        const metadataAccount = await connection.getAccountInfo(metadataPDA);
        
        // Create the metadata
        const metadata = {
            name: "TCOIN",
            symbol: "TCOIN",
            uri: "https://ipfs.io/ipns/k51qzi5uqu5dm8e8ha6oxwhekeqz8iemc8xk2mok4u73borphn81u5bbzvb66s/metadata.json",
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null
        };

        let transaction = new Transaction();

        // Create metadata account instruction
        const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
            {
                metadata: metadataPDA,
                mint: mintAddress,
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

        transaction.add(createMetadataInstruction);
        transaction.feePayer = payer.publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        console.log('Sending transaction...');
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [payer],
            { commitment: 'confirmed' }
        );

        console.log('Transaction successful!');
        console.log('Signature:', signature);

    } catch (error) {
        console.error('Error:', error);
        if (error.logs) {
            console.error('Transaction logs:', error.logs);
        }
    }
}

main(); 