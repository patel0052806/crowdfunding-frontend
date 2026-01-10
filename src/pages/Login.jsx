import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";
import {  toast } from 'react-toastify';

export const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email, otp }),
      });
      const res_data = await response.json();
      if (response.ok) {
        toast.success("OTP verified successfully");
        storeTokenInLS(res_data.token);
        navigate("/");
      } else {
        toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
      }
    } catch (error) {
      console.error("Error", error);
    }
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
        storeTokenInLS(res_data.token);
        setUser({ email: "", password: "" });
        console.log(res_data);
        navigate("/");
      } else {
        if (res_data.code === "EMAIL_NOT_VERIFIED") {
          setShowOtpInput(true);
          // send otp
          await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email }),
          });
        }
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
          {!showOtpInput ? (
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
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div>
                <label htmlFor="otp">OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                />
              </div>
              <br />
              <button type="submit" className="btn btn-submit">
                Verify OTP
              </button>
            </form>
          )}
        </div>
      </main>
    </section>
  );
};


