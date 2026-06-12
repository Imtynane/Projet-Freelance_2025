import {createContext, useContext, useState, useEffect} from "react";
import {saveAuth,getUser, getToken, logout as logoutService} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const savedToken = getToken();
        if (!savedToken) return;

        const savedUser = getUser();
        setUser(savedUser);
        setToken(savedToken);
    }, []);

    const login = (userData, tokenData) => {
        saveAuth(userData, tokenData);
        setUser(userData);
        setToken(tokenData);
    };

    const logout = () => {
        logoutService();
        setUser(null);
        setToken(null);
    };

    const isAuthenticated = !!token;
    
    
    return (
        <AuthContext.Provider value={{user, token, login, logout, isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);