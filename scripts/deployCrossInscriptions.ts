import { ethers } from "hardhat";
import { deploy } from "./utils";
import { CrossInscriptions__factory } from "../typechain-types";

async function main() {
  const accounts = await ethers.getSigners();
  const owner = accounts[0];

  const crossInscriptions = await new CrossInscriptions__factory(
    owner
  ).deploy();
  console.log("crossInscriptions.address:", crossInscriptions.address);
  await crossInscriptions.deployed();

  console.log("owner: ", owner.address);
  console.log("Done:", new Date());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
