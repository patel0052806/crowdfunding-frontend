import { Link } from "react-router-dom";
import "./Home.css";

export const Home = () => {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="container grid grid-two-cols home-hero-grid">
          <div className="home-hero-content">
            <p className="home-hero-badge">Crowdfunding that moves fast</p>
            <h1>Launch campaigns, earn trust, and drive real impact.</h1>
            <p className="home-hero-subtitle">
              Build your story, reach supporters, and track donations with a platform designed for creators and contributors.
            </p>

            <div className="home-hero-actions">
              <Link to="/campaigns" className="btn">View Campaigns</Link>
              <Link to="/apply-for-campaign" className="btn home-btn-ghost">Start Campaign</Link>
            </div>

            <div className="home-quick-stats">
              <div>
                <strong>24/7</strong>
                <span>Platform Access</span>
              </div>
              <div>
                <strong>Secure</strong>
                <span>Donation Flow</span>
              </div>
              <div>
                <strong>Fast</strong>
                <span>Campaign Setup</span>
              </div>
            </div>
          </div>

          <div className="home-hero-visual">
            <img src="images/home.png" alt="Crowdfunding dashboard preview" width={430} height={500} />
            <div className="home-floating-card top">Live Campaigns</div>
            <div className="home-floating-card bottom">Transparent Progress</div>
          </div>
        </div>
      </section>

      <section className="home-trust-strip">
        <div className="container home-trust-grid">
          <div>
            <h3>Creator Friendly</h3>
            <p>Simple flow to launch and manage campaigns without technical overhead.</p>
          </div>
          <div>
            <h3>Donor Focused</h3>
            <p>Clean campaign details and clear progress indicators for confident giving.</p>
          </div>
          <div>
            <h3>Admin Controlled</h3>
            <p>Review tools and reporting support a reliable and moderated platform.</p>
          </div>
        </div>
      </section>

      <section className="home-steps">
        <div className="container">
          <h2>How It Works</h2>
          <div className="home-steps-grid">
            <article className="home-step-card">
              <span>01</span>
              <h3>Create Account</h3>
              <p>Register and complete your profile to start your journey.</p>
            </article>
            <article className="home-step-card">
              <span>02</span>
              <h3>Launch or Support</h3>
              <p>Create a campaign or contribute to one that aligns with your cause.</p>
            </article>
            <article className="home-step-card">
              <span>03</span>
              <h3>Track Progress</h3>
              <p>Monitor funding milestones and stay updated with campaign outcomes.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
};
