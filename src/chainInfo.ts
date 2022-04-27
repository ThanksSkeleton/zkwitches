const harmonyChain = 
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
  address: "0xa72325a1ad4b9145335aeb2fcba6ea6e2bbd85e0a32e155e489043b7fb737a96" // TODO FIX
};

const localhost = 
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
  address: "0xa72325a1ad4b9145335aeb2fcba6ea6e2bbd85e0a32e155e489043b7fb737a96"
}

export function targetChain(){ return localhost; }
