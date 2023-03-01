import { ethers } from "hardhat";
async function main() {
    const accounts = await ethers.getSigners();
    const maker = accounts[2];
    const contract = await ethers.getContractAt("OrbiterXRouter", String(process.env['OrbiterXRouter']));
    const contrctAddr = contract.address;
    const makerAddress = maker.address;
    console.log('OrbiterXRouter: ', contract.address);
    const tokens = ["0x6b56404816A1CB8ab8E8863222d8C1666De942d5", "0x1c8f9D9C1D74c38c8Aeb5033126EA1133728b32f", "0xFEf68eb974c562B0dCBF307d9690e0BD10e35cEa"];
    for (const tokenAddr of tokens) {
        const tokenContract = await ethers.getContractAt('TestToken', tokenAddr);
        console.log(await tokenContract.symbol());
        const allowance = await tokenContract.allowance(makerAddress, contrctAddr);
        console.log('allowance:', allowance.toString());
        const balance = await tokenContract.balanceOf(makerAddress);
        console.log('balance:', balance.toString());
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
