require('dotenv').config();
const { 
    Connection, 
    Keypair, 
    PublicKey,
    clusterApiUrl,
    LAMPORTS_PER_SOL
} = require('@solana/web3.js');
const {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    TOKEN_PROGRAM_ID,
} = require('@solana/spl-token');

async function createToken() {
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

        console.log('Creating new token mint...');
        
        const mint = await createMint(
            connection,
            payer,
            payer.publicKey, // mint authority
            payer.publicKey, // freeze authority
            9 // decimals
        );

        console.log(`Token mint created! Mint address: ${mint.toBase58()}`);

        // Get the token account of the wallet address, and if it does not exist, create it
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            mint,
            payer.publicKey
        );

        console.log(`Token Account: ${tokenAccount.address.toBase58()}`);

        // Mint 1 billion tokens to the token account
        const amount = 1_000_000_000 * Math.pow(10, 9); // 1 billion with 9 decimals
        await mintTo(
            connection,
            payer,
            mint,
            tokenAccount.address,
            payer,
            amount
        );

        console.log(`Minted ${amount / Math.pow(10, 9)} tokens to ${tokenAccount.address.toBase58()}`);

        // Create metadata for the token
        const metadata = {
            name: "Triple Play IT Coin",
            symbol: "TCOIN",
            description: "The digital token that's here to bring some IT flair to the blockchain, powered by the lightning-fast Solana network.",
            image: "https://ipfs.io/ipns/k51qzi5uqu5dm8e8ha6oxwhekeqz8iemc8xk2mok4u73borphn81u5bbzvb66s",
            decimals: 9,
            totalSupply: 1_000_000_000
        };

        console.log('\nToken Metadata:');
        console.log(JSON.stringify(metadata, null, 2));

    } catch (error) {
        console.error('Error creating token:', error.message);
        if (error.message.includes('Insufficient SOL balance')) {
            console.log('\nTo fund your wallet, you can use:');
            console.log('1. Solana CLI: solana transfer <amount> <wallet_address>');
            console.log('2. Phantom Wallet or other Solana wallets');
            console.log('3. Any Solana exchange that supports withdrawals');
        }
    }
}

createToken(); 