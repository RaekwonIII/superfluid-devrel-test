const hre = require("hardhat");
require("dotenv").config();
async function main() {
  const StreamBalanceOf = await hre.ethers.getContractFactory(
    "StreamBalanceOf"
  );
  const streamBalanceOf = await StreamBalanceOf.deploy(
    process.env.FUSDCX_ADDRESS
  );

  await streamBalanceOf.deployed();

  console.log("MoneyRouter deployed to:", streamBalanceOf.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
