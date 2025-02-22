import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CloudinaryUpload from "../../config/cloudinary"; // Assuming Cloudinary upload component
import "./form.css";

const Form = () => {
    const [task, setTask] = useState({ name: "", description: "", imageUrl: "" });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (url: string) => {
        setTask((prevTask) => ({ ...prevTask, imageUrl: url }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Task Submitted:", task);

        // Navigate back after submission
        navigate("/"); // Change route as needed
    };

    return (
        <div className="form-wrapper">
            <div className="form-container">
                <h2>Add New Task</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="taskName">Task Name</label>
                    <input 
                        type="text" 
                        id="taskName" 
                        name="name" 
                        placeholder="Enter task name" 
                        value={task.name} 
                        onChange={handleChange} 
                        required
                    />
    
                    <label htmlFor="taskDesc">Task Description</label>
                    <input 
                        type="text" 
                        id="taskDesc" 
                        name="description" 
                        placeholder="Enter task description" 
                        value={task.description} 
                        onChange={handleChange} 
                        required
                    />
    
                    {/* Image Upload */}
                    <label>Upload Task Image</label>
                    <CloudinaryUpload onUpload={handleImageUpload} multiple />
    
                    {/* Image Preview */}
                    {task.imageUrl && (
                        <div className="image-preview">
                           
                            <img src={task.imageUrl} alt="Uploaded Task" />
                        </div>
                    )}
    
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Form;