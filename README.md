# Triple Play IT Coin ($TCOIN) SPL Token

This repository contains the code to create the Triple Play IT Coin ($TCOIN) SPL token on the Solana mainnet.

## Token Details

- Name: Triple Play IT Coin
- Symbol: $TCOIN
- Description: The digital token that's here to bring some IT flair to the blockchain, powered by the lightning-fast Solana network.
- Supply: 1,000,000,000
- Decimals: 9
- Token URI: https://ipfs.io/ipns/k51qzi5uqu5dm8e8ha6oxwhekeqz8iemc8xk2mok4u73borphn81u5bbzvb66s

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Helius RPC API key

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure your environment:
   - Copy the `.env` file
   - Replace `YOUR_API_KEY` with your Helius RPC API key

## Usage

To create the token, run:

```bash
npm start
```

The script will:

1. Create a new token mint
2. Create a token account
3. Mint the initial supply of 1 billion tokens
4. Display the token metadata and addresses

## Important Notes

- Make sure you have enough SOL in your wallet for transaction fees
- The script generates a new wallet keypair for testing. In production, you should use your own wallet
- Keep your private keys secure and never share them
- The token will be created on Solana mainnet
