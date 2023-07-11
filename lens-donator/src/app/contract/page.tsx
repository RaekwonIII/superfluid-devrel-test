"use client";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import { useState } from "react";
import StreamBalanceOfABI from "../../../../artifacts/contracts/StreamBalanceOf.sol/StreamBalanceOf.json";

const streamBalanceOfAddress = "0x9CC433Ab1AC5363510CECd762E47D9b393Faf06f";
const test = "0x815BAfeef052b03262287D5dc2ab7A39cA2bf8F5"; // test account
const vitalik = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // https://opensea.io/assets/ethereum/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/79233663829379634837589865448569342784712482819484549289560981379859480642508

async function checkFlow(sender: `0x${string}` | undefined) {

  const providerEth = new ethers.providers.JsonRpcProvider(
    `${process.env.NEXT_PUBLIC_MAINNET_URL}${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
  );

  var receiver = await providerEth.resolveName("vitalik.eth");
  console.log(`Resolved "vitalik.eth" ENS to ${receiver}`);

  const provider = new ethers.providers.JsonRpcProvider(
    `${process.env.NEXT_PUBLIC_MUMBAI_URL}${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
  );

  const sf = await Framework.create({
    chainId: (await provider.getNetwork()).chainId,
    provider,
  });

  const streamBalanceOf = new ethers.Contract(
    streamBalanceOfAddress,
    StreamBalanceOfABI.abi,
    provider
  );

  sender  = sender || test;
  receiver = receiver || vitalik;
  const fusdcx = await sf.loadSuperToken("fUSDCx");
  const fUSDCxFlow = await fusdcx.getFlow({
    sender: sender,
    receiver: receiver,
    providerOrSigner: provider,
  });
  console.log(
    `Verifying existing flow from ${sender} to ${receiver}: ${fUSDCxFlow.flowRate}`
  );

  // This is where I wanted to call a smart contract function that uses ENS resolver
  // https://docs.ens.domains/contract-developer-guide/resolving-names-on-chain
  // but it is not deployed on Mumbai
  // let result = await streamBalanceOf.balanceOf(sender);

  let result = await streamBalanceOf.testFun(sender, receiver);
  console.log(
    `On-chain contract says there are ${result} flows from ${sender} to vitalik.eth`
  );
  return result > 0;
}

function ContractTest() {
  const [lensAddress, setLensAddress] = useState<string>("");
  const [hasFlow, setHasFlow] = useState<boolean>(false);

  const handleChange = (e: any) => {
    setLensAddress(e.target.value);
  };

  const handleClick = () => {
    console.log(
      `provider URL: ${process.env.NEXT_PUBLIC_MUMBAI_URL}${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
    );
    checkFlow(lensAddress as `0x${string}`).then((response) => {
      setHasFlow(response);
    });
  };
  let message;

  if (hasFlow) {
    message = (
      <div>
        <p>
          This address has at least one Supertoken flow towards{" "}
          <b>vitalik.eth</b>
        </p>
      </div>
    );
  } else {
    message = (
      <div>
        <p>
          This address does not have any Supertoken flows towards{" "}
          <b>vitalik.eth</b>
        </p>
      </div>
    );
  }

  return (
    <main className="bg-gray-100 min-h-screen">
      <div className="relative flex items-center justify-center h-screen flex-col rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none">
        <h4 className="block font-sans text-2xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
          Verify Supertoken flows towards <b>vitalik.eth</b>
        </h4>
        <p className="mt-1 block font-sans text-base font-normal leading-relaxed text-gray-700 antialiased">
          Enter the sender&apos;s address to verify if he has an active Flow
          towards <b>vitalik.eth</b>
        </p>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          <div className="mb-4 flex flex-col gap-6">
            <div className="relative h-11 w-full min-w-[200px]">
              <input
                className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                type="text"
                value={lensAddress}
                onChange={handleChange}
              />
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-blue-400 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Eth Address
              </label>
            </div>
          </div>
          <button
            className="mt-6 block w-full select-none rounded-lg bg-blue-400 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-400/20 transition-all hover:shadow-lg hover:shadow-blue-400/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            data-ripple-light="true"
            onClick={() => handleClick()}
          >
            Verify Supertoken Flow
          </button>
          <div className="mt-4 block text-center font-sans text-base font-normal leading-relaxed text-gray-700 antialiased">
            {message}
          </div>
        </form>
      </div>
    </main>
  );
}

export default ContractTest;
