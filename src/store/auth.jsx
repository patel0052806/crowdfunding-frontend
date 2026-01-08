import { createContext, useContext, useEffect, useState, useCallback } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState("");
  const [campaigns,setCampaigns] = useState("")

  //function to stored the token in local storage
  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    return localStorage.setItem("token", serverToken);
  };

  let isLoggedIn = !!token;
  console.log("token", token);
  console.log("isLoggedIn ", isLoggedIn);

  //tackling logout
  const LogoutUser = () => {
    setToken("");
    localStorage.removeItem("token");
    setUser("");
  };

  const useAuthentication = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Authenticated user data:", data.userData);
        setUser(data.userData);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  //to fetch campaigns
  const getCampaigns = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/data/campaigns`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCampaigns(data);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    if (token) {
      useAuthentication();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, storeTokenInLS, LogoutUser, user, token, campaigns }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provider");
  }
  return authContextValue;
};