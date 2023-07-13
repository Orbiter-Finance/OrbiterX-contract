import { ethers } from "hardhat";
import { OrbiterXRouter } from "../typechain-types";
import { deploy } from "./utils";
import { OrbiterXRouterV3 } from "../typechain-types/contracts/OrbiterXRouterV3.sol";
import RLP from "rlp";

async function main() {
    const accounts = await ethers.getSigners();
    const owner = accounts[0];
    const maker = accounts[1];

    const contract = await ethers.getContractAt('OrbiterXRouterV3', '0x5973ef577a1c873521665ae7d6875c493e409296')
    console.log('OrbiterXRouterV3: ', contract.address);
    const detail = [];
    for (let i = 1; i <= 5; i++) {
        detail.push({
            to: maker.address,
            token: "0x",
            value: ethers.BigNumber.from('100000000000')
        })
    }
    let total = ethers.BigNumber.from(0);
    const compressedDetails = detail.map(item => {
        if (item.token === '0x') {
            total = total.add(item.value);
        }
        const params = [item.to,
        item.token,
        ethers.utils.hexlify(item.value)]
        return RLP.encode(params);
    });
    const encodeData = RLP.encode(compressedDetails);
    console.log(encodeData, '==encodeData')
    const swapOkTx = await contract.connect(owner).transfer(encodeData, {
        value: total
    });
    const tx = await swapOkTx.wait();
    console.log(tx.gasUsed, '===gasUser')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
