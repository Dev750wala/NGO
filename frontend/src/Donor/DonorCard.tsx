import { useNavigate } from 'react-router-dom';
import './DonorCard.css';

const DonorCard = () => {
    const navigate = useNavigate(); 

    return (
        <div className="cardcontainer">
            <div className="DonorCard"> 
                <div className="photodonorcard"></div>
                <div className="donor-info">
                    <h4 className="donor-name">ngo1</h4>
                    <p className="donor-desc">short des</p>
                </div>
                <div className="btn-container">
                    <button className="participate-btn" onClick={() => navigate('/participate')}>
                        participate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DonorCard;