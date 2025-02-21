import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import {metaMask } from 'wagmi/connectors'
import { defineChain } from 'viem';

// export const ganache = defineChain({
//   id: 1337,
//   name: 'Ganache Local',
//   network: 'ganache',
//   nativeCurrency: {
//     name: 'Ether',
//     symbol: 'ETH',
//     decimals: 18,
//   },
//   rpcUrls: {
//     default: {
//       http: ['HTTP://127.0.0.1:7545'],
//     },
//     public: {
//       http: ['HTTP://127.0.0.1:7545'],
//     },
//   },
//   blockExplorers: {
//     default: { name: 'Ganache Explorer', url: 'HTTP://127.0.0.1:7545' },
//   },
//   testnet: true,
// });

export const config = createConfig({
  chains: [sepolia],
  // chains: [mainnet, sepolia, ganache],
  connectors: [
    metaMask(),
    // injected(),
    // coinbaseWallet(),
    // walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    // [ganache.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
