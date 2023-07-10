"use client";
import SuperfluidWidget, {
  PaymentDetails,
  supportedNetworks,
} from "@superfluid-finance/widget";
import superTokenList from "@superfluid-finance/tokenlist";
import React, { useState, useMemo } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal, useWeb3Modal } from "@web3modal/react";
import axios from "axios";

import { productDetails, paymentDetails, layout, theme } from "../../widget.json";

const projectId = "952483bf7a0f5ace4c40eb53967f1368";

const { publicClient } = configureChains(supportedNetworks, [
  w3mProvider({ projectId }),
]);

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: w3mConnectors({
    projectId,
    chains: supportedNetworks,
  }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, supportedNetworks);

const getGraphQLOptions = (lensAddress: `0x${string}` | undefined) => {
  const headers = {
    "content-type": "application/json",
  };

  const requestBody = {
    query: `
    query Profiles($address: EthereumAddress!) {
      profiles(request: { ownedBy: [$address], limit: 10 }) {
        items {
          id
          handle
        }
        pageInfo {
          totalCount
        }
      }
    }`,
    variables: { address: lensAddress }, // 0xa1a66CC5d309F19Fb2Fda2b7601b223053d0f7F4
  };

  const graphQLOptions = {
    method: "POST",
    url: process.env.NEXT_PUBLIC_LENS_API_URL || "https://api-mumbai.lens.dev", // "https://api-mumbai.lens.dev",
    headers,
    data: requestBody,
  };

  return graphQLOptions;
};

type LensProfileInterface = {
  id: `0x${string}`;
  handle: string;
};

function App() {
  const [lensAddress, setLensAddress] = useState<string>("");
  const [lensProfiles, setLensProfiles] = useState<LensProfileInterface[]>([]);

  const handleChange = (e: any) => {
    setLensAddress(e.target.value);
  };

  const handleClick = () => {
    try {
      axios(getGraphQLOptions(lensAddress as `0x${string}`)).then(
        (response) => {
          setLensProfiles(response.data.data.profiles.items);
          paymentDetails.paymentOptions[0].receiverAddress =
            (lensAddress as `0x${string}`) ||
            paymentDetails.paymentOptions[0].receiverAddress;
          console.log(paymentDetails)
        }
      );
    } catch (err) {
      console.log("ERROR DURING AXIOS REQUEST", err);
    }
  };

  const { open, isOpen } = useWeb3Modal();
  const walletManager = useMemo(
    () => ({
      open,
      isOpen,
    }),
    [open, isOpen]
  );

  let message;

  if (lensProfiles.length > 0) {
    message = (
      <div>
        <p>This address has at least one Lens Handle</p>
        <WagmiConfig config={wagmiConfig}>
          <SuperfluidWidget
            // layout={layout}
            // theme={theme}
            productDetails={productDetails}
            paymentDetails={paymentDetails as PaymentDetails}
            tokenList={superTokenList}
            type="drawer"
            walletManager={walletManager}
          >
            {({ openModal }) => (
                <button
                className="mt-6 block w-full select-none rounded-lg bg-blue-600 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                data-ripple-light="true"
                onClick={() => openModal()}
              >
                Create a stream of fUSDCx towards {lensProfiles.at(0)?.handle}
              </button>
            )}
          </SuperfluidWidget>
        </WagmiConfig>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </div>
    );
  } else {
    <div>
      <p>This address does not have any Lens Handles</p>
    </div>;
  }
  return (
    <main className="bg-gray-100 min-h-screen">
      <div className="relative flex items-center justify-center h-screen flex-col rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none">
        <h4 className="block font-sans text-2xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
          Create USDCx Stream
        </h4>
        <p className="mt-1 block font-sans text-base font-normal leading-relaxed text-gray-700 antialiased">
          Enter the recepient&apos;s address to verify if he&apos;s a Lens handle holder
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
            Verify Lens Handles
          </button>
          <div className="mt-4 block text-center font-sans text-base font-normal leading-relaxed text-gray-700 antialiased">
            {message}
          </div>
        </form>
      </div>
    </main>
  );
}

export default App;
