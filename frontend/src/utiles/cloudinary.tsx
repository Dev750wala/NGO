import React, { useState } from "react";
import axios from "axios";

const CLOUD_NAME = "duvfnrfeu"; // Replace with your Cloudinary cloud name
const UPLOAD_PRESET = "NGO Donating app"; // Replace with your Upload Preset

const CloudinaryUpload: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );

      console.log("Upload Response:", response.data);
      setImageUrl(response.data.secure_url);

      console.log(imageUrl)
      
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      {loading && <p>Uploading...</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ width: "300px", marginTop: "10px" }} />}
    </div>
  );
};

export default CloudinaryUpload;
