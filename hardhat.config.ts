import 'dotenv/config';

// zksync
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import { HardhatUserConfig } from "hardhat/config";
import 'hardhat-contract-sizer';

// zksync verify
// import "@matterlabs/hardhat-zksync-verify";

// others verify
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";

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
    lineaTestnet: {
      url: 'https://rpc.goerli.linea.build',
      accounts
    },
    mantleTestnst: {
      url: 'https://rpc.testnet.mantle.xyz',
      accounts
    },
    mantle: {
      url: 'https://rpc.mantle.xyz',
      accounts
    },
    linea: {
      url: '',
      accounts
    },
    test: {
      url: 'http://ec2-54-178-23-104.ap-northeast-1.compute.amazonaws.com:8545',
      accounts
    },
    baseTest: {
      url: 'https://goerli.base.org',
      accounts
    },
    base: {
      url: 'https://base.blockpi.network/v1/rpc/public',
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
      url: `https://optimism-goerli.public.blastapi.io`,
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
    scroll: {
      url: `https://rpc.scroll.io`,
      accounts
    },
    scrollSepolia: {
      url: `https://sepolia-rpc.scroll.io`,
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
    polygonZKEVMTestnet: {
      url: "https://rpc.public.zkevm-test.net",
      accounts
    },
    polygon: {
      url: `https://polygon-bor.publicnode.com`,
      accounts
    },
    zksyncEra: {
      url: `https://mainnet.era.zksync.io`,
      accounts,
      zksync: true,
      ethNetwork: 'mainnet',
      // verifyURL: 'https://zksync2-mainnet-explorer.zksync.io/contract_verification'
    },
    zksyncEraSepolia: {
      url: `https://sepolia.era.zksync.dev`,
      accounts,
      zksync: true,
      ethNetwork: 'sepolia'
    },
    zksyncEraGoerli: {
      url: `https://testnet.era.zksync.dev`,
      accounts,
      zksync: true,
      ethNetwork: 'goerli',
    },
  },
  zksolc: {
    version: "1.3.18", // Uses latest available in https://github.com/matter-labs/zksolc-bin/
    settings: {},
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      goerli: process.env['ETHERSCAN_API_KEY'] || '',
      base: process.env['BASESCAN_API_KEY'] || '',
      baseTest: process.env['BASESCAN_API_KEY'] || ''
    },
    customChains: [
      {
        network:'baseTest',
        chainId: 84531,
        urls: {
          apiURL: 'https://api-goerli.basescan.org/api',
          browserURL: 'https://goerli.basescan.org'
        }
      },
      {
        network:'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org'
        }
      }
    ]
  }
};

export default config;
