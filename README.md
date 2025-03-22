# TCOIN Token

The Tech-Charged Meme Coin on Solana! The digital token that's here to bring some IT flair to the blockchain, powered by the lightning-fast Solana network.

## Token Details

- **Token Name**: TCOIN
- **Token Symbol**: TCOIN
- **Total Supply**: 1,000,000,000 TCOIN
- **Decimals**: 9
- **Token Mint**: `F7nyoyGJ47SezzNWcGkdeCUwPafTN9Nj1wsMxYvPNvqm`
- **Website**: https://tplaycoin.com/

## Token Distribution

1. `HCK4yJVCfcUA6XHsoPp66VC3X9X1n34Kxdh7AYhED12v`: 500,000,000 TCOIN (50%)
2. `AppVbMwhCLdCsaqphpEiPGpg9Xgd4NhztcttXxMZENUm`: 200,000,000 TCOIN (20%)
3. `F3KUWXbTq7pA4oWR7kzsZxuun595Kx4F1dsyPTEZhBCt`: 150,000,000 TCOIN (15%)
4. `TzJqhk71SvMCA6Jp9XAPfSX6zasooWCZvT6N1YxVQyZ`: 100,000,000 TCOIN (10%)
5. `ErK6QKCatew1PnAb8BdyAHcCAzWQj5qRU7fbMgsTPBCh`: 50,000,000 TCOIN (5%)

## Token Metadata

The token metadata is stored on-chain and includes:

- Name: TCOIN
- Symbol: TCOIN
- Description: The Tech-Charged Meme Coin on Solana! The digital token that's here to bring some IT flair to the blockchain, powered by the lightning-fast Solana network.
- Image: [IPFS Link](https://ipfs.io/ipfs/QmXEW3RsWgFL68wZhjDvd4UhRd9HeKghEXVHxDHw8yKmcb)
- External URL: https://tplaycoin.com/

## Development

This repository contains scripts for:

- Creating the token
- Managing token metadata
- Transferring tokens between wallets

### Prerequisites

- Node.js
- Solana CLI
- A Solana wallet with SOL for transaction fees

### Environment Setup

Create a `.env` file with the following variables:

```
HELIUS_RPC_URL=your_helius_rpc_url
WALLET_PUBLIC_KEY=your_wallet_public_key
WALLET_PRIVATE_KEY=your_wallet_private_key
```

### Scripts

- `create-new-token.js`: Creates a new token with metadata
- `transfer-tokens.js`: Transfers tokens between wallets
- `update-metadata.js`: Updates token metadata
