import { useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";

export const AddCampaign = ({ fetchCampaigns }) => {
  const [newCampaign, setNewCampaign] = useState({ title: "", description: "", goal: "", deadline: "" });
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCampaign({ ...newCampaign, [name]: value });
  };

  const addCampaign = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/data/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCampaign),
      });
      if (response.ok) {
        if (fetchCampaigns) {
          fetchCampaigns();
        }
        setNewCampaign({ title: "", description: "", goal: "", deadline: "" });
        navigate("/campaigns"); // Redirect to campaigns page
      }
    } catch (error) {
      console.error("Error adding campaign:", error);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="add-campaign-form">
      <h2>Add a New Campaign</h2>
      <form onSubmit={addCampaign}>
        <input type="text" name="title" placeholder="Title" value={newCampaign.title} onChange={handleInputChange} required />
        <textarea name="description" placeholder="Description" value={newCampaign.description} onChange={handleInputChange} required />
        <input type="number" name="goal" placeholder="Goal" value={newCampaign.goal} onChange={handleInputChange} required />
        <input type="date" name="deadline" placeholder="Deadline" value={newCampaign.deadline} onChange={handleInputChange} min={today} required />
        <button type="submit">Add Campaign</button>
      </form>
    </div>
  );
};