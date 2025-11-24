import { useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

export const ApplyForCampaign = () => {
  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    goal: "",
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

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h1>Apply for Campaign</h1>
          <section>
            <main>
              <div className="section-registration">
                <div className="container grid grid-two-cols">
                  <div className="registration-image">
                    <img
                      src="/images/image.png"
                      alt="a boy is trying to do registration"
                      width="500"
                      height="500"
                    />
                  </div>
                  <div className="registration-form">
                    <h1 className="main-heading mb-3">Application Form</h1>
                    <br />
                    <form onSubmit={handleSubmit}>
                      <div>
                        <label htmlFor="title">Title</label>
                        <input
                          type="text"
                          name="title"
                          placeholder="Enter campaign title"
                          required
                          autoComplete="off"
                          value={campaign.title}
                          onChange={handleInput}
                        />
                      </div>
                      <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                          name="description"
                          placeholder="Enter campaign description"
                          required
                          autoComplete="off"
                          value={campaign.description}
                          onChange={handleInput}
                        ></textarea>
                      </div>
                      <div>
                        <label htmlFor="goal">Goal</label>
                        <input
                          type="number"
                          name="goal"
                          placeholder="Enter campaign goal"
                          required
                          autoComplete="off"
                          value={campaign.goal}
                          onChange={handleInput}
                        />
                      </div>
                      <div>
                        <label htmlFor="deadline">Deadline</label>
                        <input
                          type="date"
                          name="deadline"
                          placeholder="Enter campaign deadline"
                          required
                          autoComplete="off"
                          value={campaign.deadline}
                          onChange={handleInput}
                          min={today}
                        />
                      </div>
                      <br />
                      <button type="submit" className="btn btn-submit">
                        Submit Application
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </main>
          </section>
        </>
      ) : (
        <h1>Please login to apply for a campaign</h1>
      )}
    </div>
  );
};