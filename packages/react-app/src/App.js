// import { useQuery } from "@apollo/client";
import { Contract } from "@ethersproject/contracts";
import { shortenAddress, useCall, useEthers, useLookupAddress } from "@usedapp/core";
import React, { useEffect, useState } from "react";

import { Body, Button, Container, Header, Image, Link } from "./components";
import logo from "./lode-runner.png";

import { addresses, abis } from "@my-app/contracts";
// import GET_TRANSFERS from "./graphql/subgraph";

import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';

function WalletButton() {
  const [rendered, setRendered] = useState("");

  const ens = useLookupAddress();
  const { account, activateBrowserWallet, deactivate, error } = useEthers();

  useEffect(() => {
    if (ens) {
      setRendered(ens);
    } else if (account) {
      setRendered(shortenAddress(account));
    } else {
      setRendered("");
    }
  }, [account, ens, setRendered]);

  useEffect(() => {
    if (error) {
      console.error("Error while connecting wallet:", error.message);
    }
  }, [error]);

  return (
    <Button
      onClick={() => {
        if (!account) {
          activateBrowserWallet();
        } else {
          deactivate();
        }
      }}
    >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </Button>
  );
}

function App() {

  // Read more about useDapp on https://usedapp.io/
  const { value: ownerOf } =
    useCall({
       contract: new Contract(addresses.nft, abis.erc721),
       method: "ownerOf",
       args: ["0"],
    }) ?? {};

  // const { loading, error: subgraphQueryError, data } = useQuery(GET_TRANSFERS);

  // useEffect(() => {
  //   if (subgraphQueryError) {
  //     console.error("Error while querying subgraph:", subgraphQueryError.message);
  //     return;
  //   }
  //   if (!loading && data && data.transfers) {
  //     console.log({ transfers: data.transfers });
  //   }
  // }, [loading, subgraphQueryError, data]);

  // TO DO: fix .env
  function getAccessToken() {
    // Get your own API token at https://web3.storage/account/

    console.log("getAccessToken ✅")
    console.log("process.env.REACT_APP_WEB3STORAGE_TOKEN = ", process.env.REACT_APP_WEB3STORAGE_TOKEN, "😿")

    // return process.env.REACT_APP_WEB3STORAGE_TOKEN;
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEVFYkNDMTBGMDE2MUM1YzU4YzE5MmM3RjgxZmIzRjVGNDhmZDAwQkYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDgyOTU2NDA5NzcsIm5hbWUiOiJTcGVhcm1pbnQifQ.duFDn6u1LA7dYPFLZDI6cEvbfFEoS272PvdC4nT6U6g";
    
  }
  
  function makeStorageClient() {
    console.log("makeStorageClient ✅ ");
    return new Web3Storage({ token: getAccessToken() });
  }

  function makeFileObjects() {
    console.log("makeFileObjects ✅ ");
    // You can create File objects from a Blob of binary data
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
    // Here we're just storing a JSON object, but you can store images,
    // audio, or whatever you want!
    const obj = { game: 'Lode Runner' };
    const blob = new Blob([JSON.stringify(obj)], {type : 'application/json'});
  
    const files = [
      new File(['contents-of-file-1'], 'plain-utf8.txt'),
      new File([blob], 'hello.json')
    ];
    return files;
  }

  async function storeFiles(files) {
    console.log("storeFiles ✅ ");
    const client = makeStorageClient();
    const cid = await client.put(files);
    console.log('stored files with CID ✅: ', cid, "🎉");
    return cid;
  }

  async function play() {
    console.log("Hello! 👋 ");
    makeStorageClient();
    storeFiles(makeFileObjects());
  }

  return (
    <Container>
      <Header>
        <WalletButton />
      </Header>
      <Body>
        <Image src={logo} alt="lode-runner" />
        <p></p>
        <div>
        {ownerOf && <p>Owner of ID 0: {ownerOf}</p>}
      </div>
        <Button onClick={play}>
          Mint
        </Button>
        {/* <Button onClick={getAccessToken}>
          getAccessToken
        </Button> */}
        <p></p>
        <Link href="https://github.com/julienbrg/spearmint">
          Github repo
        </Link>
      </Body>
    </Container>
  );
}

export default App;
