require('dotenv').config();
const { Connection, PublicKey } = require('@solana/web3.js');
const { getMint } = require('@solana/spl-token');

async function checkMintAuthority() {
    try {
        // Connect to Solana mainnet using Helius RPC
        const connection = new Connection(process.env.HELIUS_RPC_URL, 'confirmed');
        
        // Token mint address
        const mintAddress = new PublicKey('Dk8Cy9vo8fwTizjfdGwJQHzL3P4Wn61p9fkfCwbyNYYv');
        
        console.log('Checking mint authority...');
        console.log('Token mint:', mintAddress.toBase58());
        
        // Get mint info
        const mintInfo = await getMint(connection, mintAddress);
        
        console.log('\nMint info:');
        console.log('Mint authority:', mintInfo.mintAuthority?.toBase58() || 'None');
        console.log('Freeze authority:', mintInfo.freezeAuthority?.toBase58() || 'None');
        console.log('Decimals:', mintInfo.decimals);
        console.log('Supply:', mintInfo.supply.toString());
    } catch (error) {
        console.error('Error checking mint authority:', error);
    }
}

// Run the check
checkMintAuthority(); 