import { createContext, useContext, useState } from 'react';
import { adminLogin as apiLogin } from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
    const [email, setEmail] = useState(() => localStorage.getItem('admin_email') || '');

    const login = async (email, password) => {
        const data = await apiLogin(email, password);
        setToken(data.token);
        setEmail(data.email);
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_email', data.email);
        return data;
    };

    const logout = () => {
        setToken(null);
        setEmail('');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_email');
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, email, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
