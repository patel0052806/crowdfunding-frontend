import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import "./Campaigns.css";

import { toast } from "react-toastify";
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/data/campaigns/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

    let url = "";
    if (platform === "whatsapp") {
      url = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
    } else if (platform === "twitter") {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === "facebook") {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  const categories = ["Education", "Healthcare", "Environment", "Technology", "Arts", "Social Cause", "General"];

  const totalGoal = campaigns.reduce((sum, item) => sum + Number(item.goal || 0), 0);
  const totalRaised = campaigns.reduce((sum, item) => sum + Number(item.raised || 0), 0);

  const formatCurrency = (value) => `$${Number(value || 0).toLocaleString()}`;

  return (
    <section className="section-campaigns">
      <div className="container campaigns-shell">
        <div className="campaigns-hero">
          <h1>Explore Live Campaigns</h1>
          <p>Discover causes making real impact and support them instantly.</p>
        </div>

        <div className="campaigns-overview">
          <div className="overview-card">
            <span>Total Campaigns</span>
            <strong>{campaigns.length}</strong>
          </div>
          <div className="overview-card">
            <span>Total Goal</span>
            <strong>{formatCurrency(totalGoal)}</strong>
          </div>
          <div className="overview-card">
            <span>Total Raised</span>
            <strong>{formatCurrency(totalRaised)}</strong>
          </div>
        </div>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="category-select">
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {user && user.isAdmin && (
            <button className="btn add-campaign-btn" onClick={handleAddCampaignClick}>
              Add New Campaign
            </button>
          )}
        </div>

        <div className="campaigns-grid">
          {loading ? (
            <Loading />
          ) : campaigns && campaigns.length > 0 ? (
            campaigns.map((curElem, index) => {
              const { _id, title, category: campaignCategory, goal, raised, description, deadline } = curElem;
              const rawProgress = goal > 0 ? (raised / goal) * 100 : 0;
              const progressPercentage = Math.max(0, Math.min(rawProgress, 100));

              return (
                <article className="campaign-card fade-in-up" key={_id || index}>
                  <div className="campaign-card-top">
                    <h3>{title}</h3>
                    <span className="category-pill">{campaignCategory || "General"}</span>
                  </div>

                  <p className="campaign-description">{description}</p>

                  <div className="progress-block">
                    <div className="progress-label-row">
                      <span>{formatCurrency(raised)} raised</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                  </div>

                  <div className="campaign-stats">
                    <p><strong>Goal:</strong> {formatCurrency(goal)}</p>
                    <p><strong>Deadline:</strong> {new Date(deadline).toLocaleDateString()}</p>
                  </div>

                  <div className="card-actions">
                    {user ? (
                      <button className="btn primary" onClick={() => handleDonateClick(curElem)}>
                        Donate
                      </button>
                    ) : (
                      <button className="btn primary" onClick={() => navigate("/login")}>
                        Login to Donate
                      </button>
                    )}

                    <div className="share-buttons">
                      <button className="share-btn share-whatsapp" onClick={() => handleShare(curElem, "whatsapp")} title="Share on WhatsApp">
                        WA
                      </button>
                      <button className="share-btn share-twitter" onClick={() => handleShare(curElem, "twitter")} title="Share on X">
                        X
                      </button>
                      <button className="share-btn share-facebook" onClick={() => handleShare(curElem, "facebook")} title="Share on Facebook">
                        FB
                      </button>
                    </div>
                  </div>

                  {user && user.isAdmin && (
                    <div className="admin-actions">
                      <button className="btn btn-delete" onClick={() => deleteCampaign(_id)}>
                        Delete
                      </button>
                      <button className="btn" onClick={() => navigate(`/admin/campaigns/edit/${_id}`)}>
                        Update
                      </button>
                      <button className="btn" onClick={() => navigate(`/admin/donations/${_id}`)}>
                        Donations
                      </button>
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <p className="empty-campaigns">No campaigns to display.</p>
          )}
        </div>
      </div>

      {showModal && <DonationModal campaign={selectedCampaign} onClose={handleCloseModal} />}
    </section>
  );
};
