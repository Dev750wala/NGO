import { useEffect, useState } from "react";
import "./Voter.css";
import "./voterpage.css";
import {
  address as contractAddress,
  abi as contractAbi,
} from "../../../hardhat-back/deployments/sepolia/NGOFunding.json";
import { useReadContract } from "wagmi";

const VoterPage = () => {
  const [ngos, setNgos] = useState<any[]>([]);
  const [expandedNGO, setExpandedNGO] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string>("description");
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  //   const ngos = [
  //     {
  //       id: 1,
  //       name: "NGO 1",
  //       description: "Helping underprivileged children with education ",
  //       tasks: [
  //         {
  //           title: "Build a school",
  //           description: "Help build a school for children in need.",
  //           images: [image1, image1],
  //         },
  //         {
  //           title: "Provide books",
  //           description: "Donate books to children who lack resources.",
  //           images: ["/images/books.jpg"],
  //         },
  //         {
  //           title: "Fund scholarships",
  //           description: "Support scholarships for bright students.",
  //           images: ["/images/scholarship.jpg"],
  //         },
  //       ],
  //     },
  //     {
  //       id: 2,
  //       name: "NGO 2",
  //       description: "Environmental protection and sustainability",
  //       tasks: [
  //         {
  //           title: "Plant trees",
  //           description: "Join us in planting 10,000 trees.",
  //           images: ["/images/trees.jpg"],
  //         },
  //         {
  //           title: "Reduce plastic waste",
  //           description: "Help reduce single-use plastics.",
  //           images: ["/images/plastic.jpg"],
  //         },
  //         {
  //           title: "Clean rivers",
  //           description: "Volunteer for river clean-up programs.",
  //           images: ["/images/river.jpg"],
  //         },
  //       ],
  //     },
  //     {
  //       id: 3,
  //       name: "NGO 3",
  //       description: "Animal welfare and rescue",
  //       tasks: [
  //         {
  //           title: "Rescue stray dogs",
  //           description: "Save and provide care for stray dogs.",
  //           images: ["/images/dogs.jpg"],
  //         },
  //         {
  //           title: "Provide shelter",
  //           description: "Build and manage animal shelters.",
  //           images: ["/images/shelter.jpg"],
  //         },
  //         {
  //           title: "Adopt-out program",
  //           description: "Encourage pet adoption and responsible care.",
  //           images: ["/images/adopt.jpg"],
  //         },
  //       ],
  //     },
  //   ];

  const toggleExpand = (id: number) => {
    setExpandedNGO(expandedNGO === id ? null : id);
  };

  const { data: ngosData } = useReadContract({
    address: `0x${contractAddress.split("0x")[1]}`,
    abi: contractAbi,
    functionName: "getAllNGOsWithTasks",
  });
  useEffect(() => {
    setLoading(true)
    const ngos =
      (ngosData as any[])?.map((ngo: any) => ({
        id: Number(ngo.id),
        name: ngo.name,
        description: ngo.description,
        tasks: ngo.tasks.map((task: any) => ({
          title: `Task #${task.taskId}`,
          description: task.description,
          images: task.proofLinks,
        })),
      })) || [];
    console.log("ngos", ngos);

    setNgos(ngos);
    setLoading(false)
  }, []);

  if(loading) {
    return <div>Loading...</div>;
  }
  if(!ngos.length) {
    return <div>No NGOs found</div>;
  }

  return (
    <div className="voter">
      <div className="ngo-container">
        {ngos.map((ngo) => (
          <div key={ngo.id} className="ngo-card">
            <div className="ngo-header" onClick={() => toggleExpand(ngo.id)}>
              <div className="ngo-info">
                <div className="ngo-image"></div>
                <div>
                  <h3>{ngo.name}</h3>
                  <p>{ngo.description}</p>
                </div>
              </div>
              <div className="dropdown-icon">
                {expandedNGO === ngo.id ? "▲" : "▼"}
              </div>
            </div>
            {expandedNGO === ngo.id && (
              <div className="tasks-container">
                {ngo.tasks.map((task, index) => (
                  <div key={index} className="task">
                    <span>{task.title}</span>
                    <button
                      className="vote-btn"
                      onClick={() => setSelectedTask(task)}
                    >
                      Vote
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Popup When a Task is Selected */}
      {selectedTask && (
        <div className="voter-popup-overlay">
          <div className="voter-popup-content">
            <span className="close-icon" onClick={() => setSelectedTask(null)}>
              &times;
            </span>

            <div className="popup-tabs">
              <button
                id="buttonshead"
                className={`tab-button ${activeTab === "description" ? "active" : ""}`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                id="buttonshead"
                className={`tab-button ${activeTab === "images" ? "active" : ""}`}
                onClick={() => setActiveTab("images")}
              >
                Images
              </button>
            </div>

            <div className="popup-tab-content">
              {activeTab === "description" ? (
                <div className="popup-description-container">
                  <h2>{selectedTask.title}</h2>
                  <p className="popup-description">
                    {selectedTask.description}
                  </p>
                </div>
              ) : (
                <div className="popup-images-container">
                  <div className="image-grid">
                    {selectedTask.images.map((img: string, index: number) => (
                      <img
                        key={index}
                        src={img}
                        alt="Project"
                        className="popup-image"
                        onClick={() => setZoomedImage(img)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Approved & Not Approved Buttons */}
            <div className="popup-actions">
              <button className="approved-btn">Approved</button>
              <button className="not-approved-btn">Not Approved</button>
            </div>
          </div>
        </div>
      )}

      {/* Zoomed Image Popup */}
      {zoomedImage && (
        <div
          className="zoomed-popup-overlay"
          onClick={() => setZoomedImage(null)}
        >
          <div className="zoomed-popup-content">
            <img src={zoomedImage} alt="Zoomed In" className="zoomed-image" />
            <span className="close-zoomed-popup">&times;</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoterPage;
