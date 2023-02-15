import { deploy, loadOrDeployContract } from "../scripts/utils";
import { expect } from 'chai';
import { TestToken } from "../typechain-types";
import { ethers } from "hardhat";
export async function getTokenContract() {
    const testToken = await loadOrDeployContract<TestToken>('TestToken', false, ethers.utils.parseEther('1000000'), 18, 'USDT');
    return testToken;
}
describe("Test Token", function () {

    it("Deploy", async function () {
        const testToken = await getTokenContract();
        expect(await testToken.address).not.empty;
    });
    it("Check Owner TestToken Balance", async function () {
        const testToken = await getTokenContract();
        const [owner, maker, user,user2] = await ethers.getSigners();
        console.log('owner:', owner.address);
        console.log('maker:', maker.address);
        console.log('user:', user.address);
        console.log('user2:', user2.address);
        
        const totalSupply = await testToken.totalSupply();
        expect(await testToken.balanceOf(owner.address)).eq(totalSupply);
    });

    it("Transfer TestToken To Maker", async function () {
        const [owner, maker] = await ethers.getSigners();
        const testToken = await getTokenContract();
        const sendValue = ethers.utils.parseEther('100');
        const balanceBefore = await testToken.balanceOf(owner.address);
        const transferTx = await testToken.connect(owner).transfer(maker.address, sendValue);
        await transferTx.wait().then((tx) => {
            expect(tx.events?.map((e: any) => e.event).includes('Transfer')).true;
            // expect(tx).to.emit(testToken, 'Transfer2').withArgs(owner.address, maker.address,sendValue );
        })
        expect(transferTx).not.empty;
        // 
        const balanceAfter = await testToken.balanceOf(owner.address);
        expect(balanceAfter).eq(balanceBefore.sub(sendValue));
        expect(await testToken.balanceOf(maker.address)).eq(sendValue);
    });
    it("Transfer TestToken To User", async function () {
        const [owner, _, user] = await ethers.getSigners();
        const testToken = await getTokenContract();
        const sendValue = ethers.utils.parseEther('100');
        const balanceBefore = await testToken.balanceOf(owner.address);
        const transferTx = await testToken.connect(owner).transfer(user.address, sendValue);
        await transferTx.wait().then((tx) => {
            expect(tx.events?.map((e: any) => e.event).includes('Transfer')).true;
            // expect(tx).to.emit(testToken, 'Transfer2').withArgs(owner.address, maker.address,sendValue );
        })
        expect(transferTx).not.empty;
        // 
        const balanceAfter = await testToken.balanceOf(owner.address);
        expect(balanceAfter).eq(balanceBefore.sub(sendValue));
        expect(await testToken.balanceOf(user.address)).eq(sendValue);
        
    });
    it("Check Maker TestToken Balance", async function () {
        const [owner, maker] = await ethers.getSigners();
        const testToken = await getTokenContract();
        const balance = await testToken.balanceOf(maker.address);

        const sendValue = ethers.utils.parseEther('100');
        expect(balance).eq(sendValue);
    });
   
});