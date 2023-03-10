# Sample OrbiterX Project

 Files Description Table


|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
|  /OrbiterX-contract/contracts/OrbiterXRouter.sol | 4b74056f4ccb963f8aaf8b7e705f34865fcda829 |


 Contracts Description Table


|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     â      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **IERC20** | Interface |  |||
| â | transfer | External âï¸ | ð  |NOâï¸ |
| â | balanceOf | External âï¸ |   |NOâï¸ |
| â | allowance | External âï¸ |   |NOâï¸ |
| â | transferFrom | External âï¸ | ð  |NOâï¸ |
||||||
| **OrbiterXRouter** | Implementation | Ownable, Multicall |||
| â | Constructor | Public âï¸ | ð  |NOâï¸ |
| â | Receive Ether | External âï¸ |  ðµ |NOâï¸ |
| â | changeMaker | Public âï¸ | ð  | onlyOwner |
| â | withdraw | External âï¸ | ð  | onlyOwner |
| â | forward | Private ð | ð  | |
| â | swap | External âï¸ |  ðµ |NOâï¸ |
| â | swapAnswer | External âï¸ |  ðµ |NOâï¸ |


 Legend

|  Symbol  |  Meaning  |
|:--------:|-----------|
|    ð    | Function can modify state |
|    ðµ    | Function is payable |

### Inheritance Graph
![image](public/image/Class.png)
### CallGraph
![image](public/image/CallGraph.png)


Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```