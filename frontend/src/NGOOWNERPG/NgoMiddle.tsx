import { useNavigate } from "react-router-dom"; 
import { useAccount } from 'wagmi';
// import { address, abi } from "../../../hardhat-back/deployments/sepolia/NGOFunding.json";

const NgoMiddle = () => {
    const navigate = useNavigate(); 
    const { address: accountAddress, isConnected } = useAccount(); // Moved useAccount to top level

    const handelClick = () => {
        if (!isConnected) {
            alert("Please connect your wallet");
        } else {
            navigate('/view-ngo');
        }
    };

    return (
        <div className="NgoMiddle"> 
            <p className="ngomiddletext">
                "Empower Your NGO with Transparency & Trust"
            </p>
            <p>
                "Join NextGen NGO and ensure every donation is verified, voted, and securely released. Let’s build a future of accountable giving!"
            </p>
            <div className="ngobutton-container">
                <button className="ngobutton1" onClick={() => navigate('/create-ngo')}>
                    Create Ngo
                </button>
                <button className="ngobutton2" onClick={handelClick}>
                    View Ngo
                </button>
            </div>
        </div>
    );
};

export default NgoMiddle;