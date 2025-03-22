require('dotenv').config();
const { Connection } = require('@solana/web3.js');

async function checkTransactionStatus(signature) {
    try {
        // Connect to Solana mainnet using Helius RPC
        const connection = new Connection(process.env.HELIUS_RPC_URL, 'confirmed');
        
        console.log('Checking transaction status...');
        console.log('Transaction signature:', signature);
        
        // Get transaction details
        const tx = await connection.getTransaction(signature, {
            maxSupportedTransactionVersion: 0
        });
        
        if (tx) {
            console.log('\nTransaction found!');
            console.log('Status:', tx.meta.err ? 'Failed' : 'Success');
            console.log('Slot:', tx.slot);
            console.log('Block time:', new Date(tx.blockTime * 1000).toLocaleString());
            
            if (tx.meta.err) {
                console.log('\nError details:', tx.meta.err);
            }
            
            if (tx.meta.logMessages) {
                console.log('\nTransaction logs:');
                tx.meta.logMessages.forEach(log => console.log(log));
            }
        } else {
            console.log('\nTransaction not found. It might still be processing or the signature might be incorrect.');
        }
    } catch (error) {
        console.error('Error checking transaction:', error);
    }
}

// Replace this with your transaction signature
const signature = 'YOUR_TRANSACTION_SIGNATURE';
checkTransactionStatus(signature); 