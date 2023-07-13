import { ethers } from "hardhat";
import { deploy } from "./utils";
import { OBSource } from "../typechain-types/contracts/OBSource.sol";

async function main() {
  const accounts = await ethers.getSigners();
  const owner = accounts[0];

  const contract = await deploy<OBSource>(false, 'OBSource')
  console.log('owner: ', owner.address);
  console.log('OBSource Contract: ', contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
