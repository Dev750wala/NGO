import Header from "../HOMEPAGE/Header";
import "./viewngo.css";
import { useAccount, useReadContract } from "wagmi";
import { address as contractAddress, abi as contractAbi } from "../../../hardhat-back/deployments/sepolia/NGOFunding.json";
import { useWriteContract } from "wagmi";
import { useState, useEffect } from "react";

// Define a type for NGO details
interface NgoDetails {
    name: string;
    description: string;
    logo: string;
    taskIds: string[];
}

const ViewNgo = () => {
    // const { data: hash, isPending, writeContract } = useWriteContract();
    const { address, isConnected } = useAccount();
    
    // State to store fetched NGO details
    const [ngoDetails, setNgoDetails] = useState<NgoDetails>({
        name: "",
        description: "",
        logo: "",
        taskIds: [],
    });

    // Fetch NGO details inside useEffect
    const { data: ngoData, isError } = useReadContract({
        address: `0x${contractAddress.split("0x")[1]}`,
        abi: contractAbi,
        functionName: "getNGODetails",
        args: [address],
    });
    console.log(ngoData)

    useEffect(() => {
        if (!isConnected) return;
        if (ngoData) {
            setNgoDetails({
                name: (ngoData as any)[0] || "",
                description: (ngoData as any)[1]|| "",
                logo: (ngoData as any)[2] || "",
                taskIds: (ngoData as any)[3] || [],
            });
        }
    }, [ngoData, isConnected]);

    if (isError) {
        console.error("Error fetching NGO details");
    }

    return (
        <div className="ViewNgo"> 
            <Header title="DeBuggers"/>

            <div className="veiw1card">
                <div className="photoview"><img src={ngoDetails.logo} alt="NGO Logo" className="ngo-logo" /></div>
                <div className="viewfont">
                    <h2 className="ngoname">{ngoDetails.name || "NGO Name"}</h2>
                    <p className="ngodesc">
                    {ngoDetails.description || "Description not available"}
                    </p>
                </div>
            </div>

            <div className="viewcard2">
                <div className="subcard1">Fund Raise</div>
                <div className="subcard2">Ongoing Project</div>
                <div className="subcard3">Finished Projects</div>
                <div className="subcard4">Finished Projects</div>
            </div>

            <div className="projects-container">
                <h3 className="projects-title">On Going Projects</h3>
                <button className="add-btn">ADD</button>

                <div className="project-list">
                    {ngoDetails.taskIds.length > 0 ? (
                        ngoDetails.taskIds.map((task, index) => (
                            <div key={index} className="project-card">
                                <h4 className="project-name">TASK {task}</h4>
                                <div className="progress-bar">
                                    <div className="progress" style={{ width: `${50 + index * 10}%` }}></div>
                                </div>
                                <button className="unlock-btn">UNLOCK</button>
                            </div>
                        ))
                    ) : (
                        <p>No ongoing projects</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewNgo;
