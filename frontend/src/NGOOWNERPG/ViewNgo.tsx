import { useNavigate } from "react-router-dom";
import Header from "../HOMEPAGE/Header";
import "./viewngo.css";
<<<<<<< HEAD
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
=======

const ViewNgo = () => {
    const navigate = useNavigate(); 

    const handleAddClick = () => {
        navigate("/form"); 
    };

    return (
        <div className="view-ngo-container"> 
            <Header title="DeBuggers" />

            <div className="view-card">
                <div className="photo-view"></div>
                <div className="view-content">
                    <h2 className="ngo-name">NGO Name</h2>
                    <p className="ngo-desc">
                        “Save the Future Foundation is dedicated to providing quality education and healthcare 
                        to underprivileged children. Our mission is to empower young minds through scholarships, 
                        mentorship programs, and medical aid. Join us in shaping a better tomorrow!”
>>>>>>> 4eaa867fd75d5ca187b79b28411e030fe317ec05
                    </p>
                </div>
            </div>

            <div className="view-card2">
                <div className="sub-card">Fund Raise</div>
                <div className="sub-card">Ongoing Project</div>
                <div className="sub-card">Finished Projects</div>
                <div className="sub-card">Finished Projects</div>
            </div>

            <div className="projects-container">
                <h3 className="projects-title">On Going Projects</h3>
                <button className="add-btn" onClick={handleAddClick}>ADD</button> {/* Add click event */}

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
<<<<<<< HEAD
                        ))
                    ) : (
                        <p>No ongoing projects</p>
                    )}
=======
                        </div>
                    ))}
>>>>>>> 4eaa867fd75d5ca187b79b28411e030fe317ec05
                </div>
            </div>
        </div>
    );
};

export default ViewNgo;
