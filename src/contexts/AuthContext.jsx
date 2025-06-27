import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../api/insforge';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const result = await auth.verifyToken(token);
          localStorage.setItem('token', result.token);
          const payload = JSON.parse(atob(result.token.split('.')[1]));
          setUser({
            id: payload.user_id,
            email: payload.email,
            name: payload.name,
          });
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const result = await auth.login({ email, password });
    localStorage.setItem('token', result.token);
    const payload = JSON.parse(atob(result.token.split('.')[1]));
    setUser({
      id: payload.user_id,
      email: payload.email,
      name: payload.name,
    });
    return result;
  };

  const signUp = async (name, email, password) => {
    const result = await auth.signUp({ name, email, password });
    localStorage.setItem('token', result.token);
    const payload = JSON.parse(atob(result.token.split('.')[1]));
    setUser({
      id: payload.user_id,
      email: payload.email,
      name: payload.name,
    });
    return result;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};