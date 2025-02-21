import { useNavigate } from "react-router-dom";
import "./homemiddlepage.css";
import image from "../asset/image.png"

const HomeMiddlePage = () => {
    const navigate = useNavigate();

    return (
        <div className="middlepage">
            <div className="middlecontent">
                <div className="middlecontent2">
                    Next<span className="middlefontgen">Gen</span><br />NGO
              
                <div className="middletext">
                    "Your Donations, Your Vote, Your Impact."
                   
                </div>
                <div> <p className="middleptext">Join the Transparent Charity Movement. Build a Better Future as</p></div>
                </div>
               
                <div className="middlebuttons">
                    
                
                    <button className="homebutton" onClick={() => navigate('/ngoowner')}>NGO Owner</button>
                    <button className="homebutton" onClick={() => navigate('/voter')}>Voter</button>
                    <button className="homebutton" onClick={() => navigate('/donor')}>Donor</button>
                </div>
            </div>

            <div className="middleimage">
                <img className="imageland" src={image} alt="Donation Concept" />
            </div>
        </div>
    );
};

export default HomeMiddlePage;