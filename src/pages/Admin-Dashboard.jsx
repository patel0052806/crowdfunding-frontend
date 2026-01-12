import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import "./Admin-Dashboard.css";
import Loading from "../components/Loading";

export const AdminDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchPendingCampaigns = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/campaigns/pending`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      } else {
        toast.error("Failed to fetch pending campaigns");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while fetching pending campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCampaigns();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/campaigns/${id}/status`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json().catch(() => null);
      if (response.ok) {
        fetchPendingCampaigns();
        toast.success(`Campaign ${status} successfully`);
        if (data && data.previewUrl) {
          console.log('Preview email URL:', data.previewUrl);
          // open preview automatically in a new tab for development convenience
          try { window.open(data.previewUrl, '_blank'); } catch (e) { /* ignore */ }
          toast.info('Email preview opened in a new tab');
        }
      } else {
        toast.error(data && data.msg ? data.msg : `Failed to ${status} campaign`);
      }
    } catch (error) {
      console.log(error);
      toast.error(`An error occurred while ${status} the campaign`);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="admin-dashboard">
      <div className="container">
        <h1 className="main-heading">Admin Dashboard</h1>
        <h2 className="sub-heading">Pending Campaigns</h2>
        <div className="grid grid-three-cols">
          {campaigns.map((campaign) => (
            <div className="card" key={campaign._id}>
              <div className="card-details">
                <h3>{campaign.title}</h3>
                <p>{campaign.description}</p>
                <p>Goal: ${campaign.goal}</p>
                <p>Deadline: {new Date(campaign.deadline).toLocaleDateString()}</p>
                <div className="admin-actions">
                  <button className="btn" onClick={() => handleUpdateStatus(campaign._id, 'approved')}>Approve</button>
                  <button className="btn btn-delete" onClick={() => handleUpdateStatus(campaign._id, 'rejected')}>Reject</button>
                  <Link to={`/admin/campaigns/edit/${campaign._id}`}>
                    <button className="btn">Edit</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
