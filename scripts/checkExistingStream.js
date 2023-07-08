const hre = require("hardhat")
const { Framework } = require("@superfluid-finance/sdk-core")
const { ethers } = require("hardhat")
require("dotenv").config()
const StreamBalanceOfABI =
    require("../artifacts/contracts/StreamBalanceOf.sol/StreamBalanceOf.json").abi
async function main() {
    const streamBalanceOfAddress = "0x9CC433Ab1AC5363510CECd762E47D9b393Faf06f";
    const sender = "0xa1a66CC5d309F19Fb2Fda2b7601b223053d0f7F4" // real account
    const vitalik = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" // https://opensea.io/assets/ethereum/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/79233663829379634837589865448569342784712482819484549289560981379859480642508

    const provider = new hre.ethers.providers.JsonRpcProvider(
        `${process.env.MUMBAI_URL}${process.env.INFURA_API_KEY}`
    );

    const sf = await Framework.create({
        chainId: (await provider.getNetwork()).chainId,
        provider
    });

    const streamBalanceOf = new ethers.Contract(
        streamBalanceOfAddress,
        StreamBalanceOfABI,
        provider
    );

    const fusdcx = await sf.loadSuperToken("fUSDCx");
    const fUSDCxFlow = await fusdcx.getFlow({
        sender: sender,
        receiver: vitalik,
        providerOrSigner: provider
    })
    console.log(`Verifying existing flow from ${sender} to ${vitalik}: ${fUSDCxFlow.flowRate}`);

    // This is where I wanted to call a smart contract function that uses ENS resolver
    // https://docs.ens.domains/contract-developer-guide/resolving-names-on-chain
    // but it is not deployed on Mumbai 
    // let result = await streamBalanceOf.balanceOf(sender);

    let result = await streamBalanceOf.testFun(sender, vitalik);
    console.log(`On-chain contract says there are ${result} flows from ${sender} to vitalik.eth`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
