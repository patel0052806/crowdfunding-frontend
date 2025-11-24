import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AdminEditUser = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    isAdmin: false,
  });
  const { token } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [notFound, setNotFound] = useState(false);

  const getUserById = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${params.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setNotFound(false);
      } else if (response.status === 404) {
        setNotFound(true);
      }
    } catch (error) {
      setNotFound(true);
    }
  };

  useEffect(() => {
    getUserById();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({ ...user, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/update/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        toast.success("User updated successfully");
        navigate("/admin/users");
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      toast.error("An error occurred while updating the user");
    }
  };

  return (
    <div className="add-campaign-form">
      {notFound ? (
        <>
          <h2>User Not Found</h2>
          <p>The user you are trying to edit does not exist or was deleted.</p>
        </>
      ) : (
        <>
          <h2>Edit User</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" value={user.username} onChange={handleInputChange} required />
            <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleInputChange} required />
            <input type="text" name="phone" placeholder="Phone" value={user.phone} onChange={handleInputChange} required />
            <label>
              <input type="checkbox" name="isAdmin" checked={user.isAdmin} onChange={handleInputChange} />
              Is Admin
            </label>
            <button type="submit">Update User</button>
          </form>
        </>
      )}
    </div>
  );
};
