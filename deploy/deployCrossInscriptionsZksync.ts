import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Wallet } from "zksync-ethers";

// Shell: yarn hardhat deploy-zksync --network zksyncEraGoerli --script deployCrossInscriptionsZksync.ts
export default async function (hre: HardhatRuntimeEnvironment) {
  const accounts = process.env.ACCOUNTS?.split(",") || [];
  const contractName = "CrossInscriptions";
  const wallet = new Wallet(accounts[0]);

  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact(contractName);

  const contract = await deployer.deploy(artifact);

  console.log(`${contractName} deployed to: ${contract.address}`);
}
