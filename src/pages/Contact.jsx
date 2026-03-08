import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import "./Contact.css";

export const Contact = () => {
  const [contact, setContact] = useState({
    username: "",
    email: "",
    message: "",
  });

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    setContact((prev) => ({
      ...prev,
      username: user.username || "",
      email: user.email || "",
    }));
  }, [user]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/form/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        setContact((prev) => ({ ...prev, message: "" }));
      } else {
        toast.error("Failed to send message. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <section className="section-contact contact-page">
      <div className="container">
        <p className="contact-eyebrow">Support</p>
        <h1 className="main-heading">Contact Us</h1>
        <p className="contact-subtitle">
          Have a campaign question or need help with a donation? Send us a message and our team will get back to you.
        </p>
      </div>

      <div className="container grid grid-two-column contact-content">
        <div className="contact-visual">
          <div className="contact-img">
            <img src="./images/contact.png" alt="Contact support" />
          </div>
          <div className="contact-info-card">
            <h2>We usually reply within 24 hours</h2>
            <p>
              Share your campaign ID, donation date, or any issue details so we can help faster.
            </p>
          </div>
        </div>

        <div className="section-form">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Name</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter your name"
                required
                autoComplete="off"
                value={contact.username}
                onChange={handleInput}
              />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                required
                autoComplete="off"
                value={contact.email}
                onChange={handleInput}
              />
            </div>

            <div>
              <label htmlFor="message">Message</label>
              <textarea
                name="message"
                id="message"
                cols="30"
                rows="6"
                autoComplete="off"
                value={contact.message}
                onChange={handleInput}
                placeholder="Tell us how we can help"
                required
              ></textarea>
            </div>

            <button className="btn contact-submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};
