import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // Store the role

    const login = (userData, userRole) => {
        setUser(userData);
        setRole(userRole);
    };

    const logout = () => {
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
