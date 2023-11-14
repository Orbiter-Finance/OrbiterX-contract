import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
  import { expect } from "chai";
  import hre from "hardhat";
  import { getAddress, parseGwei } from "viem";
  
  describe("OrbiterRouter", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployOrbiterRouterFixture() {
      const [owner, otherAccount] = await hre.viem.getWalletClients();
      const orbiterRouter = await hre.viem.deployContract("OrbiterRouter");
  
      const publicClient = await hre.viem.getPublicClient();
  
      return {
        orbiterRouter,
        owner,
        otherAccount,
        publicClient,
      };
    }
    it("Should deploy OrbiterRouter", async function () {
      const result = await loadFixture(deployOrbiterRouterFixture);
      expect(result).not.empty;
    });

  });
  