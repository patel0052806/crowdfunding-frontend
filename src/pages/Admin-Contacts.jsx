import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import "./Admin-Contacts.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../components/Loading";

export const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const getAllContacts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/contacts`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      } else {
        const errorData = await response.json();
        console.error("Error fetching contacts:", errorData.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // delete contact
  const deleteContact = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/contacts/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(`contact after delete ${data}`)
      if(response.ok){
        getAllContacts();
        toast.success("Contact deleted successfully");
      }
      else{
        toast.error("Contact not deleted");
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllContacts();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="admin-contacts-section">
    <ToastContainer />
      <div className="container">
        <h1>All Contacts</h1>
      </div>
      <div className="container admin-contacts-grid">
        {contacts.map((curContact, index) => (
          <div className="contact-card fade-in-up" key={index}>
            <div className="contact-info">
              <p><span className="label">Name:</span> {curContact.username}</p>
              <p><span className="label">Email:</span> {curContact.email}</p>
              <div className="message">
                <p><span className="label">Message:</span></p>
                <p>{curContact.message}</p>
              </div>
            </div>
            <div className="contact-actions">
              <button className="delete-btn" onClick={() => deleteContact(curContact._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};