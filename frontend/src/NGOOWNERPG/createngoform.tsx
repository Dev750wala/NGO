import React, { useState } from "react";
import { useAccount } from "wagmi";
import "./NgoSignupForm.css";
import CloudinaryUpload from "../../config/cloudinary";
import { address as contractAddress, abi as contractAbi } from "../../../hardhat-back/deployments/ganache/NGOFunding.json";
import { useWriteContract } from "wagmi";

const NgoSignupForm: React.FC = () => {
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({ ngoName: "", description: "", imageUrl: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      alert("Please connect your wallet to sign up");
      return;
    }

    console.log("NGO Details:", { ...formData, walletAddress: address });

    writeContract({
      address: `0x${contractAddress.split("0x")[1]}`,
      abi: contractAbi,
      functionName: "registerNGO",
      args: [formData.ngoName, formData.description],
    });

    // Clear input fields and remove uploaded image
    setFormData({ ngoName: "", description: "", imageUrl: "" });
  };

  const handleImageUpload = (url: string) => {
    setFormData((prevData) => ({ ...prevData, imageUrl: url }));
  };

  return (
    <div className="form-container">
      <h2>Register Your NGO</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="ngoName">NGO Name</label>
        <input
          type="text"
          id="ngoName"
          name="ngoName"
          value={formData.ngoName}
          onChange={handleChange}
          required
        />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        
        {/* Cloudinary Upload */}
        <CloudinaryUpload onUpload={handleImageUpload} />

        {/* Show Image Preview if an image is uploaded */}
        {formData.imageUrl && (
          <div className="image-preview">
            <img src={formData.imageUrl} alt="Uploaded NGO" />
          </div>
        )}

        <button type="submit">{isPending ? "Confirming..." : "Sign Up"}</button>
      </form>
    </div>
  );
};

export default NgoSignupForm;