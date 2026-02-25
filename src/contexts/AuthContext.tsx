import { createContext, useContext, useState, ReactNode } from "react";

type Role = "student" | "therapist" | "admin" | null;

export const API_URL = "http://localhost:3000";

interface AuthContextType {
    isLoggedIn: boolean;
    role: Role;
    login: (role: Role, userData?: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState<Role>(null);
    const [user, setUser] = useState<any>(null);

    const login = (newRole: Role, userData?: any) => {
        setIsLoggedIn(true);
        setRole(newRole);
        if (userData) setUser(userData);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setRole(null);
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
