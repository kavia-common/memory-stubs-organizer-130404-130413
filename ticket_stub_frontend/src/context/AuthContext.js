import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('auth_user', null);

  // PUBLIC_INTERFACE
  const login = (email) => {
    /**
     * Mock login. In production integrate with real auth API.
     */
    const u = { email, name: email?.split('@')[0] || 'User' };
    setUser(u);
    window.location.hash = '#/grid';
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    /** Clears session and navigates to login. */
    setUser(null);
    window.location.hash = '#/login';
  };

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Returns { user, login, logout } */
  return useContext(AuthCtx);
}
