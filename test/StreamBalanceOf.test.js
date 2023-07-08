const { expect } = require("chai");
const { Framework } = require("@superfluid-finance/sdk-core");
const { ethers } = require("hardhat");
const deployTestFramework = require("@superfluid-finance/ethereum-contracts/scripts/deploy-test-framework");
const TestToken = require("@superfluid-finance/ethereum-contracts/build/contracts/TestToken.json");

let sfDeployer;
let contractsFramework;
let sf;
let tokenDeployment;
let streamBalanceOf;
let fUSDC;
let fUSDCx;

// Test Accounts
let owner;
let account1;
let account2;

// Constants
//useful for denominating large units of tokens when minting
const thousandEther = ethers.utils.parseEther("10000");

before(async function () {
    // get hardhat accounts
    [owner, account1, account2] = await ethers.getSigners();

    sfDeployer = await deployTestFramework();

    // GETTING SUPERFLUID FRAMEWORK SET UP

    // deploy the framework locally
    contractsFramework = await sfDeployer.getFramework();

    // initialize framework
    sf = await Framework.create({
        chainId: 31337,
        provider: owner.provider,
        resolverAddress: contractsFramework.resolver,
        protocolReleaseVersion: "test"
    });

    // DEPLOYING USDC and USDC wrapper super token
    tokenDeployment = await sfDeployer.deployWrapperSuperToken(
        "Fake USDC Token",
        "fUSDC",
        18,
        ethers.utils.parseEther("100000000").toString()
    );

    fUSDCx = await sf.loadSuperToken("fUSDCx");
    fUSDC = new ethers.Contract(fUSDCx.underlyingToken.address, TestToken.abi, owner);
    
    // minting and wrapping test USDC to all accounts
    await fUSDC.mint(owner.address, thousandEther);
    await fUSDC.mint(account1.address, thousandEther);
    await fUSDC.mint(account2.address, thousandEther);

    // approving USDCx to spend USDC (Super Token object is not an ethers contract object and has different operation syntax)
    await fUSDC.approve(fUSDCx.address, ethers.constants.MaxInt256);
    await fUSDC.connect(account1).approve(fUSDCx.address, ethers.constants.MaxInt256);
    await fUSDC.connect(account2).approve(fUSDCx.address, ethers.constants.MaxInt256);
    // Upgrading all USDC to USDCx
    const ownerUpgrade = fUSDCx.upgrade({amount: thousandEther});
    const account1Upgrade = fUSDCx.upgrade({amount: thousandEther});
    const account2Upgrade = fUSDCx.upgrade({amount: thousandEther});

    await ownerUpgrade.exec(owner);
    await account1Upgrade.exec(account1);
    await account2Upgrade.exec(account2);

    //DEPLOY YOUR CONTRACT 
    //you can find this example at https://github.com/superfluid-finance/super-examples/tree/main/projects/money-streaming-intro/test
    streamBalanceOf = await ethers.getContractFactory("StreamBalanceOf", owner);
    streamBalanceOf = await streamBalanceOf.deploy(
            fUSDCx.address
    );
    await streamBalanceOf.deployed();
});

describe("Money Router", function () {
    it("Create stream and verify the contract function finds it", async function () {
        const flowRate = 1;
        const createFlowOperation = fUSDCx.createFlowByOperator({
            sender: account1,
            receiver: account2,
            flowRate: flowRate
            // userData?: string
          });
      
          console.log("Creating your stream...");
      
          const result = await createFlowOperation.exec(owner);
          console.log(result);
      
          console.log(
            `Congrats - you've just created a money stream!
          View Your Stream At: https://app.superfluid.finance/dashboard/${account2}
          Network: Goerli
          Super Token: fUSDCx
          Sender: ${account1}
          Receiver: ${account2},
          FlowRate: ${flowRate}
          `
          );

        expect(await streamBalanceOf.testFun(account1, account2)).to.equal(1)
    })
    it("Testing if true is true", async function () {
        expect(true)
    })
})