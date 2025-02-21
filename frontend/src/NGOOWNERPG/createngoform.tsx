import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import "./NgoSignupForm.css";
import CloudinaryUpload from "../../config/cloudinary";
import { address as contractAddress, abi as contractAbi} from "../../../hardhat-back/deployments/sepolia/NGOFunding.json";
import { useWriteContract, useReadContract } from "wagmi";

const NgoSignupForm: React.FC = () => {
  const { data: hash, isPending, writeContract } = useWriteContract()
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({ ngoName: "", description: "" });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ready, setReady] = useState(false)


  // console.log(`0x${contractAddress.split('0x')[1]}`);
    
  const { data: balance } = useReadContract({
    address: `0x${contractAddress.split('0x')[1]}`,
    abi: contractAbi,
    functionName: 'getAllNGOs',
  })
  console.log('balance', balance);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit', formData);

    alert(balance)

    // if (ready) {
      writeContract({
        address: `0x${contractAddress.split('0x')[1]}`,
        abi: contractAbi,
        functionName: 'registerNGO',
        // args: [formData.ngoName as string, formData.description as string, "imageUrl as string"],
        args: [formData.ngoName as string, formData.description as string, imageUrl as string],
        value: 10000000000000000n
      })
      console.log('writeContract', hash);
      console.log('writeContract', hash);
      console.log('writeContract', hash);
      console.log('writeContract', hash);
      console.log('writeContract', hash);
    // }
    
    if (!isConnected) {
      alert("Please connect your wallet to sign up");
      return;
    }
  };

  const handleImageUpload = (url: string) => {
    try {
      console.log('handleImageUpload', url);
      
      setImageUrl(url);
      setReady(true)
      
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    // setFormData((prevData) => ({ ...prevData, logo: url }));
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
        <button type="submit">{isPending ? 'Confirming...' : 'Register'}</button>
      </form>
      {isConnected && <p>Connected Wallet: {address}</p>}
    </div>
  );
};

export default NgoSignupForm;
