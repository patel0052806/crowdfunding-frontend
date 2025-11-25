import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <main>
      <section className="section-hero">
        <div className="container grid grid-two-cols">
          <div className="hero-content">
            <h1>Welcome to Our Crowdfunding Platform</h1>
            <p>Join us in making a difference.</p>
            <div className="btn btn-group">
              <Link to="/contact">
                <button className="btn">Contact Now</button>
              </Link>
              <Link to="/campaigns">
                <button className="btn">View Campaigns</button>
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="/src/assets/launchpad.svg"
              alt="Launch Pad"
              width={200}
              height={200}
            />
          </div>
        </div>
      </section>
    </main>
  );
};