import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../store/auth.jsx";

export const Navbar = () => {
  const { isLoggedIn, user } = useAuth();
  return (
    <>
      <header>
        <div className="container">
          <div className="logo-brand">
            <NavLink to="/"><img src="/images/home.png" alt="Launch Pad" />Launch Pad</NavLink>
          </div>
          <nav>
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
