import { ethers } from "hardhat"
require("dotenv").config()

interface NetworkConfigg {
    [networkId: number]: {
        name: string;
        _vrfCoordinator?: string;
        entranceFee: bigint;
        subscriptionId?: bigint | string;
    };
}

// const networkConfig: NetworkConfigg = {
//     11155111: {
//         name: "sepolia",
//         // _vrfCoordinator: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
//         // entranceFee: ethers.parseEther("0.01"),
//         // subscriptionId: process.env.CHAINLINK_VRF_SUBSCRIPTION_ID
//     // },
//     1337: {
//         name: "ganache",
//         entranceFee: ethers.parseEther("0.01")
//     },
//     31337: {
//         name: "hardhat",
//         entranceFee: ethers.parseEther("0.01")
//     }
// }

const developmentChains = ['hardhat', 'localhost', 'ganache']

export {
    // networkConfig,
    developmentChains
}