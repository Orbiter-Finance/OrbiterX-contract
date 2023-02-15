import { TestToken } from '../typechain-types/contracts/TestToken';
import { loadOrDeployContract, printSuccess } from "../scripts/utils";
import { expect } from 'chai';
import { OrbiterXRouter } from "../typechain-types";
import { ethers } from "hardhat";
import { getTokenContract } from "./TestToken";
import { SwapOrder, SwapOrderType } from "./types";
import RLP from 'rlp'
export async function getOrbiterBridge() {
  const [owner, maker] = await ethers.getSigners();
  const bridge = await loadOrDeployContract<OrbiterXRouter>('OrbiterXRouter', false, maker.address);
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
    it("changeMaker", async function () {
      const accounts = await ethers.getSigners();
      const bridge = await getOrbiterBridge();
      await bridge.changeMaker(accounts[1].address, true);
    });
  });
  describe("Swap", function () {
    let swapOrder: SwapOrder;
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
    it("Swap (MainToken)", async function () {
      const contract = await getOrbiterBridge();
      const sendValue = ethers.BigNumber.from(swapOrder.calldata.value);

      const [_, maker, user] = await ethers.getSigners();
      const hexZeroPad = ethers.utils.hexZeroPad

      const calldata = ethers.utils.hexConcat([hexZeroPad(swapOrder.chainId, 2), hexZeroPad(swapOrder.token, 32)]);
      const swapTx = await contract.connect(user).swap(maker.address, swapOrder.calldata.token, sendValue, calldata, {
        value: sendValue
      })
      await swapTx.wait();
      swapOrder.calldata.hash = swapTx.hash;
    });
    it("Swap RLP (MainToken)", async function () {
      const contract = await getOrbiterBridge();
      const sendValue = ethers.BigNumber.from(swapOrder.calldata.value);
      const [_, maker, user] = await ethers.getSigners();
      const bufferList = [swapOrder.chainId, swapOrder.token] // 
      const encoded = RLP.encode(bufferList) // 
      const swapTx = await contract.connect(user).swap(maker.address, swapOrder.calldata.token, sendValue, encoded, {
        value: sendValue
      })
      const tx = await swapTx.wait();
      const fee = tx.cumulativeGasUsed.mul(tx.effectiveGasPrice);
      const decodeSwap = contract.interface.decodeFunctionData('swap', swapTx.data);
      swapOrder.calldata.hash = swapTx.hash;
      const decoded = RLP.decode(decodeSwap.data) // 
      decoded.forEach((item, index) => {
        if (index === 0) {
        } else if (index === 1) {
          const returnHexString = ethers.utils.hexlify(item); 
          expect(returnHexString).eq("0x0000000000000000000000000000000000000000");

        }
      })
    });

    it("Swap Ok (MainToken)", async function () {
      const contract = await getOrbiterBridge();
      const testToken = await getTokenContract();
      const [owner, maker, user] = await ethers.getSigners();
      const balanceBefore = await user.getBalance();
      const swapOkTx = await contract.connect(maker).swapAnswer(swapOrder.to, swapOrder.token, ethers.BigNumber.from(swapOrder.value), '0xdb39db11f268f10b2a62e0805b435148', {
        value: ethers.BigNumber.from(swapOrder.value)
      });
      await swapOkTx.wait().then(tx => {
        // expect(tx.events?.map((e: any) => e.event).includes('SwapOK')).true;
      });
      expect(swapOkTx).not.empty;
      // check balance
      const balanceAfter = await user.getBalance();
      expect(balanceAfter).eq(ethers.BigNumber.from(swapOrder.value).add(balanceBefore))
    });
    it("Swap (TestToken)", async function () {
      const testToken = await getTokenContract();
      // 
      const [_, maker, user] = await ethers.getSigners();
      swapOrder = {
        chainId: 5,
        hash: "",
        from: maker.address,
        to: user.address,
        token: testToken.address,
        value: ethers.utils.parseEther('1').toString(),
        calldata: {
          chainId: 22,
          hash: '',
          token: testToken.address,
          timestamp: Date.now(),
          value: ethers.utils.parseEther('1').toString()
        },
        type: SwapOrderType.None
      }
      const bridge = await getOrbiterBridge();
      const sendValue = ethers.BigNumber.from(swapOrder.calldata.value);
      const toChainId = ethers.utils.hexlify(swapOrder.chainId);
      // const calldata = [toChainId,
      //   swapOrder.token,
      //   swapOrder.to]
      const calldata = ethers.utils.hexConcat([toChainId, swapOrder.token, swapOrder.to])
      const swapTx = await bridge.connect(user).swap(maker.address, swapOrder.calldata.token, sendValue, calldata, {
        value: ethers.BigNumber.from(0)
      })
      await swapTx.wait();
      swapOrder.calldata.hash = swapTx.hash;
    });

    it("Swap Ok(TestToken)", async function () {
      const bridge = await getOrbiterBridge();
      const testToken = await getTokenContract();
      const [_, maker] = await ethers.getSigners();
      const userBalanceBefore = await testToken.balanceOf(swapOrder.to);
      const makerBalanceBefore = await testToken.balanceOf(swapOrder.from);
      const swapOkTx = await bridge.connect(maker).swapAnswer(swapOrder.to, swapOrder.token, ethers.BigNumber.from(swapOrder.value),'0xdb39db11f268f10b2a62e0805b435148', {
        value: ethers.BigNumber.from(0)
      });
      await swapOkTx.wait();
      // 

      expect(swapOkTx).not.empty;
      // check balance
      expect(await testToken.balanceOf(swapOrder.to)).eq(ethers.BigNumber.from(swapOrder.value).add(userBalanceBefore))
      expect(await testToken.balanceOf(swapOrder.from)).eq(makerBalanceBefore.sub(swapOrder.value))
    });




    it("Deposit MainToken to Bridge Contract", async function () {
      const bridge = await getOrbiterBridge();
      const [_, maker, user] = await ethers.getSigners();
      const sendValue = ethers.utils.parseEther('1');
      await user.sendTransaction({
        value: sendValue,
        to: bridge.address,
      })

      // check bridge balance
      expect(await bridge.provider.getBalance(bridge.address)).eq(sendValue);
    });
    it("Owner Withdraw MainToken", async function () {
      const bridge = await getOrbiterBridge();
      const [_] = await ethers.getSigners();
      const contractMainTokenBalance = await bridge.provider.getBalance(bridge.address);
      expect(contractMainTokenBalance).eq(ethers.utils.parseEther('1').toString());
      const withdrawTx = await bridge.withdraw('0x0000000000000000000000000000000000000000');
      await withdrawTx.wait();
      expect(await bridge.provider.getBalance(bridge.address)).eq(0);
    });
    it("Deposit TestToken to Bridge Contract", async function () {
      const bridge = await getOrbiterBridge();
      const [_] = await ethers.getSigners();
      const testToken = await getTokenContract();
      const sendTokenValue = ethers.utils.parseEther('2');
      await testToken.transfer(bridge.address, sendTokenValue)
      // check bridge balance
      expect(await testToken.balanceOf(bridge.address)).eq(sendTokenValue);
    });
    it("Owner Withdraw TestToken", async function () {
      const bridge = await getOrbiterBridge();
      const [_] = await ethers.getSigners();
      const testToken = await getTokenContract();
      const withdrawTx = await bridge.withdraw(testToken.address);
      await withdrawTx.wait();
      expect(await testToken.balanceOf(bridge.address)).eq(0);
    });
    it("Swap Ok Multicall", async function () {
      const bridge = await getOrbiterBridge();
      // const testToken = await getTokenContract();
      const [_, maker, user1] = await ethers.getSigners();
      const detail = {
        fromHash: '0xb0ab8edcd87f6b94efd2b0a1a9f1d57eecabf427f4c4e3299587c39e7809c3ca',
        from: maker.address,
        to: user1.address,
        token: "0x0000000000000000000000000000000000000000",
        value: ethers.BigNumber.from('2000000000000000000')
      }
      const userBalanceBefore = await bridge.provider.getBalance(detail.to);
      const calldata = await bridge.interface.encodeFunctionData('swapAnswer', [detail.to, detail.token,  detail.value, '0x']);
      const swapOkTx = await bridge.connect(maker).multicall([
        calldata,
        calldata,
      ], {
        value: detail.value.mul(2)
      });
      await swapOkTx.wait();
      const userBalanceAfter = await bridge.provider.getBalance(detail.to);
      expect(userBalanceAfter).eq(userBalanceBefore.add(detail.value.mul(2)))
      await bridge.connect(maker).swapAnswer(detail.to, detail.token,  detail.value,'0xdb39db11f268f10b2a62e0805b435148', { value: detail.value.mul(2) })
    });

  });



});