import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AuthUser,
  clearAccessToken,
  fetchMe,
  getAccessToken,
  login as apiLogin,
  register as apiRegister,
  setAccessToken,
} from '../lib/auth-api';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    fetchMe(token)
      .then(setUser)
      .catch(() => clearAccessToken())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { access_token, user: authUser } = await apiLogin(email, password);
    setAccessToken(access_token);
    setUser(authUser);
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
  ) => {
    const { access_token, user: authUser } = await apiRegister(
      email,
      password,
      fullName,
    );
    setAccessToken(access_token);
    setUser(authUser);
  };

  const logout = () => {
    clearAccessToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
