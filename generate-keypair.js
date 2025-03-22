const { Keypair } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Generate a new keypair
const keypair = Keypair.generate();

// Convert the keypair to base58 strings
const publicKey = keypair.publicKey.toBase58();
const privateKey = Buffer.from(keypair.secretKey).toString('base64');

// Read existing .env content
const envPath = path.join(__dirname, '.env');
let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

// Add or update the keypair in the .env content
const keypairRegex = /(WALLET_PUBLIC_KEY|WALLET_PRIVATE_KEY)=.*/g;
envContent = envContent.replace(keypairRegex, '');

// Add new keypair to .env content
envContent += `\nWALLET_PUBLIC_KEY=${publicKey}\nWALLET_PRIVATE_KEY=${privateKey}\n`;

// Write back to .env
fs.writeFileSync(envPath, envContent);

console.log('New keypair generated and saved to .env file:');
console.log('Public Key:', publicKey);
console.log('Private Key:', privateKey); 