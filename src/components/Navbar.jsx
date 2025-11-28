import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../store/auth.jsx";
import { useTheme } from "../store/theme.jsx";
import { useState } from "react";

export const Navbar = () => {
  const { isLoggedIn, user } = useAuth();
  const { currentTheme, changeTheme, themes } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  return (
    <>
      <header>
        <div className="container">
          <div className="logo-brand">
            <NavLink to="/"><img src="/images/home.png" alt="Launch Pad" />Launch Pad</NavLink>
          </div>
          <nav>
            <div className="theme-switcher">
              <button 
                className="theme-btn"
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                title="Change Theme"
              >
                <span className="theme-icon">🎨</span>
                <span className="theme-name">{currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}</span>
              </button>
              {showThemeMenu && (
                <div className="theme-menu">
                  {themes.map((theme, index) => (
                    <button
                      key={theme}
                      className={`theme-option ${currentTheme === theme ? "active" : ""}`}
                      data-theme={theme}
                      onClick={() => {
                        changeTheme(theme);
                        setShowThemeMenu(false);
                      }}
                    >
                      <span className="theme-dot" data-theme={theme}></span>
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>

              <li>
                <NavLink to="/campaigns">Campaign details</NavLink>
              </li>
              <li>
                {!(user && user.isAdmin) && <NavLink to="/apply-for-campaign">Apply for Campaign</NavLink>}
              </li>
              <li>
                <NavLink to="/contact">Contact</NavLink>
              </li>
              {user && user.isAdmin && (
                <li>
                  <NavLink to="/admin/users">Admin</NavLink>
                </li>
              )}
               {isLoggedIn ? (
                <li>
                  <NavLink to="/logout">Logout</NavLink>
                </li>
              ) : (
                <>
                  <li>
                    <NavLink to="/register"> Register </NavLink>
                  </li>
                  <li>
                    <NavLink to="/login"> Login </NavLink>
                  </li>
              </>
            )
            } 
              
            </ul>
          </nav>
        </div> 
      </header>
    </>
  );
};
