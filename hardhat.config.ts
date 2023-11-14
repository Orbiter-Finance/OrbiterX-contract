import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import {loadNetworks} from './scripts/utils/network'
const networksNames = ['goerli', 'arbitrumGoerli', 'optimismGoerli'];
const config: HardhatUserConfig = {
  solidity: "0.8.22",
  defaultNetwork: "hardhat",
  networks: loadNetworks(networksNames),
};

export default config;
