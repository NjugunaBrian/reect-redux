import { useSelector } from "react-redux"
import { selectCurrentToken } from "../features/auth/authSlice"
import { Navigate, Outlet, useLocation } from "react-router-dom";

//protect our routes
const RequireAuth = () => {
    const token = useSelector(selectCurrentToken);
    const location = useLocation();

    return (
       token
       ? <Outlet />
       : <Navigate to="/login" state={{ from: location }} replace />

    )
}
export default RequireAuth