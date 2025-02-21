import { useNavigate } from "react-router-dom"; 


const NgoMiddle = () => {
    const navigate = useNavigate(); 

    return (
        <div className="NgoMiddle"> 
            <p className="ngomiddletext">
            "Empower Your NGO with Transparency & Trust"

            </p>
            <p>"Join NextGen NGO and ensure every donation is verified, voted, and securely released. Let’s build a future of accountable giving!"</p>
            <div className="ngobutton-container">
                <button className="ngobutton1" onClick={() => navigate('/create-ngo')}>Create Ngo</button>
                <button className="ngobutton2" onClick={() => navigate('/view-ngo')}>View Ngo</button>
            </div>
        </div>
    );
};

export default NgoMiddle;