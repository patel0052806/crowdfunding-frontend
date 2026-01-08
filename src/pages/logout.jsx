import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";
import { toast } from "react-toastify";

export const Logout = () => {
    const { LogoutUser } = useAuth();
    const navigate = useNavigate();
    const toastShownRef = useRef(false);

    useEffect(() => {
        if (!toastShownRef.current) {
            LogoutUser();
            toast.success("logout successful");
            navigate("/login");
            toastShownRef.current = true;
        }
    }, [LogoutUser, navigate]);

    return null;
};