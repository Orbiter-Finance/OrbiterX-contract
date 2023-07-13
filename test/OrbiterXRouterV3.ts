import { TestToken } from '../typechain-types/contracts/TestToken';
import { loadOrDeployContract, printSuccess } from "../scripts/utils";
import { expect } from 'chai';
import { OrbiterXRouter, OrbiterXRouterV3 } from "../typechain-types";
import { ethers } from "hardhat";
import { getTokenContract } from "./TestToken";
import { SwapOrder, SwapOrderType } from "./types";
import { RLP } from '@ethereumjs/rlp'
import { arrToBufArr, bufArrToArr } from '@ethereumjs/util'
export async function getOrbiterBridge() {
    const [owner, maker] = await ethers.getSigners();
    const bridge = await loadOrDeployContract<OrbiterXRouterV3>('OrbiterXRouterV3', false);
    return bridge;
}
describe("OrbiterBridge", function () {
    describe("Approve", function () {
        it("Maker TestToken Approve XVM", async function () {
            const [owner, maker] = await ethers.getSigners();
            const testToken = await getTokenContract();
            const totalSupply = await testToken.totalSupply();
            const orbiterBridge = await getOrbiterBridge();
            const approveTx = await testToken.connect(maker).approve(orbiterBridge.address, totalSupply);
            await approveTx.wait();
            expect(await approveTx.hash).not.empty;
        });
        it("Check Maker TestToken Approve XVM Balance", async function () {
            const [owner, maker] = await ethers.getSigners();
            const testToken = await getTokenContract();
            const xvm = await getOrbiterBridge();
            const allowance = await testToken.allowance(maker.address, xvm.address);
            const totalSupply = await testToken.totalSupply();
            expect(allowance).eq(totalSupply);
        });
        it("User TestToken Approve XVM", async function () {
            const [owner, _, user] = await ethers.getSigners();
            const testToken = await getTokenContract();
            const totalSupply = await testToken.totalSupply();
            const orbiterBridge = await getOrbiterBridge();
            const approveTx = await testToken.connect(user).approve(orbiterBridge.address, totalSupply);
            await approveTx.wait();
            expect(await approveTx.hash).not.empty;
        });
        it("Check User TestToken Approve XVM Balance", async function () {
            const [owner, _, user] = await ethers.getSigners();
            const testToken = await getTokenContract();
            const bridge = await getOrbiterBridge();
            const allowance = await testToken.allowance(user.address, bridge.address);
            const totalSupply = await testToken.totalSupply();
            expect(allowance).eq(totalSupply);
        });

    })

    describe("Deployment", function () {
        it("Deploy", async function () {
            const contract = await getOrbiterBridge();
            expect(await contract.address).not.empty;

        });
    });
    describe("Swap", function () {
        let swapOrder: any;
        before(async () => {
            const [owner, maker, user] = await ethers.getSigners();
            swapOrder = {
                chainId: 5,
                hash: "",
                from: maker.address,
                to: user.address,
                token: "0x0000000000000000000000000000000000000000",
                value: ethers.utils.parseEther('1').toString(),
                calldata: {
                    chainId: 22,
                    hash: '',
                    token: '0x0000000000000000000000000000000000000000',
                    timestamp: Date.now(),
                    value: ethers.utils.parseEther('1').toString()
                },
                type: SwapOrderType.None
            }
        });

        // it("Swap (MainToken)", async function () {
        //     const contract = await getOrbiterBridge();
        //     const sendValue = ethers.BigNumber.from(swapOrder.calldata.value);
        //     const [_, maker, user] = await ethers.getSigners();
        //     const rlpData1 = RLP.encode([
        //         maker.address,
        //         '0x',
        //         ethers.utils.hexlify(sendValue),
        //         swapOrder.chainId,
        //         swapOrder.token
        //     ])
        //     const swapTx = await contract.connect(user)['transfer(bytes)'](RLP.encode([rlpData1]), {
        //         value: sendValue
        //     })
        //     await swapTx.wait();
        //     swapOrder.calldata.hash = swapTx.hash;
        // });
        // it("Swap (TestToken)1", async function () {
        //     const testToken = await getTokenContract();
        //     // 
        //     const [_, maker, user] = await ethers.getSigners();
        //     swapOrder = {
        //         chainId: 5,
        //         hash: "",
        //         from: maker.address,
        //         to: user.address,
        //         token: testToken.address,
        //         value: ethers.utils.parseEther('1').toString(),
        //         calldata: {
        //             chainId: 22,
        //             hash: '',
        //             token: testToken.address,
        //             timestamp: Date.now(),
        //             value: ethers.utils.parseEther('1').toString()
        //         },
        //         type: SwapOrderType.None
        //     }
        //     const bridge = await getOrbiterBridge();
        //     const sendValue = ethers.BigNumber.from(swapOrder.calldata.value);
        //     const toChainId = ethers.utils.hexlify(swapOrder.chainId);
        //     // const calldata = [toChainId,
        //     //   swapOrder.token,
        //     //   swapOrder.to]
        //     const rlpData1 = RLP.encode([
        //         maker.address,
        //         swapOrder.calldata.token,
        //         ethers.utils.hexlify(sendValue),
        //         swapOrder.chainId,
        //         swapOrder.token,
        //         swapOrder.to
        //     ])
        //     const swapTx = await bridge.connect(user)['transfer(bytes)'](RLP.encode([rlpData1]), {
        //         value: ethers.BigNumber.from(0)
        //     })
        //     await swapTx.wait();
        //     swapOrder.calldata.hash = swapTx.hash;
        // });
        // it("Swap (TestToken)", async function () {
        //     const testToken = await getTokenContract();
        //     // 
        //     const [_, maker, user] = await ethers.getSigners();
        //     swapOrder = {
        //       chainId: 5,
        //       hash: "",
        //       from: maker.address,
        //       to: user.address,
        //       token: testToken.address,
        //       value: ethers.utils.parseEther('1').toString(),
        //       calldata: {
        //         chainId: 22,
        //         hash: '',
        //         token: testToken.address,
        //         timestamp: Date.now(),
        //         value: ethers.utils.parseEther('1').toString()
        //       },
        //       type: SwapOrderType.None
        //     }
        //     const bridge = await getOrbiterBridge();
        //     const sendValue = ethers.BigNumber.from(swapOrder.calldata.value);
        //     // const toChainId = ethers.utils.hexlify(swapOrder.chainId);
        //     const encoded = RLP.encode([Number(swapOrder.chainId), swapOrder.token, swapOrder.to]) // 
        //     console.log(Buffer.from(encoded).toString('hex'), '==encoded')
        //     const swapTx = await bridge.connect(user).swap(maker.address, swapOrder.calldata.token, sendValue, encoded, {
        //       value: ethers.BigNumber.from(0)
        //     })
        //     await swapTx.wait();
        //     swapOrder.calldata.hash = swapTx.hash;
        //   });
      
        // it("Swap Ok aggregation", async function () {
        //     const bridge = await getOrbiterBridge();
        //     // const testToken = await getTokenContract();
        //     const [_, maker, user1] = await ethers.getSigners();
        //     const detail = [];
        //     let total = ethers.BigNumber.from(0);
        //     for (let i = 1; i <= 10; i++) {
        //         detail.push({
        //             to: user1.address,
        //             token: "0x",
        //             value: ethers.BigNumber.from('2000000000000000000')
        //         })
        //         total = total.add(ethers.BigNumber.from('2000000000000000000'))
        //     }
        //     const compressedDetails = detail.map(item => {
        //         const params = [item.to, item.token, ethers.utils.hexlify(item.value)]
        //         return RLP.encode(params);
        //     });
        //     const swapOkTx = await bridge.connect(maker)['transfer(bytes)'](RLP.encode(compressedDetails), {
        //         value: total
        //     });
        //     await swapOkTx.wait();
        // });
        it("Transfers ETH", async function () {
            const bridge = await getOrbiterBridge();
            // const testToken = await getTokenContract();
            const [_, maker, user1] = await ethers.getSigners();
            const toAddr = [];
            const toValues = [];
            let total = ethers.BigNumber.from(0);
            for (let i = 1; i <= 1; i++) {
                toValues.push('2000000000000000000');
                toAddr.push(user1.address);
                total = total.add(ethers.BigNumber.from("2000000000000000000"))
            }
            const swapOkTx = await bridge.connect(maker).transfers(toAddr, toValues, {
                value: total
            });
            const tx = await swapOkTx.wait();
            console.log(tx.gasUsed, '===gasUser')
            // const userBalanceAfter = await bridge.provider.getBalance(detail.to);
            // expect(userBalanceAfter).eq(userBalanceBefore.add(detail.value.mul(2)))
            // await bridge.connect(maker).swapAnswer(detail.to, detail.token,  detail.value,'0xdb39db11f268f10b2a62e0805b435148', { value: detail.value.mul(2) })
        });
        it("Transfers Token", async function () {
            const bridge = await getOrbiterBridge();
            // const testToken = await getTokenContract();
            const [_, maker, user1] = await ethers.getSigners();
            const toAddr = [];
            const toValues = [];
            let total = ethers.BigNumber.from(0);
            for (let i = 1; i <= 1; i++) {
                toValues.push('2000000000000000000');
                toAddr.push(user1.address);
                total = total.add(ethers.BigNumber.from("2000000000000000000"))
            }
            const testToken = await getTokenContract();
            const swapOkTx = await bridge.connect(maker).transferTokens(testToken.address,toAddr, toValues, {
                value: 0
            });
            const tx = await swapOkTx.wait();
        });
        
        it("Transfer", async function () {
            const bridge = await getOrbiterBridge();
            const [_, maker, user1] = await ethers.getSigners();
            const swapOkTx = await bridge.connect(maker).transfer(user1.address, ethers.BigNumber.from("2000000000000000000"),'0x9f34e6d4c4639ab8af65e34eb9d70693d1832869de8e32e86f13721389b775c9', {
                value: ethers.BigNumber.from("2000000000000000000")
            });
            const tx = await swapOkTx.wait();
        });
        
        it("Transfer Token", async function () {
            const bridge = await getOrbiterBridge();
            const [_, maker, user1] = await ethers.getSigners();
            const testToken = await getTokenContract();
            const swapOkTx = await bridge.connect(maker).transferToken(testToken.address,user1.address, ethers.BigNumber.from("10000000000000000000"),'0x9f34e6d4c4639ab8af65e34eb9d70693d1832869de8e32e86f13721389b775c9');
            const tx = await swapOkTx.wait();
        });
        
        
        
        
        
//        it("TransferETHRLP", async function () {
//            const bridge = await getOrbiterBridge();
//            // const testToken = await getTokenContract();
//            const [_, maker, user1] = await ethers.getSigners();
//            const toAddr = [];
//            const toValues = [];
//            let total = ethers.BigNumber.from(0);
//            for (let i = 1; i <= 10; i++) {
//                const uint256Value = ethers.BigNumber.from('2000000000000000000');
//                toValues.push(uint256Value.toHexString());
//                toAddr.push(user1.address);
//                total = total.add(ethers.BigNumber.from("2000000000000000000"))
//            }
//            const encoded = RLP.encode(toValues)
//            const encodedAsBuffer = Buffer.from(encoded)
//            console.log('encoded---------', encodedAsBuffer);
//            const swapOkTx = await bridge.connect(maker).transferRLP(toAddr, encodedAsBuffer, {
//                value: total
//            });
//            const tx = await swapOkTx.wait();
//            console.log(tx.gasUsed, '===gasUser')
//            // const userBalanceAfter = await bridge.provider.getBalance(detail.to);
//            // expect(userBalanceAfter).eq(userBalanceBefore.add(detail.value.mul(2)))
//            // await bridge.connect(maker).swapAnswer(detail.to, detail.token,  detail.value,'0xdb39db11f268f10b2a62e0805b435148', { value: detail.value.mul(2) })
//        });

    });



});