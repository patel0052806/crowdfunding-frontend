import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import "./Campaigns.css";

import { toast } from 'react-toastify';
import { DonationModal } from "../components/DonationModal";
import "../components/DonationModal.css";
import Loading from "../components/Loading";

export const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (searchTerm) {
        query.append("search", searchTerm);
      }
      if (category) {
        query.append("category", category);
      }

      const queryString = query.toString();
      const url = queryString
        ? `${import.meta.env.VITE_API_URL}/api/data/campaigns?${queryString}`
        : `${import.meta.env.VITE_API_URL}/api/data/campaigns`;

      const response = await fetch(url, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
        fetchCampaigns();
    }, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm, category]);

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
    if (!user) {
      toast.info("Please login to donate.");
      navigate("/login");
      return;
    }
    setSelectedCampaign(campaign);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCampaign(null);
    fetchCampaigns();
  };

  const handleShare = (campaign, platform) => {
    const shareUrl = `${window.location.origin}/campaigns/${campaign._id}`;
    const shareText = `Check out this amazing campaign: ${campaign.title} - Help reach the goal of $${campaign.goal}`;
    
    let url = '';
    if (platform === 'whatsapp') {
      url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    } else if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const categories = ['Education', 'Healthcare', 'Environment', 'Technology', 'Arts', 'Social Cause', 'General'];

  return (
    <section className="section-campaigns">
      <div className="container">
        <h1 className="main-heading">All Campaigns</h1>
      </div>
      <div className="container filter-bar">
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      {user && user.isAdmin && (
        <div className="container">
          <button className="btn" onClick={handleAddCampaignClick}>Add New Campaign</button>
        </div>
      )}
      <div className="container grid">
        {loading ? (
          <Loading />
        ) : campaigns && campaigns.length > 0 ? (
          campaigns.map((curElem, index) => {
            const { _id, title, goal, raised, description, deadline } = curElem;
            const progressPercentage = (raised / goal) * 100;
            return (
              <div className="card fade-in-up" key={index}>
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
                  {user ? (
                    <button className="btn" onClick={() => handleDonateClick(curElem)}>Donate</button>
                  ) : (
                    <button className="btn" onClick={() => navigate("/login")}>Login to Donate</button>
                  )}
                  <div className="share-buttons">
                    <button className="share-btn share-whatsapp" onClick={() => handleShare(curElem, 'whatsapp')} title="Share on WhatsApp">
                      <span>💬</span>
                    </button>
                    <button className="share-btn share-twitter" onClick={() => handleShare(curElem, 'twitter')} title="Share on Twitter">
                      <span>𝕏</span>
                    </button>
                    <button className="share-btn share-facebook" onClick={() => handleShare(curElem, 'facebook')} title="Share on Facebook">
                      <span>f</span>
                    </button>
                  </div>
                  {user && user.isAdmin && (
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