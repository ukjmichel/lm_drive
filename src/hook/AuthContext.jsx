// AuthContext.jsx
import axios from 'axios';
import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
      });

      if (response.status === 200) {
        // Successful login, store token in local storage
        console.log(response);
        localStorage.setItem('access', response.data.access);
        setAuth(true);
      } else {
        throw new Error('Login failed: ' + response.statusText); // Handle non-200 status codes
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle error gracefully, e.g., display an error message to the user
      throw error; // Re-throw the error for further handling if needed
    }
  };

  const logout = async () => {
    try {
      // Logout logic here
      setAuth(null);
      localStorage.removeItem('access');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      setAuth(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
