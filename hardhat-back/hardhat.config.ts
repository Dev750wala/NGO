import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox";
// import "@typechain/hardhat"
// import "@nomiclabs/hardhat-waffle"
// require("@nomiclabs/hardhat-etherscan")
import '@nomicfoundation/hardhat-ethers';
import "hardhat-deploy"
import "hardhat-gas-reporter"
import "solidity-coverage"
import "@nomicfoundation/hardhat-verify"
import * as dotenv from "dotenv"
dotenv.config()


// const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL


const config: HardhatUserConfig = {
    defaultNetwork: "ganache",
    networks: {
        localhost: {
            url: "HTTP://127.0.0.1:8545"  
        },
        hardhat: {
            chainId: 31337,
        },
        // sepolia: {
        //     url: SEPOLIA_RPC_URL,
        //     accounts: [process.env.METAMASK_PRIVATE_KEY],
        //     chainId: 11155111
        // },
        ganache: {
            url: "http://0.0.0.0:7545",
            accounts: [
                "0x9484b1bbb1d17677beb699e94ec12dd946208dc01437ce064b80933f054580f0",
                "0x484da611c99535d6f944408e2ef3be2cc3c5bb222c1e056691f9cb93a9f754e1"
            ],
            chainId: 1337
        }
    },
    gasReporter: {
        currency: 'USD',
        enabled: false
    },
    // accounts provided here will be accessible with getNamesAccounts function. 
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1
        }
    },
    etherscan: {
        apiKey: {
            sepolia: process.env.ETHERSCAN_API_KEY,
        }
    },
    solidity: "0.8.28",
};

    
export default config;