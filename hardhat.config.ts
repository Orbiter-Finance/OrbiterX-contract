import 'dotenv/config';
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'hardhat-contract-sizer';
const { INFURA_API_KEY, ALCHEMY_KEY, NETWORK, ACCOUNTS } = process.env;
const accounts = ACCOUNTS?.split(',');
const config: HardhatUserConfig = {
  defaultNetwork: NETWORK  || 'hardhat',
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    ganache: {
      url: 'http://127.0.0.1:8545',
      accounts
    },
    test: {
      url: 'http://ec2-54-178-23-104.ap-northeast-1.compute.amazonaws.com:8545',
      accounts
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts
    },
    goerli: {
      url: `https://rpc.ankr.com/eth_goerli`,
      timeout: 1000 * 60 * 60 * 5,
      accounts,
    },
    arbitrum: {
      url: `https://endpoints.omniatech.io/v1/arbitrum/one/public`,
      accounts
    },
    arbitrumGoerli: {
      url: `https://goerli-rollup.arbitrum.io/rpc`,
      accounts
    },
    optimismGoerli: {
      url: `https://goerli.optimism.io`,
      accounts
    },
    optimism: {
      url: `https://mainnet.optimism.io`,
      accounts
    },
    mumbai: {
      url: `https://polygon-testnet.public.blastapi.io`,
      accounts
    },
    metisGoerli: {
      url: `https://goerli.gateway.metisdevops.link`,
      accounts
    },
    scrollGoerli: {
      url: `https://prealpha.scroll.io/l2`,
      accounts
    },
    bscTestnet: {
      url: `https://data-seed-prebsc-1-s2.binance.org:8545`,
      accounts
    },
    polygonZKEVM: {
      url: "https://rpc.public.zkevm-test.net",
      accounts
    },
    polygon: {
      url: `https://polygon-bor.publicnode.com`,
      accounts
    },
  },
};

export default config;
