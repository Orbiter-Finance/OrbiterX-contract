import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from 'dotenv';
import "@matterlabs/hardhat-zksync";
dotenv.config();

const config: HardhatUserConfig = {
  defaultNetwork: "sophonMainnet",
  networks: {
    sophonMainnet: {
      url: "https://rpc.sophon.xyz",
      ethNetwork: "mainnet",
      verifyURL: "https://verification-explorer.sophon.xyz/contract_verification",
      browserVerifyURL: "https://explorer.sophon.xyz/",
      enableVerifyURL: true,
      zksync: true,
      accounts: [process.env.WALLET_PRIVATE_KEY as string]
    },
    sophonTestnet: {
      url: "https://rpc.testnet.sophon.xyz",
      ethNetwork: "sepolia",
      verifyURL: "https://api-explorer-verify.testnet.sophon.xyz/contract_verification",
      browserVerifyURL: "https://explorer.testnet.sophon.xyz/",
      enableVerifyURL: true,
      zksync: true,
      accounts: [process.env.WALLET_PRIVATE_KEY as string]
    },
    zeroTestnet: {
      url: 'https://rpc.zerion.io/v1/zero-sepolia',
      zksync: true,
      ethNetwork: 'sepolia',
      verifyURL: 'https://api-explorer.zero.network/contract/contract_verification'
    },
    zero: {
      url: 'https://rpc.zerion.io/v1/zero',
      zksync: true,
      ethNetwork: 'mainnet',
      verifyURL: 'https://zero-network.calderaexplorer.xyz/verification/contract_verification'
    },
    zkSyncSepoliaTestnet: {
      url: "https://sepolia.era.zksync.dev",
      ethNetwork: "sepolia",
      zksync: true,
      verifyURL: "https://explorer.sepolia.era.zksync.dev/contract_verification",
    },
    zkSyncMainnet: {
      url: "https://mainnet.era.zksync.io",
      ethNetwork: "mainnet",
      zksync: true,
      verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
    },
    dockerizedNode: {
      url: "http://localhost:3050",
      ethNetwork: "http://localhost:8545",
      zksync: true,
    },
    inMemoryNode: {
      url: "http://127.0.0.1:8011",
      ethNetwork: "localhost", // in-memory node doesn't support eth node; removing this line will cause an error
      zksync: true,
    },
    hardhat: {
      zksync: true,
    },
  },
  etherscan: {
    enabled: true,
    apiKey: {
      sophonTestnet:'9VD7ZM97DFEWCT5YD9U8J9A6QCNRKF92VW',
      sophonMainnet:'9VD7ZM97DFEWCT5YD9U8J9A6QCNRKF92VW',
    },
    customChains: [
      {
        network: "sophonTestnet",
        chainId: 531050104,
        urls: {
          apiURL: "https://api-testnet.sophscan.xyz/api",
          browserURL: "https://testnet.sophscan.xyz",
        },
      },
      {
        network: "sophonMainnet",
        chainId: 50104,
        urls: {
          apiURL: "https://api.sophscan.xyz/api",
          browserURL: "https://sophscan.xyz",
        },
      },
    ],
  },
  zksolc: {
    version: "latest",
    settings: {
      // find all available options in the official documentation
      // https://docs.zksync.io/build/tooling/hardhat/hardhat-zksync-solc#configuration
    },
  },
  solidity: {
    version: "0.8.27",
  },
};

export default config;
