import hre from "hardhat";

async function main() {
  const orbiterRouter = await hre.viem.deployContract("OrbiterRouter");
  console.log(
    `orbiterRouter with deployed to ${orbiterRouter.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
