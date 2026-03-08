import { useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import "./ApplyForCampaign.css";

export const ApplyForCampaign = () => {
  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    goal: "",
    category: "General",
    deadline: "",
  });

  const { token, isLoggedIn } = useAuth();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCampaign({
      ...campaign,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/data/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(campaign),
      });

      if (response.ok) {
        setCampaign({
          title: "",
          description: "",
          goal: "",
          category: "General",
          deadline: "",
        });
        toast.success("Campaign application submitted successfully");
      } else {
        toast.error("Failed to submit campaign application");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while submitting the application");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="apply-campaign-page">
      {isLoggedIn ? (
        <div className="container apply-campaign-shell">
          <aside className="apply-campaign-intro">
            <h1>Start Your Campaign</h1>
            <p>
              Share your idea, set a clear goal, and submit it for admin review.
              Once approved, your campaign goes live for donations.
            </p>
            <img
              src="/images/image.png"
              alt="apply for campaign"
              width="420"
              height="420"
            />
          </aside>

          <div className="apply-campaign-card">
            <h2>Campaign Application Form</h2>
            <form onSubmit={handleSubmit}>
              <div className="field-row">
                <div>
                  <label htmlFor="title">Campaign Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter campaign title"
                    required
                    autoComplete="off"
                    value={campaign.title}
                    onChange={handleInput}
                  />
                </div>
              </div>

              <div className="field-row">
                <div>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Explain your campaign purpose"
                    required
                    autoComplete="off"
                    value={campaign.description}
                    onChange={handleInput}
                    rows="4"
                  ></textarea>
                </div>
              </div>

              <div className="field-grid">
                <div>
                  <label htmlFor="goal">Funding Goal ($)</label>
                  <input
                    type="number"
                    id="goal"
                    name="goal"
                    placeholder="e.g. 5000"
                    required
                    autoComplete="off"
                    value={campaign.goal}
                    onChange={handleInput}
                  />
                </div>

                <div>
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={campaign.category}
                    onChange={handleInput}
                  >
                    <option value="General">General</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Environment">Environment</option>
                    <option value="Technology">Technology</option>
                    <option value="Arts">Arts</option>
                    <option value="Social Cause">Social Cause</option>
                  </select>
                </div>
              </div>

              <div className="field-row">
                <div>
                  <label htmlFor="deadline">Deadline</label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    required
                    autoComplete="off"
                    value={campaign.deadline}
                    onChange={handleInput}
                    min={today}
                  />
                </div>
              </div>

              <button type="submit" className="btn apply-submit-btn">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="container apply-login-note">
          <h1>Please login to apply for a campaign</h1>
        </div>
      )}
    </section>
  );
};
