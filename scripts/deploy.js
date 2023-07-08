// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
import { ethers } from "hardhat"
import { Framework } from "@superfluid-finance/sdk-core"
require("dotenv").config()

//to run this script:
//1) Make sure you've created your own .env file
//2) Make sure that you have your network specified in hardhat.config.js
//3) run: npx hardhat run scripts/deploy.js --network goerli
async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    const provider = new ethers.providers.JsonRpcProvider(
        process.env.GOERLI_URL
    )

    const sf = await Framework.create({
        chainId: (await provider.getNetwork()).chainId,
        provider
    })

    const signers = await ethers.getSigners()
    // We get the contract to deploy
    const StreamBalanceOf = await ethers.getContractFactory("StreamBalanceOf")
    //deploy the money router account using the proper host address and the address of the first signer
    const streamBalanceOf = await StreamBalanceOf.deploy(
        // sf.settings.config.hostAddress,
        // signers[0].address
        process.env.FUSDCX_ADDRESS
    )

    await streamBalanceOf.deployed()

    console.log("MoneyRouter deployed to:", streamBalanceOf.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
    console.error(error)
    process.exitCode = 1
})