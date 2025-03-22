require('dotenv').config();
const { Connection, PublicKey } = require('@solana/web3.js');
const { PROGRAM_ID } = require('@metaplex-foundation/mpl-token-metadata');

async function checkTokenMetadata() {
    try {
        // Connect to Solana mainnet using Helius RPC
        const connection = new Connection(process.env.HELIUS_RPC_URL, 'confirmed');
        
        // Token mint address
        const mintAddress = new PublicKey('Dk8Cy9vo8fwTizjfdGwJQHzL3P4Wn61p9fkfCwbyNYYv');
        
        console.log('Checking token metadata...');
        console.log('Token mint:', mintAddress.toBase58());
        
        // Find metadata PDA
        const [metadataAddress] = PublicKey.findProgramAddressSync(
            [
                Buffer.from('metadata'),
                PROGRAM_ID.toBuffer(),
                mintAddress.toBuffer(),
            ],
            PROGRAM_ID
        );
        
        console.log('Metadata account:', metadataAddress.toBase58());
        
        // Get metadata account info
        const metadataAccount = await connection.getAccountInfo(metadataAddress);
        
        if (metadataAccount) {
            console.log('\nMetadata found!');
            console.log('Account exists and is', metadataAccount.data.length, 'bytes');
            
            // Log the raw data for inspection
            console.log('\nRaw metadata data (first 100 bytes):');
            console.log(metadataAccount.data.slice(0, 100));
        } else {
            console.log('\nNo metadata found for this token.');
        }
    } catch (error) {
        console.error('Error checking metadata:', error);
    }
}

// Run the check
checkTokenMetadata(); 