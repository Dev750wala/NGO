import { useState } from 'react';
import './participate.css';

const ParticipatePage = () => {
    const [selectedProject, setSelectedProject] = useState(null);
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

    return (
        <div className="participatemaincontainer">
            <div className="participatecontainer">
                <div className="participateimage"></div>
                <div className="participatedetails">
                    <h2 className="ngoname">NGO name</h2>
                    <p className="ngodescription">
                        <strong>What is Lorem Ipsum?</strong> <br />
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry...
                    </p>
                    <h3 className="projecttitle">Projects:</h3>
                    <ul className="projectlist">
                        <li>
                            <span>🔹 🏫 Build 10 Schools - ₹5,00,000 Goal</span>
                            <div className="progressbar">
                                <div className="progress" style={{ width: "60%" }}></div>
                            </div>
                            <button className="donate-btn" onClick={() => openPopup("Build 10 Schools", "This project aims to construct 10 schools in underprivileged areas...", ["/images/school1.jpg", "/images/school2.jpg"]) }>
                                View
                            </button>
                        </li>
                        <li>
                            <span>🔹 📚 Provide Books to 500 Kids - ₹50,000 Goal</span>
                            <div className="progressbar">
                                <div className="progress" style={{ width: "80%" }}></div>
                            </div>
                            <button className="donate-btn" onClick={() => openPopup("Provide Books to 500 Kids", "Helping 500 children receive quality education...", ["/images/books1.jpg", "/images/books2.jpg"]) }>
                                View
                            </button>
                        </li>
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
                                    <button id="buttonshead" className={`tab-button ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>
                                        Description
                                    </button>
                                    <button id="buttonshead" className={`tab-button ${activeTab === 'images' ? 'active' : ''}`} onClick={() => setActiveTab('images')}>
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
 