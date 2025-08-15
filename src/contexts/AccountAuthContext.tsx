import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { secureSetItem, secureGetItem, secureRemoveItem, initializeNewSession, cleanupExpiredData } from '../utils/secureStorage';

interface AccountAuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string, refreshToken?: string) => void;
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
        return secureGetItem('token');
    });

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const storedToken = secureGetItem('token');
        return !!storedToken;
    });

    const login = (newToken: string, refreshToken?: string) => {
        // 새 로그인 시 기존 세션 완전 초기화
        initializeNewSession();
        
        setToken(newToken);
        setIsAuthenticated(true);
        secureSetItem('token', newToken, 1); // 1시간 만료
        
        if (refreshToken) {
            secureSetItem('refreshToken', refreshToken, 1); // 1시간 만료
        }
    };

    const logout = () => {
        setToken(null);
        setIsAuthenticated(false);
        secureRemoveItem('token');
        secureRemoveItem('refreshToken');
    };

    // 앱 시작 시 만료된 데이터 정리
    useEffect(() => {
        cleanupExpiredData();
    }, []);

    // 토큰 만료 체크 (JWT 토큰 자체의 만료시간도 체크)
    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const currentTime = Date.now() / 1000;
                
                if (payload.exp && payload.exp < currentTime) {
                    // JWT 토큰이 만료된 경우
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