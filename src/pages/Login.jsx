import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";
import {  toast } from 'react-toastify';

export const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();

  // handle input change
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page refresh
    console.log(user);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      console.log("login form: ", response);
      
      const res_data = await response.json();

      if (response.ok) {
        toast.success("login successful");
        storeTokenInLS(res_data.token);        //localStorage.setItem("token", res_data.token);
        setUser({ email: "", password: "" });
        console.log(res_data);
        navigate("/");
      } else {
        toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
        console.log("error inside response ", "error");
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <section>
      <main>
        <div className="login-form">
          <h1 className="main-heading mb-3">Login</h1>
          <br />
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                id="email"
                required
                autoComplete="off"
                value={user.email}
                onChange={handleInput}
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                id="password"
                required
                autoComplete="off"
                value={user.password}
                onChange={handleInput}
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </main>
    </section>
  );
};
