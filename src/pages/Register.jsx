import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";
import { toast } from "react-toastify";

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
    let name = e.target.name;
    let value = e.target.value;
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

  // handle form on submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Clear previous errors

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const res_data = await response.json();
      console.log("res from server", res_data.extraDetails);
      if (response.ok) {
        toast.success("registration successful, please verify your email");
        setShowOtpInput(true);

        // send otp
        await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email }),
        });
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
    <>
      <section>
        <main>
          <div className="registration-form">
            <h1 className="main-heading mb-3">registration form</h1>
            <br />
            {errorMsg && (
              <div style={{ color: "red", marginBottom: "10px" }}>
                {errorMsg}
              </div>
            )}
            {!showOtpInput ? (
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username">username</label>
                  <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleInput}
                    placeholder="username"
                  />
                </div>
                <div>
                  <label htmlFor="email">email</label>
                  <input
                    type="text"
                    name="email"
                    value={user.email}
                    onChange={handleInput}
                    placeholder="email"
                  />
                </div>
                <div>
                  <label htmlFor="phone">phone</label>
                  <input
                    type="number"
                    name="phone"
                    value={user.phone}
                    onChange={handleInput}
                  />
                </div>
                <div>
                  <label htmlFor="password">password</label>
                  <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleInput}
                    placeholder="password"
                  />
                </div>
                <br />
                <button type="submit" className="btn btn-submit">
                  Register Now
                </button>
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
    </>
  );
};