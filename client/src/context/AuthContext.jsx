import { createContext, useContext, useState } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  const saveUser = (data) => {
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    saveUser(res.data);
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    saveUser(res.data);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
