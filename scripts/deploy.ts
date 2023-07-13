import { ethers } from "hardhat";
import { OrbiterXRouter } from "../typechain-types";
import { deploy } from "./utils";
import { OrbiterXRouterV3 } from "../typechain-types/contracts/OrbiterXRouterV3.sol";

async function main() {
  const accounts = await ethers.getSigners();
  const owner = accounts[0];
  const maker = accounts[1];

  const contract = await deploy<OrbiterXRouterV3>(false, 'OrbiterXRouterV3')
  console.log('OrbiterXRouterV3: ', contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
