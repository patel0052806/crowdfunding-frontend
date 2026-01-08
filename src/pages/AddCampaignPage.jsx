import { AddCampaign } from "../components/AddCampaign";

import "./AddCampaignPage.css";

export const AddCampaignPage = () => {
  return (
    <div className="page-container">
      <section className="section-add-campaign">
        <div className="container">
          <h1 className="main-heading">Add a New Campaign</h1>
        </div>
        <div className="container">
          <AddCampaign />
        </div>
      </section>
    </div>
  );
};