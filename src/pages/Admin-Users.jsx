import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import "./Admin-Users.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import Loading from "../components/Loading";

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, campaigns } = useAuth();

  const getAllUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }
      setUsers(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/delete/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        
        if (response.ok) {
          toast.success("User deleted successfully");
          getAllUsers(); // Refresh the user list
        } else {
          throw new Error(data.message || 'Failed to delete user');
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [token]); // Added token as dependency

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <section className="admin-users-section">
        <div className="container">
          <h2>Users Data</h2>
        </div>
        <div className="container admin-users-grid">
          {users.map((curUser) => (
            <div className="user-card fade-in-up" key={curUser._id}>
              <div className="user-info">
                <p><span className="label">Name:</span> {curUser.username}</p>
                <p><span className="label">Email:</span> {curUser.email}</p>
                <p><span className="label">Phone:</span> {curUser.phone}</p>
                {/* Show campaigns for this user */}
                <div style={{marginTop: '1rem'}}>
                  <span className="label">Campaigns:</span>
                  <ul>
                    {Array.isArray(campaigns) && campaigns.filter(c => c.creator === curUser._id).length > 0 ? (
                      campaigns.filter(c => c.creator === curUser._id).map(campaign => (
                        <li key={campaign._id}>
                          {campaign.title}
                          <Link to={`/admin/campaigns/edit/${campaign._id}`} style={{marginLeft: '1rem'}} className="edit-btn">Edit Campaign</Link>
                        </li>
                      ))
                    ) : (
                      <li>No campaigns</li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="user-actions">
                <Link to={`/admin/users/${curUser._id}`} className="edit-btn">Edit User</Link>
                <button 
                  className="delete-btn" 
                  onClick={() => deleteUser(curUser._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};