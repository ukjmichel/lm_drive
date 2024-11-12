import axios from 'axios';
import PropTypes from 'prop-types'; // Import PropTypes
import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import { getToken } from '../api/apiClient';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = async (username, password) => {
    try {
      const response = await getToken(username, password);
      console.log(response);

      if (response.status === 200) {
        const accessToken = response.data.access;
        const refreshToken = response.data.refresh;

        localStorage.setItem('access', accessToken);
        localStorage.setItem('refresh', refreshToken);
        setAuth(true);

        const decodedToken = jwtDecode(accessToken);

        if (decodedToken.is_admin) {
          setIsAdmin(true);
        }
      } else {
        throw new Error(
          `Login failed: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error('Login error:', error.message || error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuth(false);
      setIsAdmin(false);
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // const decodeToken = (token) => {
  //   try {
  //     return jwtDecode(token);
  //   } catch (error) {
  //     console.error('Invalid token:', error);
  //     return null;
  //   }
  // };

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await axios.post(import.meta.env.VITE_API_REFRESH_URL, {
        refresh: refreshToken,
      });

      if (response.status === 200) {
        const newAccessToken = response.data.access;
        localStorage.setItem('access', newAccessToken); // Save the new access token
        return newAccessToken;
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
    }
    return null;
  };

  useEffect(() => {
    const checkToken = async () => {
      const storedAccessToken = localStorage.getItem('access');
      const storedRefreshToken = localStorage.getItem('refresh');

      if (storedAccessToken) {
        try {
          const decodedToken = jwtDecode(storedAccessToken);

          const currentTime = Date.now() / 1000;
          if (decodedToken.exp > currentTime) {
            setAuth(true);
            setIsAdmin(decodedToken.is_admin || false);
          } else if (storedRefreshToken) {
            const newAccessToken = await refreshAccessToken(storedRefreshToken);
            if (newAccessToken) {
              const decodedNewToken = jwtDecode(newAccessToken);

              setAuth(true);
              setIsAdmin(decodedNewToken.is_admin || false);
            } else {
              setAuth(false);
            }
          } else {
            setAuth(false);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          setAuth(false);
        }
      } else {
        setAuth(false);
      }
    };

    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Add PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
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
