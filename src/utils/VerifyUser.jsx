import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const VerifyUser = () => {
    const { authUser } = useAuth();

    // agar authUser hai → Outlet render karo (child routes)
    // warna login page pe redirect karo
    return authUser ? <Outlet /> : <Navigate to="/login" />;
}

export default VerifyUser;
