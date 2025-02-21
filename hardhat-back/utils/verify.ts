import { run } from "hardhat"

export async function verify(contractAddress: string, args: any[]) {
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (error: any) {
        if (error.message.includes("already") || error.message.includes("verified")) {
            console.log("Contract already verified!");
        } else {
            console.log("Error verifying contract: ", error.message);
        }
    }
}