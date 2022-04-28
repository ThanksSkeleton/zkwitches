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
  address: "0xE67d92E3fbd9Cb4BC90d58D768D199DB10BB0216" 
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
  address: "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9"
}

export function targetChain(){ return harmonyChain; }
