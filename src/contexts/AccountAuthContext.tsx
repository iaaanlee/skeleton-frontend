import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccountAuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AccountAuthContext = createContext<AccountAuthContextType | undefined>(undefined);

export const useAccountAuth = () => {
    const context = useContext(AccountAuthContext);
    if (context === undefined) {
        throw new Error('useAccountAuth must be used within an AccountAuthProvider');
    }
    return context;
};

interface AccountAuthProviderProps {
    children: ReactNode;
}

export const AccountAuthProvider: React.FC<AccountAuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token');
    });

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const storedToken = localStorage.getItem('token');
        return !!storedToken;
    });

    const login = (newToken: string) => {
        setToken(newToken);
        setIsAuthenticated(true);
        localStorage.setItem('token', newToken);
    };

    const logout = () => {
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    // 토큰 만료 체크
    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const currentTime = Date.now() / 1000;
                
                if (payload.exp && payload.exp < currentTime) {
                    // 토큰이 만료된 경우
                    logout();
                }
            } catch (error) {
                // 토큰이 유효하지 않은 경우
                console.error('Invalid token:', error);
                logout();
            }
        }
    }, [token]);

    const value = {
        isAuthenticated,
        token,
        login,
        logout,
    };

    return (
        <AccountAuthContext.Provider value={value}>
            {children}
        </AccountAuthContext.Provider>
    );
}; 