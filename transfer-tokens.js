require('dotenv').config();
const { 
    Connection, 
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
    Keypair,
} = require('@solana/web3.js');
const { 
    getAssociatedTokenAddress,
    createAssociatedTokenAccount,
    createTransferInstruction,
    TOKEN_PROGRAM_ID,
} = require('@solana/spl-token');
const { Buffer } = require('buffer');

const connection = new Connection(process.env.HELIUS_RPC_URL, 'confirmed');

async function main() {
    try {
        // Create keypair from private key in .env
        const privateKeyBuffer = Buffer.from(process.env.WALLET_PRIVATE_KEY, 'base64');
        const sourceWallet = Keypair.fromSecretKey(privateKeyBuffer);
        console.log('Using wallet:', sourceWallet.publicKey.toBase58());

        // Destination wallet
        const destinationWallet = new PublicKey('ErK6QKCatew1PnAb8BdyAHcCAzWQj5qRU7fbMgsTPBCh');
        // Token mint
        const mint = new PublicKey('F7nyoyGJ47SezzNWcGkdeCUwPafTN9Nj1wsMxYvPNvqm');

        console.log('Getting source token account...');
        const sourceTokenAccount = await getAssociatedTokenAddress(mint, sourceWallet.publicKey);
        console.log('Source token account:', sourceTokenAccount.toString());

        console.log('Getting destination token account...');
        const destinationTokenAccount = await getAssociatedTokenAddress(mint, destinationWallet);
        console.log('Destination token account:', destinationTokenAccount.toString());

        // Create destination token account if it doesn't exist
        try {
            await createAssociatedTokenAccount(
                connection,
                sourceWallet, // payer
                mint,
                destinationWallet
            );
            console.log('Created destination token account');
        } catch (e) {
            console.log('Destination token account already exists');
        }

        // Calculate 5% of the total supply (50,000,000 tokens)
        const transferAmount = 50000000 * Math.pow(10, 9); // 50M tokens with 9 decimals

        console.log('Creating transfer transaction...');
        const transferInstruction = createTransferInstruction(
            sourceTokenAccount,
            destinationTokenAccount,
            sourceWallet.publicKey,
            transferAmount,
            [],
            TOKEN_PROGRAM_ID
        );

        const transaction = new Transaction().add(transferInstruction);

        console.log('Sending transaction...');
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [sourceWallet],
            { commitment: 'confirmed' }
        );

        console.log('Transfer successful!');
        console.log('Transaction signature:', signature);

    } catch (error) {
        console.error('Error:', error);
    }
}

main(); 