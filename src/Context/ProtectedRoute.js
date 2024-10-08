import { useContext,  } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Import AuthContext

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, role } = useContext(AuthContext);

    // First check from context, then fallback to localStorage if needed
    const storedRole = localStorage.getItem('role'); 

    const isAuthorized = () => {
        // Check if there's a user in context or localStorage and the role is allowed
        if (user && allowedRoles.includes(role)) {
            return true;
        } else if (storedRole && allowedRoles.includes(storedRole)) {
            return true;
        }
        return false;
    };

    // If the role is employee and they try to access admin pages, redirect to login
    if (storedRole === 'employee' && !allowedRoles.includes('employee')) {
        return <Navigate to="/" replace />;  // Redirect employee if trying to access admin pages
    }

    // If the user is not authenticated or their role is not allowed, redirect to login
    if (!isAuthorized()) {
        return <Navigate to="/" replace />; // Redirect to login if unauthorized
    }

    // Render children if the user is authenticated and their role is allowed
    return children;
};

export default ProtectedRoute;
