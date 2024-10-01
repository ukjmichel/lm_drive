// AuthContext.jsx
import axios from 'axios';
import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState();

  const login = async (username, password) => {
    try {
      // Make a POST request to the token URL with username and password
      const response = await axios.post(import.meta.env.VITE_API_TOKEN_URL, {
        username,
        password,
      });

      // Check if the response status is 200 (successful)
      if (response.status === 200) {
        const accessToken = response.data.access;
        const resfreshToken = response.data.refresh;

        // Store the access token in localStorage
        localStorage.setItem('access', accessToken);
        localStorage.setItem('refresh', resfreshToken);
        setAuth(true); // Assuming setAuth is a state setter for authentication status

        // Assuming you are storing the order ID in state
      } else {
        // Handle non-200 status codes by throwing an error
        throw new Error(
          `Login failed: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      // Log the error message
      console.error('Login error:', error.message || error);

      // Handle the error appropriately (e.g., display an error message to the user)
      throw error; // Re-throw the error for higher-level handling if needed
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
    const storedToken = localStorage.getItem('access');
    if (storedToken) {
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
