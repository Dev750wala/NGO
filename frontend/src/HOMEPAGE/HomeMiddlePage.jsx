import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./homemiddlepage.css";

const HomeMiddlePage = () => {
    const navigate = useNavigate(); // Initialize navigate function

    return (
        <div className="middlepage"> 
            <div className="middlecontent">
                <button onClick={() => navigate('/ngoowner')}>Ngo owner</button>
                <button onClick={() => navigate('/donor')}>Donor</button>
                <button onClick={() => navigate('/voter')}>Voter</button>
            </div>
        </div>
    );
};

export default HomeMiddlePage;