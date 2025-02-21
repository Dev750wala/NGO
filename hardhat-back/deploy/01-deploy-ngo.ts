import "hardhat-deploy"
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat.config";
import { ethers, network } from "hardhat";
import { NGOFunding } from "../typechain-types/NGOFunding";
import { verify } from "../utils/verify"


module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const deployerSigner = await ethers.getSigner(deployer)
    const chainId = network.config.chainId

    let cryptoDonationPlatformAddress: string
    let subscriptionId: bigint | string

    // if (developmentChains.includes(network.name)) {
        // const cryptoDonationPlatform = await deployments.get("CryptoDonationPlatform")
        // cryptoDonationPlatformAddress = cryptoDonationPlatform.address
        // console.log("Default mock deployed is at: ", cryptoDonationPlatformAddress);


        const contract = await deploy("NGOFunding", {
            from: deployer,
            log: true,
            contract: "NGOFunding",
            args: [],
            // waitConfirmations: 2
        }) 


        console.log("CryptoDonationPlatform deployed at: ", contract.address);
        
        // const txResponse = contract.
        // const txReceipt = await txResponse.wait()

        // requesting subscriptionId from the mocks
        // const ngoFUnding = (await ethers.getContractAt(
        //     "VRFCoordinatorV2_5Mock",
        //     (await deployments.get("VRFCoordinatorV2_5Mock")).address,
        //     deployerSigner
        // )) as unknown as NGOFunding;

        // CREATE SUBSCRIPTION
        // const tx = await mockContract.createSubscription();
        // const txReceipt = await tx.wait();
        // const eventFilter = mockContract.filters.SubscriptionCreated();
        // const logs = await mockContract.queryFilter(eventFilter, txReceipt?.blockNumber, txReceipt?.blockNumber);
        // subscriptionId = logs[0]?.args?.subId;

        // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx
        
        // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx

        // ------------------------------
        // const outputPath = path.join(__dirname, "../AAAAAAAAAAAAAA/subscriptionData.json");
        // const data = { subscriptionId: subscriptionId.toString() };
        // fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        // fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
        // console.log("Saved subscriptionId to:", outputPath);
        // ------------------------------
    // }
    // else {
    //     vrfCoordinatorAddress = networkConfig[chainId as keyof typeof networkConfig]?._vrfCoordinator as string
    //     subscriptionId = networkConfig[chainId as keyof typeof networkConfig]?.subscriptionId as bigint | string
    // }
    
    // const entranceFee = networkConfig[chainId as keyof typeof networkConfig].entranceFee
    // const entranceFee = ethers.parseEther("0.01")
    // const interval = "30"
    
    // const args = [entranceFee, subscriptionId, interval, vrfCoordinatorAddress]

    // const raffle = await deploy("Raffle", {
    //     from: deployer,
    //     args: args,
    //     log: true,
    //     // waitConfirmations: 2,
    //     contract: "Raffle",
    // })
    // log("Raffle deployed at: ", raffle.address)

    // if(developmentChains.includes(network.name)) {
    //     console.log("Adding the consumer to the mock...");
    //     const mockContract = (await ethers.getContractAt(
    //         "VRFCoordinatorV2_5Mock",
    //         (await deployments.get("VRFCoordinatorV2_5Mock")).address,
    //         deployerSigner
    //     )) as unknown as VRFCoordinatorV2_5Mock;
    //     log("Adding consumer to mock...1111111111111");
    //     mockContract.addConsumer(subscriptionId, raffle.address)
    //     log("Adding consumer to mock...2222222222222");
    // }

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying contract on Etherscan...");
        await verify(contract.address, [])
    }

    log("------------------------------------");
}

module.exports.tags = ["all", "raffle"]