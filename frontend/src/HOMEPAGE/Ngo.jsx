import React from "react";
import { useState } from "react";

import "./Donor.css";

const NGOsData = [
  {
    id: 1,
    name: "NGO 1",
    description: "Helping underprivileged children with education and food.",
    image: "https://via.placeholder.com/80", // Replace with actual image URL
  },
  {
    id: 2,
    name: "NGO 2",
    description: "Working towards environmental conservation and awareness.",
    image: "https://via.placeholder.com/80",
  },
  {
    id: 3,
    name: "NGO 3",
    description: "Providing healthcare facilities in remote areas.",
    image: "https://via.placeholder.com/80",
  },
];

function Donorlanding() {
  const [ngos, setNgos] = useState(NGOsData);

  return (
    <div className="container">
      <div className="header"></div>
      <div className="ngo-list">
        {ngos.map((ngo) => (
          <div className="ngo-card" key={ngo.id}>
            <img src={ngo.image} alt={ngo.name} className="ngo-image" />
            <div className="ngo-details">
              <h2 className="ngo-name">{ngo.name}</h2>
              <p className="ngo-description">{ngo.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



export default Donorlanding;
