import { ethers } from "hardhat";
import { deploy } from "./utils";
import { OrbiterXRouter } from "../typechain-types/contracts/OrbiterXRouter.sol";

async function main() {
  const accounts = await ethers.getSigners();
  const owner = accounts[0];

  const contract = await deploy<OrbiterXRouter>(false, 'OrbiterXRouter')
  console.log('owner: ', owner.address);
  console.log('OrbiterXRouter Contract: ', contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
