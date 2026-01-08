import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AdminUpdate = () => {
  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    goal: "",
    deadline: "",
  });
  const [notFound, setNotFound] = useState(false);
  const { token } = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  const getCampaignById = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/campaigns/${params.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Format the deadline to YYYY-MM-DD for the input field
        const formattedDeadline = data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : '';
        setCampaign({ ...data, deadline: formattedDeadline });
        setNotFound(false);
      } else if (response.status === 404) {
        setNotFound(true);
      }
    } catch (error) {
      console.log(error);
      setNotFound(true);
    }
  };

  useEffect(() => {
    getCampaignById();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampaign({ ...campaign, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/campaigns/update/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(campaign),
      });
      if (response.ok) {
        toast.success("Campaign updated successfully");
        navigate("/admin/dashboard");
      } else {
        toast.error("Failed to update campaign");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the campaign");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="add-campaign-form">
      <button className="btn" style={{marginBottom: '1rem'}} onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</button>
      {notFound ? (
        <>
          <h2>Campaign Not Found</h2>
          <p>The campaign you are trying to edit does not exist or was deleted.</p>
        </>
      ) : (
        <>
          <h2>Edit Campaign</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Title" value={campaign.title} onChange={handleInputChange} required />
            <textarea name="description" placeholder="Description" value={campaign.description} onChange={handleInputChange} required />
            <input type="number" name="goal" placeholder="Goal" value={campaign.goal} onChange={handleInputChange} required />
            <input type="date" name="deadline" placeholder="Deadline" value={campaign.deadline} onChange={handleInputChange} min={today} required />
            <button type="submit">Update Campaign</button>
          </form>
        </>
      )}
    </div>
  );
};
