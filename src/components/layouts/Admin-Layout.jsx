import { NavLink, Outlet } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { MdContactMail, MdCampaign } from "react-icons/md";
import { IoHome } from "react-icons/io5";
import "./Admin-Layout.css";


export const AdminLayout = () => {
    return <>
        <header>
            <div className="container">
                <nav>
                    <ul>
                        <li><NavLink to="/admin/dashboard"><MdCampaign /> Dashboard</NavLink></li>
                        <li><NavLink to="/admin/users"><FaUsers /> users</NavLink></li>
                        <li><NavLink to="/admin/contacts"><MdContactMail /> contacts</NavLink></li>
                        <li><NavLink to="/campaigns"><MdCampaign /> campaigns</NavLink></li>
                        <li><NavLink to="/"><IoHome /> home</NavLink></li>
                    </ul>
                </nav>
            </div>
        </header>
        <Outlet />
    </>
    };
  