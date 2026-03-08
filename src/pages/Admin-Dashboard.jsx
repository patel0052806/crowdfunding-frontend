import { useEffect, useMemo, useState } from "react";
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
        setCampaigns(Array.isArray(data) ? data : []);
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json().catch(() => null);
      if (response.ok) {
        fetchPendingCampaigns();
        toast.success(`Campaign ${status} successfully`);
        if (data && data.previewUrl) {
          try {
            window.open(data.previewUrl, "_blank");
          } catch (e) {
            // no-op
          }
          toast.info("Email preview opened in a new tab");
        }
      } else {
        toast.error(data && data.msg ? data.msg : `Failed to ${status} campaign`);
      }
    } catch (error) {
      console.log(error);
      toast.error(`An error occurred while ${status} the campaign`);
    }
  };

  const metrics = useMemo(() => {
    const pendingCount = campaigns.length;
    const totalGoal = campaigns.reduce((sum, c) => sum + Number(c.goal || 0), 0);
    const nearestDeadline =
      campaigns.length > 0
        ? [...campaigns]
            .map((c) => new Date(c.deadline))
            .filter((d) => !Number.isNaN(d.getTime()))
            .sort((a, b) => a - b)[0]
        : null;

    return {
      pendingCount,
      totalGoal,
      nearestDeadline,
    };
  }, [campaigns]);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="admin-dashboard">
      <div className="container">
        <div className="dashboard-hero">
          <h1 className="main-heading">Admin Dashboard</h1>
          <p className="dashboard-tagline">Review, approve, and manage campaigns faster.</p>
        </div>

        <div className="dashboard-metrics">
          <article className="metric-card">
            <p className="metric-label">Pending Requests</p>
            <p className="metric-value">{metrics.pendingCount}</p>
          </article>
          <article className="metric-card">
            <p className="metric-label">Total Funding Asked</p>
            <p className="metric-value">${metrics.totalGoal.toLocaleString()}</p>
          </article>
          <article className="metric-card">
            <p className="metric-label">Nearest Deadline</p>
            <p className="metric-value metric-date">
              {metrics.nearestDeadline ? metrics.nearestDeadline.toLocaleDateString() : "-"}
            </p>
          </article>
        </div>

        <div className="section-header">
          <h2 className="sub-heading">Pending Campaigns</h2>
          <span className="pending-badge">{campaigns.length} pending</span>
        </div>

        <div className="campaign-grid">
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <article className="campaign-card" key={campaign._id}>
                <div className="campaign-card-head">
                  <h3>{campaign.title}</h3>
                  <span className="status-pill">Pending</span>
                </div>

                <p className="campaign-description">{campaign.description}</p>

                <div className="campaign-meta">
                  <div className="meta-item">
                    <span>Goal</span>
                    <strong>${Number(campaign.goal || 0).toLocaleString()}</strong>
                  </div>
                  <div className="meta-item">
                    <span>Deadline</span>
                    <strong>{new Date(campaign.deadline).toLocaleDateString()}</strong>
                  </div>
                </div>

                <div className="admin-actions">
                  <button className="btn btn-approve" onClick={() => handleUpdateStatus(campaign._id, "approved")}>Approve</button>
                  <Link className="btn btn-edit" to={`/admin/campaigns/edit/${campaign._id}`}>Edit</Link>
                  <button className="btn btn-reject" onClick={() => handleUpdateStatus(campaign._id, "rejected")}>Reject</button>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <h3>No pending campaigns</h3>
              <p>Everything is reviewed. New submissions will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

