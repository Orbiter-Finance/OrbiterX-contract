import * as networks from 'viem/chains';
console.log(Object.keys(networks));
import chains from '../chains.json';
export function loadNetworks(networksNames: string[]) {
    const networkConfig: any = {}
    for (const name of networksNames) {
        const config = (<any>networks)[name];
        const chainItem:any = chains.find(row => row.chainId == config.id);
        if (!config || !chainItem) {
            console.error(`${name} chain not found`);
            continue;
        }
        const rpcs:any[] = chainItem.rpc.filter((url:string) => !url.includes('${') && url.includes('http'))
        // console.log(JSON.stringify(config.rpcUrls), '==config.rpcUrls')
        const randomRpc = rpcs[Math.floor(Math.random() * rpcs.length)];
        const rpcUrl = randomRpc;
        console.log(`Chain ${name} randomRpc ${randomRpc}`)
        networkConfig[name] = {
            url: rpcUrl,
            chainId: config.id,
            config
        }
    }
    return networkConfig;
}