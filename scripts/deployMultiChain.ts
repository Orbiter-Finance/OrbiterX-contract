import { createWalletClient, http, createPublicClient, zeroAddress, parseGwei } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { loadNetworks } from './utils/network'
import orbiterRouterContract from '../artifacts/contracts/OrbiterRouter.sol/OrbiterRouter.json';
import * as networkConfig from 'viem/chains';
const chainNames = Object.keys(networkConfig).filter(networkName => (networkName.includes('Testnet') || networkName.includes('Sepolia') || networkName.includes('Goerli')));
const networks = loadNetworks(chainNames);
import fs from 'fs';
async function checkBalance() {
    let index = 0;
    const balances: any[] = []
    const account = privateKeyToAccount('')
    const balance1Addr = '0x36b1B5Dcf3e3CEF31eEa160829b34811A42820d2';
    for (const networkName in networks) {
        console.log(`checkBalance current: ${index} / ${chainNames.length}`)
        index++
        const network = networks[networkName];
        try {
            if (!(networkName.includes('Testnet') || networkName.includes('Sepolia') || networkName.includes('Goerli'))) {
                continue;
            }
            const wallet = createWalletClient({
                account,
                chain: network.config,
                transport: http()
            })
            const client = createPublicClient({
                chain: network.config,
                transport: http()
            })
            const balance1 = await client.getBalance({
                address: balance1Addr
            })
            const balance2 = await client.getBalance({
                address: account.address
            })
            console.log(balance1, '==balance', balance2)
            if (balance2 <= 0) {
                console.log(`${networkName} balance2 Insufficient Balance`)
                continue;
            }

            if (balance1 == 0n) {
                {
                    const tx = await wallet.sendTransaction({
                        to: balance1Addr,
                        data: "0x",
                        value: BigInt(10 ** 18),
                    } as any);
                    console.log(`${networkName} transfer success ${tx}`)
                }
            } else {
                console.log(`exist ${networkName} balance ${(Number(balance1) / 10 ** 18)}`)

                balances.push({
                    network: network.id,
                    networkName: networkName,
                    balance: Number(balance1) / 10 ** 18
                })
            }
        } catch (error: any) {
            console.error(`${networkName} transfer fail ${error.message}`);
        }
    }
    console.log('Balances:', JSON.stringify(balances))
    await fs.writeFileSync("./balances", JSON.stringify(balances))
}
async function main() {
    const account = privateKeyToAccount('')
    for (const networkName in networks) {
        const network = networks[networkName];
        const wallet = createWalletClient({
            account,
            chain: network.config,
            transport: http()
        })
        const client = createPublicClient({
            chain: network.config,
            transport: http()
        })
        const deployTx = await wallet.deployContract({
            abi: orbiterRouterContract.abi,
            account,
            bytecode: <any>orbiterRouterContract.bytecode,
            // nonce: 15
        } as any);
        const trx = await client.waitForTransactionReceipt({
            hash: deployTx
        })
        console.log(`${networkName} contractAddress ${trx.contractAddress}, hash:${deployTx}, status:${trx.status}`)
    }

}
checkBalance().then(() => {

})