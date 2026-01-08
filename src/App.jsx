import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";

import { Contact } from "./pages/Contact";
import { Campaigns } from "./pages/Campaigns";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Navbar } from "./components/Navbar";
import { Error } from "./pages/Error";
import { Logout } from "./pages/logout";
import { AdminLayout } from "./components/layouts/Admin-Layout";
import { AdminUsers } from "./pages/Admin-Users";
import { AdminContacts } from "./pages/Admin-Contacts";
import { AdminUpdate } from "./pages/Admin-Update";
import { AdminEditUser } from "./pages/AdminEditUser";
import { AddCampaignPage } from "./pages/AddCampaignPage";
import { DonationReport } from "./pages/DonationReport";
import { ApplyForCampaign } from "./pages/ApplyForCampaign";
import { Receipt } from "./pages/Receipt";
import { AdminDashboard } from "./pages/Admin-Dashboard";
import { ThemeProvider } from "./store/theme.jsx";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/apply-for-campaign" element={<ApplyForCampaign />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/receipt/:receiptId" element={<Receipt />} />
          <Route path="*" element={<Error />} />
          <Route path="/admin" element={<AdminLayout />}>
           <Route path="users" element={<AdminUsers />} />
           <Route path="users/:id" element={<AdminEditUser />} />
           <Route path="contacts" element={<AdminContacts />} />
           <Route path="add-campaign" element={<AddCampaignPage />} />
           <Route path="dashboard" element={<AdminDashboard />} />
           <Route path="campaigns/edit/:id" element={<AdminUpdate />} />
           <Route path="donations/:campaignId" element={<DonationReport />} />
          </Route>
        </Routes>
        
      </Router>
    </ThemeProvider>
  );
};

export default App;