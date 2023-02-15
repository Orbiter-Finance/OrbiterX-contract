import { ethers } from "hardhat";
async function main() {
    const accounts = await ethers.getSigners();
    const maker = accounts[1];
    const contract = await ethers.getContractAt("OrbiterXRouter", String(process.env['OrbiterXRouter']));
    const contrctAddr = contract.address;
    console.log('OrbiterXRouter: ', contract.address);
    const tokens = ["TokenAddr......"];
    for (const tokenAddr of tokens) {
        const tokenContract = await ethers.getContractAt('TestToken', tokenAddr);
        const totalSupply = await tokenContract.totalSupply();
        const tx = await tokenContract.connect(maker).approve(contrctAddr, totalSupply, {
        });
        await tx.wait();
        console.log(tx.hash, 'approve success');
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
