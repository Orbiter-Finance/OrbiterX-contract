import { Wallet } from "zksync-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { vars } from "hardhat/config";
import dotenv from "dotenv";
dotenv.config();


// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script`);

  // Initialize the wallet using your private key.
  const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY!);

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  // Load contract
  const artifact = await deployer.loadArtifact("QuestReward");

  // Deploy this contract. The returned object will be of a `Contract` type,
  // similar to the ones in `ethers`.
  const tokenContract = await deployer.deploy(artifact,["0x2357a0d0f474e396dd622604869cdba48a62beb2"]);

  console.log(
    `${
      artifact.contractName
    } was deployed to ${await tokenContract.getAddress()}`
  );
}