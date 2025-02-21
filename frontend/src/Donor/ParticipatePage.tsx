import './participate.css';

const ParticipatePage = () => {
    return (
        <div className="participatemaincontainer">
            <div className="participatecontainer">
              
                <div className="participateimage"></div>

        
                <div className="participatedetails">
                    <h2 className="ngoname">NGO name</h2>
                    <p className="ngodescription">
                        <strong>What is Lorem Ipsum?</strong> <br />
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...
                    </p>

                  
                    <div className="projectdetails">
                        <h3 className="projecttitle">Projects:</h3>
                        <ul className="projectlist">
                            <li>
                                🔹 🏫 Build 10 Schools - ₹5,00,000 Goal 
                                <div className="progressbar">
                                    <div className="progress" style={{ width: "60%" }}></div>
                                </div>
                                <p className="projectdesc">This project aims to construct 10 schools in underprivileged areas to promote education.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla aut numquam corporis corrupti, culpa, quibusdam itaque, doloremque asperiores et error quo! Incidunt, reprehenderit iusto corrupti doloremque nobis officia consectetur magnam.
                                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus recusandae nam, animi, aliquid impedit perferendis nemo similique fugiat nostrum harum quam mollitia modi esse, vitae cum eligendi deserunt magnam aut.
                                </p>
                            </li>
                            <li>
                                🔹 📚 Provide Books to 500 Kids - ₹50,000 Goal 
                                <div className="progressbar">
                                    <div className="progress" style={{ width: "80%" }}></div>
                                </div>
                                <p className="projectdesc">This initiative will provide essential learning materials and books to 500 children in need.</p>
                            </li>
                            <li>
                                🔹 🍲 Feed 1,000 Families - ₹1,00,000 Goal 
                                <div className="progressbar">
                                    <div className="progress" style={{ width: "90%" }}></div>
                                </div>
                                <p className="projectdesc">A food distribution program to help 1,000 families struggling with food insecurity.</p>
                            </li>
                        </ul>
                    </div>

                 
                    <button className="donate-btn">donate</button>
                </div>
            </div>
        </div>
    );
};

export default ParticipatePage;