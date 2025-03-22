require('dotenv').config();
const { 
    Connection, 
    Keypair, 
    PublicKey,
    LAMPORTS_PER_SOL,
    Transaction
} = require('@solana/web3.js');
const {
    TOKEN_PROGRAM_ID,
    createBurnInstruction,
    getAssociatedTokenAddress
} = require('@solana/spl-token');

async function burnTokens(amount) {
    try {
        // Connect to Solana mainnet using Helius RPC
        const connection = new Connection(process.env.HELIUS_RPC_URL, 'confirmed');

        // Create keypair from private key in .env
        const privateKeyBuffer = Buffer.from(process.env.WALLET_PRIVATE_KEY, 'base64');
        const payer = Keypair.fromSecretKey(privateKeyBuffer);

        console.log('Using wallet:', payer.publicKey.toBase58());
        
        // Check wallet balance
        const balance = await connection.getBalance(payer.publicKey);
        console.log(`Wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);
        
        if (balance < 0.1 * LAMPORTS_PER_SOL) {
            throw new Error('Insufficient SOL balance. Please fund the wallet with at least 0.1 SOL for transaction fees.');
        }

        // Token mint address from previous creation
        const mintAddress = new PublicKey('Dk8Cy9vo8fwTizjfdGwJQHzL3P4Wn61p9fkfCwbyNYYv');

        // Get the associated token account
        const tokenAccount = await getAssociatedTokenAddress(
            mintAddress,
            payer.publicKey
        );

        console.log('Token Account:', tokenAccount.toBase58());
        console.log('Amount to burn:', amount);

        // Create the burn instruction
        const burnInstruction = createBurnInstruction(
            tokenAccount, // source token account
            mintAddress, // mint address
            payer.publicKey, // owner of the token account
            amount * Math.pow(10, 9), // amount to burn (with decimals)
            [],
            TOKEN_PROGRAM_ID
        );

        // Send the transaction
        const transaction = new Transaction().add(burnInstruction);
        const signature = await connection.sendTransaction(transaction, [payer]);
        
        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');

        console.log('\nSuccessfully burned tokens!');
        console.log('Transaction signature:', signature);
        console.log('Amount burned:', amount, 'TCOIN');
        console.log('\nImportant: This action cannot be undone. The burned tokens are permanently removed from the total supply.');

    } catch (error) {
        console.error('Error burning tokens:', error.message);
        if (error.message.includes('Insufficient SOL balance')) {
            console.log('\nTo fund your wallet, you can use:');
            console.log('1. Solana CLI: solana transfer <amount> <wallet_address>');
            console.log('2. Phantom Wallet or other Solana wallets');
            console.log('3. Any Solana exchange that supports withdrawals');
        }
    }
}

// Get amount from command line argument or use default
const amount = process.argv[2] ? parseInt(process.argv[2]) : 1000; // Default burn 1000 tokens if no amount specified
burnTokens(amount); 