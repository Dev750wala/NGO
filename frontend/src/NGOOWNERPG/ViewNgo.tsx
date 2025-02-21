import Header from "../HOMEPAGE/Header";
import './viewngo.css';

const ViewNgo = () => {
    return(
        <div className="ViewNgo"> 
            <Header title="DeBuggers"/>
            <div className="veiw1card">
                <div className="photoview"></div>
                <div className="viewfont">
                    <h2 className="ngoname">NGO Name</h2>
                    <p className="ngodesc">
                        “Save the Future Foundation is dedicated to providing quality education and healthcare 
                        to underprivileged children. Our mission is to empower young minds through scholarships, 
                        mentorship programs, and medical aid. Join us in shaping a better tomorrow!”
                    </p>
                </div>
            </div>
            <div className="viewcard2">
                <div className="subcard1">
                    fund raise
                </div>
                <div className="subcard2">
                    Ongoing Project
                </div>
                <div className="subcard3">
                    Finished Projects
                </div>
                <div className="subcard4">
                    Finished Projects
                </div>
            </div>
        </div>
    );
};

export default ViewNgo;