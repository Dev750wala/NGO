import { useNavigate } from 'react-router-dom';
import './DonorCard.css';

// Sample array of NGO data (replace with real backend data later)
const ngos = [
  { 
    name: 'NGO 1', 
    description: 'Short description of NGO 1', 
    tasks: [
      { title: 'Build 10 Schools', goal: '₹5,00,000', progress: 60, description: 'This project aims to construct 10 schools in underprivileged areas.', images: ["/images/school1.jpg", "/images/school2.jpg"] },
      { title: 'Provide Books to 500 Kids', goal: '₹50,000', progress: 80, description: 'Helping 500 children receive quality education.', images: ["/images/books1.jpg", "/images/books2.jpg"] }
    ]
  },
  { 
    name: 'NGO 2', 
    description: 'Short description of NGO 2', 
    tasks: [
      { title: 'Clean 20 Rivers', goal: '₹3,00,000', progress: 30, description: 'A project to clean 20 polluted rivers.', images: ["/images/river1.jpg", "/images/river2.jpg"] },
      { title: 'Provide Clean Water to 1000 Families', goal: '₹1,00,000', progress: 50, description: 'Providing clean water to underprivileged families.', images: ["/images/water1.jpg", "/images/water2.jpg"] }
    ]
  },
  { 
    name: 'NGO 3', 
    description: 'Short description of NGO 3', 
    tasks: [
      { title: 'Replant 500 Trees', goal: '₹2,00,000', progress: 70, description: 'Replanting trees to combat deforestation.', images: ["/images/tree1.jpg", "/images/tree2.jpg"] }
    ]
  },
];

const DonorCard = () => {
    const navigate = useNavigate(); 

    return (
        <div className="cardcontainer">
            {ngos.map((ngo, index) => (
                <div key={index} className="DonorCard"> 
                    <div className="photodonorcard"></div>
                    <div className="donor-info">
                        <h4 className="donor-name">{ngo.name}</h4>
                        <p className="donor-desc">{ngo.description}</p>
                    </div>
                    <div className="btn-container">
                        <button 
                            className="participate-btn" 
                            onClick={() => navigate('/participate', { state: { ngo } })}  // Passing the ngo data to ParticipatePage
                        >
                            Participate
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DonorCard;