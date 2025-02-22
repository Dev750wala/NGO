import React, { useState } from "react";
import axios from "axios";

const CLOUD_NAME = "duvfnrfeu";
const UPLOAD_PRESET = "NGO Donating app"; // Replace with your Upload Preset

interface CloudinaryUploadProps {
  onUpload: (imageUrls: string[]) => void; // Callback function to pass array of uploaded image URLs
}

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({ onUpload }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]); // To store URLs of uploaded images

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setLoading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData
        );
        uploadedUrls.push(response.data.secure_url); // Collect URLs from the response
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    setImageUrls(uploadedUrls); // Update state with all uploaded image URLs
    onUpload(uploadedUrls); // Pass the array of URLs to parent component
    setLoading(false);
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleUpload}
        multiple // Allows multiple file selection
        required
      />
      {loading && <p>Uploading...</p>}

      {/* Display image previews for uploaded files */}
      {imageUrls.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          {imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Uploaded preview ${index + 1}`}
              style={{ width: "150px", marginRight: "10px" }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;