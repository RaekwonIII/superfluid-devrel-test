# Superfluid DevRel Assignment

This project aims to demonstrate the capabilities of Superfluid protocol.
It contains a simple smart contract with one function (two in reality...) that use [Superfluid CFA library](https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/cfav1-library/read-methods/getflowinfo) and its Supertokens.

The contract's method(s) use the `getFlowInfo` to verify if a certain address, provided as an argument, has an active flow towards `vitalik.eth`. The difference between the two functions is that one uses [ENS' on-chain name resolver](https://docs.ens.domains/contract-developer-guide/resolving-names-on-chain) to resolve `vitalik.eth`, while the other one is more generic and accepts an additional parameter.

## Environment variables

Look at `.env.example` file, create a copy of it, named `.env` and fill in the empty variables. For this project, an Infura account was used, but any other RPC url would do.


## Deploy

To deploy the contract to Mumbai testnet, make sure to have enough funds and run the command:

```shell
npx hardhat run scripts/deploy.js --network mumbai
```

**Note:** if you want to deploy on a different network, modify `hardhat.config.js` by adding a new network configuration

## Additional scripts

To interact with the on-chain contract, try running these commands:

```shell
npx hardhat run scripts/checkNonExistingStream.js --network mumbai
npx hardhat run scripts/checkExistingStream.js --network mumbai
```

And play around with `sender` or `vitalik` addresses, if you want to verify a stream existence between different addresses.

## Tests

A test has been written for this, but at the moment of writing this README, a library error prevents from executing them

## Frontend

This project contains a small frontend as well, written in Next.js and located in the [lens-donator subfolder](./lens-donator/). For instructions regarding the frontend itself, see its [README](./lens-donator/README.md).