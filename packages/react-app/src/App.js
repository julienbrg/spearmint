// import { useQuery } from "@apollo/client";
import { Contract } from "@ethersproject/contracts";
import { shortenAddress, useCall, useEthers, useLookupAddress } from "@usedapp/core";
import React, { useEffect, useState } from "react";

import { Body, Button, Container, Header, Image, Link } from "./components";
import logo from "./lode-runner.png";
import { Mint } from "./components/mint.tsx";

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

  const { value: bal } =
  useCall({
      contract: new Contract(addresses.nft, abis.erc721),
      method: "balanceOf",
      args: ["0xbFBaa5a59e3b6c06afF9c975092B8705f804Fa1c"],
  }) ?? {};


  // https://testnets.opensea.io/assets/0x61681514ea040d19dc4279301adc10bf654d886a/10
  // https://ipfs.io/ipfs/bafybeib3shisi64rroc2oedae2ehtzmtua2l4yhatiexihs6cogllnwqvm/lode-runner.json

  // TODO: Fix .env
  function getAccessToken() {
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
    const obj = {
      "name": "Lode Runner #1",
      "author": "Julien",
      "description": "I'm a Lode Runner player since the age of six. With this amazing unique screenshot, I wanted to express the harsh of the struggle against the ever-growing threat of machines taking over our lives, a super important issue that mankind is facing today. My character is stuck. Let's just reboot everything.",
      "size": "708 by 762 pixels",
      "media_format": "jpg",
      "image": "https://bafkreifmcnnbun3avt2pigr2m2e46pqtftlilcz7a3cn2zhgzvppttgpm4.ipfs.dweb.link",
      "license": "无", // add the license here
      "attributes": [
        {
          "trait_type": "Minted on",
          "value": "Spearmint"
        },
        {
          "trait_type": "License type",
          "value": "无" // add the license type here e.g. "Public use for all purposes + Right to adapt + Right to add a logo + Merchandising rights"
        },
        {
          "trait_type": "Resale rights",
          "value": "8"
        },
        {
          "trait_type": "View licence",
          "value": "无" // add the license here
        }
      ]
    };
    const blob = new Blob([JSON.stringify(obj)], {type : 'application/json'});
  
    const files = [
      new File(['contents-of-file-1'], 'plain-utf8.txt'),
      new File([blob], 'lode-runner.json')
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

  async function mint() {
    console.log("Hello! 👋 ");
    makeStorageClient();
    const uri = await storeFiles(makeFileObjects()) + "/lode-runner.json";
    console.log("uri: ", uri );
    // TODO: safeMint call 
    // https://usedapp-docs.netlify.app/docs/guides/typed-contracts 
    await Mint(uri);
  }

  return (
    <Container>
      <Header>
        <WalletButton />
      </Header>
      <Body>
        <Image src={logo} alt="lode-runner" />
        <p>NFT contract address: < br/><strong>{addresses.nft}</strong></p>
        <div>
          {bal && <p>You own <strong>{bal.toString()}</strong> of these. </p>}          
        </div>
        <Link href="https://testnets.opensea.io/assets/0x61681514eA040d19dC4279301aDC10bf654D886A/5">
          Check on OpenSea
        </Link>
        <p></p>
        <Button onClick={mint}>
          Mint
        </Button>
        
        <Link href="https://github.com/julienbrg/spearmint">
          Github repo
        </Link>
      </Body>
    </Container>
  );
}

export default App;
