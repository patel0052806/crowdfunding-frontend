import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";
import { toast } from "react-toastify";
import "./Register.css";

export const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const res_data = await response.json();

      if (response.ok) {
        toast.success("registration successful, please verify your email");
        setShowOtpInput(true);

        try {
          const otpResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email }),
          });

          if (!otpResponse.ok) {
            const otp_res_data = await otpResponse.json();
            toast.error(otp_res_data.error || otp_res_data.message);
          }
        } catch (error) {
          toast.error("Failed to send OTP. Please try again later.");
          console.error("Error sending OTP:", error);
        }
      } else {
        toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
        setErrorMsg(res_data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setErrorMsg("Network error. Please try again later.");
      console.error("Error", error);
    }
  };

  return (
    <section className="section-register auth-register-page">
      <div className="container auth-container">
        <div className="registration-form auth-card">
          <p className="auth-register-badge">Create Account</p>
          <h1 className="main-heading">Registration Form</h1>
          <p className="auth-register-subtitle">Join Launch Pad to start and support campaigns that create real impact.</p>

          {errorMsg && <div className="auth-error-msg">{errorMsg}</div>}

          {!showOtpInput ? (
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleInput}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInput}
                  placeholder="Enter email"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleInput}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleInput}
                  placeholder="Create password"
                  required
                />
              </div>

              <button type="submit" className="btn auth-submit-btn">Register Now</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div>
                <label htmlFor="otp">OTP</label>
                <input
                  id="otp"
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                />
              </div>

              <button type="submit" className="btn auth-submit-btn">Verify OTP</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
