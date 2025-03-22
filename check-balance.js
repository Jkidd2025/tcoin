require('dotenv').config();
const { Connection, PublicKey } = require('@solana/web3.js');
const { getAssociatedTokenAddress, getAccount } = require('@solana/spl-token');

const connection = new Connection(process.env.HELIUS_RPC_URL, 'confirmed');

async function main() {
    try {
        const wallet = new PublicKey('F3KUWXbTq7pA4oWR7kzsZxuun595Kx4F1dsyPTEZhBCt');
        const mint = new PublicKey('F7nyoyGJ47SezzNWcGkdeCUwPafTN9Nj1wsMxYvPNvqm');

        // Get the associated token account address
        const tokenAccount = await getAssociatedTokenAddress(mint, wallet);
        console.log('Associated Token Account:', tokenAccount.toString());

        // Get the token account info
        try {
            const accountInfo = await getAccount(connection, tokenAccount);
            console.log('Account Info:', accountInfo);
            console.log('Balance:', accountInfo.amount.toString());
        } catch (e) {
            console.log('Error getting account info:', e.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

main(); 