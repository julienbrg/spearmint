import React from 'react'

import { utils } from 'ethers'
import { Contract } from '@ethersproject/contracts'

import { useContractFunction } from '@usedapp/core'

import { Erc721 } from '../../gen/types'

// https://www.detroitlabs.com/blog/2018/02/28/adding-custom-type-definitions-to-a-third-party-library/
import { addresses, abis } from "@my-app/contracts";

const nftInterface = new utils.Interface(abis.erc721)
const nftContract = new Contract(addresses.nft, nftInterface) as Erc721

export const Mint = (uri) => {
  // TODO: Breaking the Rules of Hooks https://reactjs.org/warnings/invalid-hook-call-warning.html
  const { state, send } = useContractFunction(nftContract, 'safeMint')
  const onTx = async () => {
    await send(
      "0xbFBaa5a59e3b6c06afF9c975092B8705f804Fa1c", 
      uri
    )
  }
  onTx()
}