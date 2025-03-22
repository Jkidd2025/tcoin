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
    createSetAuthorityInstruction,
    AuthorityType
} = require('@solana/spl-token');

async function removeFreezeAuthority() {
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

        console.log('Removing freeze authority...');
        
        // Create the set authority instruction to remove freeze authority
        const setAuthorityInstruction = createSetAuthorityInstruction(
            mintAddress, // mint account
            payer.publicKey, // current authority
            AuthorityType.FreezeAccount, // authority type
            null, // new authority (null to remove)
            [],
            TOKEN_PROGRAM_ID
        );

        // Send the transaction
        const transaction = new Transaction().add(setAuthorityInstruction);
        const signature = await connection.sendTransaction(transaction, [payer]);
        
        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');

        console.log('Successfully removed freeze authority!');
        console.log('Transaction signature:', signature);
        console.log('Token mint address:', mintAddress.toBase58());
        console.log('\nImportant: This action cannot be undone. Token accounts can no longer be frozen.');

    } catch (error) {
        console.error('Error removing freeze authority:', error.message);
        if (error.message.includes('Insufficient SOL balance')) {
            console.log('\nTo fund your wallet, you can use:');
            console.log('1. Solana CLI: solana transfer <amount> <wallet_address>');
            console.log('2. Phantom Wallet or other Solana wallets');
            console.log('3. Any Solana exchange that supports withdrawals');
        }
    }
}

removeFreezeAuthority(); 