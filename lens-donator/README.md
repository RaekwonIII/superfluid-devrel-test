# Create Superfluid Subscriptions to Lens holders

This simple frontend uses the Superfluid Subscription widget, from Superfluid team, to create a stream of `fUSDCx` tokens between two addresses, **only if the receiver is the holder of a Lens handle**.

The sender can login to the page using a Web3 wallet, thanks to WAGMI library, insert the receiver address and verify that they are holders of a Lens profile [using Lens' public API](https://docs.lens.xyz/docs/get-profiles#get-by-owned-by).


## Environment variables

Look at `.env.example` file, create a copy of it, named `.env` and fill in the empty variables. For this project, an Infura account was used, but any other RPC url would do.

## Start the server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## "Bonus" page

An additional `contract` page has been created, accessible via [http://localhost:3000/contract](http://localhost:3000/contract) which can be used to test the [smart contract defined in the parent project](../contracts/StreamBalanceOf.sol).
This page [uses `ethers.js` to resolve](https://docs.ens.domains/dapp-developer-guide/resolving-names) `vitalik.eth` to its address, and only verifies the existence of streams from a given `sender` address to `vitalik.eth`.