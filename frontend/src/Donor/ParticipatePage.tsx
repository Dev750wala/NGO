import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './participate.css';

const ParticipatePage = () => {
    const location = useLocation();
    const { ngo } = location.state || {}; // Getting NGO data passed from the DonorCard component
    interface Project {
        title: string;
        description: string;
        images: string[];
    }
    
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [activeTab, setActiveTab] = useState('description');
    const [donatePopup, setDonatePopup] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');

    const openPopup = (title, description, images) => {
        setSelectedProject({ title, description, images });
        setActiveTab('description');
        setDonatePopup(false);
    };

    const closePopup = () => {
        setSelectedProject(null);
        setDonatePopup(false);
        setDonationAmount('');
    };

    const openDonatePopup = () => {
        setDonatePopup(true);
    };

    useEffect(() => {
        // Reset selected project when ngo changes
        setSelectedProject(null);
    }, [ngo]);

    if (!ngo) return <div>Loading...</div>; // Fallback in case the NGO data is not available

    return (
        <div className="participatemaincontainer">
            <div className="participatecontainer">
                <div className="participateimage"></div>
                <div className="participatedetails">
                    <h2 className="ngoname">{ngo.name}</h2>
                    <p className="ngodescription">{ngo.description}</p>
                    <h3 className="projecttitle">Projects:</h3>
                    <ul className="projectlist">
                        {ngo.tasks.map((task, index) => (
                            <li key={index}>
                                <span>🔹 {task.title} - {task.goal} Goal</span>
                                <div className="progressbar">
                                    <div className="progress" style={{ width: `${task.progress}%` }}></div>
                                    <div className="progress" style={{ width: `${task.progress}%` }}></div></div>
                                <button 
                                    className="donate-btn" 
                                    onClick={() => openPopup(task.title, task.description, task.images)}
                                >
                                    View
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {selectedProject && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <span className="close-icon" onClick={closePopup}>&times;</span>

                        {!donatePopup ? (
                            <>
                                <div className="popup-tabs">
                                    <button 
                                        id="buttonshead" 
                                        className={`tab-button ${activeTab === 'description' ? 'active' : ''}`} 
                                        onClick={() => setActiveTab('description')}
                                    >
                                        Description
                                    </button>
                                    <button 
                                        id="buttonshead" 
                                        className={`tab-button ${activeTab === 'images' ? 'active' : ''}`} 
                                        onClick={() => setActiveTab('images')}
                                    >
                                        Images
                                    </button>
                                </div>

                                <div className="popup-tab-content">
                                    {activeTab === 'description' ? (
                                        <div className="popup-description-container">
                                            <h2>{selectedProject.title}</h2>
                                            <p className="popup-description scrollable-content">{selectedProject.description}</p>
                                        </div>
                                    ) : (
                                        <div className="popup-images-container grid-scroll">
                                            {selectedProject.images.map((img, index) => (
                                                <img key={index} src={img} alt="Project" className="popup-image" />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button className="popup-donate-btn" onClick={openDonatePopup}>Donate</button>
                            </>
                        ) : (
                            <div className="donate-popup-content">
                                <p className="donation-message">Your contribution makes a real difference! Every donation helps NGOs continue their mission and bring positive change. Thank you for your generosity!</p>
                                <label>Amount (ETH):</label>
                                <input 
                                    type="number" 
                                    value={donationAmount} 
                                    onChange={(e) => setDonationAmount(e.target.value)} 
                                    placeholder="Enter amount in ETH" 
                                />
                                <div className="confirm-button-container">
                                    <button className="confirm-donate-btn">Confirm Donation</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParticipatePage;