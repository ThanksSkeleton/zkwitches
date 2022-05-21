
import 'dotenv/config' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from 'express'

export type ChainInfo =
{
  connection : ChainInfoInner
  shortName: string,
  longName : string,
  address: string,
  addHyperlink: string,
  getCoinsHyperlink: string
}

export type ChainInfoInner =
{
  chainId: string,
  chainName: string,
  nativeCurrency: CurrencyInfo,
  rpcUrls: string[],
  blockExplorerUrls: string[],
}

export type CurrencyInfo =
{
  name: string,
  symbol: string,
  decimals: number
}

const harmonyProductionChain : ChainInfo = 
{
  connection: 
  {
    chainId:'0x63564c40',
    chainName: 'Harmony',
    nativeCurrency: {
      name: 'ONE',
      symbol: 'ONE',
      decimals: 18
    },
    rpcUrls: ['https://api.harmony.one'],
    blockExplorerUrls: ['https://explorer.harmony.one']
  },
  shortName: "HarmonyProd",
  longName: "Harmony Production",
  address: "0xA7EA651082212d43cd86A338F9bD7D98339b59BA",
  addHyperlink: "https://docs.harmony.one/home/general/wallets/browser-extensions-wallets/metamask-wallet/adding-harmony",
  getCoinsHyperlink: "https://www.finder.com/how-to-buy-harmony"
};

const harmonyTestnetChain : ChainInfo = 
{
  connection: 
  {
    chainId:'0x6357d2e0',
    chainName: 'Harmony Testnet',
    nativeCurrency: {
      name: 'ONE',
      symbol: 'ONE',
      decimals: 18
    },
    rpcUrls: ['https://api.s0.b.hmny.io'],
    blockExplorerUrls: ['https://explorer.pops.one']
  },
  shortName: "HarmonyTest",
  longName: "Harmony Testnet",
  address: "0xB6Ef32a400b06A8245D90c0B9C862ACbD3cEDE07",
  addHyperlink: "https://docs.harmony.one/home/general/wallets/browser-extensions-wallets/metamask-wallet/adding-harmony",
  getCoinsHyperlink: "https://faucet.pops.one/"
};

const localhost : ChainInfo = 
{
  connection: 
  {
    chainId:'0x539', // 1337
    chainName: 'Localhost',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['http://localhost:8545'],
    blockExplorerUrls: []
  },
  shortName: "localhost",
  longName: "localhost:8545",
  address: "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9",
  addHyperlink: "http://localhost:3030",
  getCoinsHyperlink: "http://localhost:3030"
}

const environments = [localhost, harmonyTestnetChain, harmonyProductionChain]

export function targetChain() : ChainInfo
{ 
  let envString = (process.env.REACT_APP_ZKWITCHES_ENVIRONMENT as string);
  
  if (envString == undefined)
  {
    console.log("no environment defined, defaulting to localhost");
    return localhost;
  }

  let matchingEnvironments = environments.filter(x => x.shortName == envString);
  if (matchingEnvironments.length == 0)
  {
    console.log("Unrecognized environment ", envString);
    console.log("defaulting to localhost");
    return localhost;
  } 
  else if (matchingEnvironments.length >= 2)
  {
    console.log("Multiple environments match ", envString);
    console.log("defaulting to localhost");
    return localhost;
  } 
  else 
  {
    return matchingEnvironments[0];
  }
}
