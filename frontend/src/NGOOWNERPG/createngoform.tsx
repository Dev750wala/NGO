import React, { useState } from "react";
import { useAccount } from "wagmi";
import "./NgoSignupForm.css";
import CloudinaryUpload from "../../config/cloudinary";
import { address as contractAddress, abi as contractAbi } from "../../../hardhat-back/deployments/sepolia/NGOFunding.json";
import { useWriteContract } from "wagmi";

const NgoSignupForm: React.FC = () => {
  const { isPending, writeContract } = useWriteContract();
  const { isConnected } = useAccount();
  const [formData, setFormData] = useState({ ngoName: "", description: "", imageUrl: "" });

  console.log("contractAddress", contractAddress);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("handle submit 1");
    
    e.preventDefault();
    if (!isConnected) {
      alert("Please connect your wallet to sign up");
      return;
    }
    console.log("handle submit 2");
    console.log("handle submit 3");
    
    writeContract({
      address: `0x${contractAddress.split("0x")[1]}`,
      abi: contractAbi,
      functionName: "registerNGO",
      args: [formData.ngoName, formData.description, formData.imageUrl],
      value: 11000000000000000n
    });
    console.log("handle submit 4");
    
    // Clear input fields and remove uploaded image
    setFormData({ ngoName: "", description: "", imageUrl: "" });
    console.log("handle submit 5");
  };
  
  const handleImageUpload = (imageUrls: string[]) => {
    if (imageUrls.length > 0) {
      setFormData((prevData) => ({ ...prevData, imageUrl: imageUrls[0] }));
    }
  };
  
  return (
    <div className="ngo-form-wrapper"> {/* Centering wrapper */}
      <div className="ngo-form-container">
        <h2 className="ngo-form-title">Register Your NGO</h2>
        <form className="ngo-form" onSubmit={handleSubmit}>
          <label className="ngo-form-label" htmlFor="ngoName">NGO Name</label>
          <input
            className="ngo-form-input"
            type="text"
            id="ngoName"
            name="ngoName"
            value={formData.ngoName}
            onChange={handleChange}
            required
          />
          <label className="ngo-form-label" htmlFor="description">Description</label>
          <textarea
            className="ngo-form-textarea"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          /><br/>
          
          {/* Cloudinary Upload */}
          <CloudinaryUpload onUpload={handleImageUpload} />

          {/* Show Image Preview if an image is uploaded */}
          {/* {formData.imageUrl && (
            <div className="ngo-image-preview">
              <img src={formData.imageUrl} alt="Uploaded NGO" className="ngo-preview-img"/>
            </div>
          )} */}

          <button className="ngo-form-button" type="submit">{isPending ? "Confirming..." : "Sign Up"}</button>
        </form>
      </div>
    </div>
  );
};

export default NgoSignupForm;