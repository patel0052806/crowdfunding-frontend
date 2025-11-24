import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import "./Campaigns.css";

import { toast } from 'react-toastify';
import { DonationModal } from "../components/DonationModal";
import "../components/DonationModal.css";

export const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/data/campaigns`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const deleteCampaign = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/data/campaigns/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        fetchCampaigns();
        toast.success("Campaign deleted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddCampaignClick = () => {
    navigate("/admin/add-campaign");
  };

  const handleDonateClick = (campaign) => {
    setSelectedCampaign(campaign);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCampaign(null);
    fetchCampaigns();
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <section className="section-campaigns">
      <div className="container">
        <h1 className="main-heading">All Campaigns</h1>
      </div>
      {user.isAdmin && (
        <div className="container">
          <button className="btn" onClick={handleAddCampaignClick}>Add New Campaign</button>
        </div>
      )}
      <div className="container grid grid-three-cols">
        {campaigns && campaigns.length > 0 ? (
          campaigns.map((curElem, index) => {
            const { _id, title, goal, raised, description, deadline } = curElem;
            const progressPercentage = (raised / goal) * 100;
            return (
              <div className="card fade-in-up" key={index}>
                <img src="images/image.png" alt={title} />
                <div className="card-details">
                  <h3>{title}</h3>
                  <div className="description">
                    <p>{description}</p>
                  </div>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                  <div className="campaign-stats">
                    <p>Raised: ${raised}</p>
                    <p className="goal">Goal: ${goal}</p>
                    <p className="deadline">Deadline: {new Date(deadline).toLocaleDateString()}</p>
                  </div>
                  <button className="btn" onClick={() => handleDonateClick(curElem)}>Donate</button>
                  {user.isAdmin && (
                    <>
                      <button className="btn btn-delete" onClick={() => deleteCampaign(_id)}>Delete</button>
                      <button className="btn" onClick={() => navigate(`/admin/campaigns/edit/${_id}`)}>Update</button>
                      <button className="btn" onClick={() => navigate(`/admin/donations/${_id}`)}>View Donations</button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>No campaigns to display.</p>
        )}
      </div>
      {showModal && (
        <DonationModal
            campaign={selectedCampaign}
            onClose={handleCloseModal}
        />
      )}
    </section>
  );
};