import React, { useState } from "react";
import { useAccount } from "wagmi";
import "./NgoSignupForm.css";
import CloudinaryUpload from "../../config/cloudinary";

const NgoSignupForm: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({ ngoName: "", description: "" });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  

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

  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
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
        {<CloudinaryUpload onUpload={handleImageUpload} />}
        <button type="submit">Sign Up</button>
      </form>
      {isConnected && <p>Connected Wallet: {address}</p>}
    </div>
  );
};

export default NgoSignupForm;
