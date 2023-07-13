import { ethers } from "hardhat";
async function main() {
    const accounts = await ethers.getSigners();
    const maker = accounts[0];
    console.log(maker.address, '==maker');
    const contract = await ethers.getContractAt("OrbiterXRouter","0x2096D6DD537CF7A7ee1662BBbEc8C2809fCf2647");
    const contrctAddr = contract.address;
    console.log('OrbiterXRouter: ', contract.address);
    await contract.changeMaker("0x4eAF936c172b5e5511959167e8Ab4f7031113Ca3", true);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
