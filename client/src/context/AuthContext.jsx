import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/authApi.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      setUser(await authApi.getMe());
    } catch (error) {
      if (error.response?.status !== 401) console.error("Could not load current user", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (credentials) => {
    const nextUser = await authApi.login(credentials);
    setUser(nextUser);
    return nextUser;
  }, []);
  const signup = useCallback(async (details) => {
    const nextUser = await authApi.signup(details);
    setUser(nextUser);
    return nextUser;
  }, []);
  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, refreshUser }),
    [user, loading, login, signup, logout, refreshUser],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
