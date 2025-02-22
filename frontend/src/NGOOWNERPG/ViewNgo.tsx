import { useNavigate } from "react-router-dom";
import Header from "../HOMEPAGE/Header";
import "./viewngo.css";

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
                    {[1, 2, 3].map((task, index) => (
                        <div key={index} className="project-card">
                            <h4 className="project-name">TASK {task}</h4>
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${50 + index * 10}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewNgo;