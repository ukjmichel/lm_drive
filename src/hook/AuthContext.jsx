// AuthContext.jsx
import axios from 'axios';
import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchCustomerData,
  getCustomerOrder,
  createCustomerOrder,
} from '../api/apiClient';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState();
  const [token, setToken] = useState();
  const [customerId, setCustomerId] = useState();
  const [customerOrder, setCustomerOrder] = useState();

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

        // Store the access token in localStorage
        localStorage.setItem('access', accessToken);
        setToken(accessToken);
        setAuth(true); // Assuming setAuth is a state setter for authentication status

        // Fetch customer data using the access token
        const customerData = await fetchCustomerData(accessToken);
        console.log('Customer Data:', customerData);

        // Check if customerData is valid and not empty
        if (customerData && customerData.length > 0) {
          localStorage.setItem('customerId', customerData[0].customer_id);
          setCustomerId(customerData[0].customer_id); // Set customer ID in state
          console.log(`Customer ID: ${customerData[0].customer_id}`);
        } else {
          throw new Error('Customer data is empty or invalid');
        }

        // Fetch customer order using the access token
        let customerOrderData = await getCustomerOrder(accessToken);
        console.log('Customer Order Data:', customerOrderData);

        // Assuming you are storing the order ID in state
        if (customerOrderData && customerOrderData.length > 0) {
          localStorage.setItem('orderId', customerOrderData[0].order_id);
          setCustomerOrder(customerOrderData[0].order_id);
          console.log(`Order ID: ${customerOrderData[0].order_id}`);
        } else {
          // Create a new customer order if none exists
          const customerId = customerData[0].customer_id; // Make sure customerId is defined
          customerOrderData = await createCustomerOrder(
            accessToken,
            customerId
          );
          localStorage.setItem('orderId', customerOrder.customer_id);
          setCustomerOrder(customerOrderData.order_id);
          console.log(`Created Order ID: ${customerOrderData.order_id}`);
        }
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
      localStorage.removeItem('orderId');
      localStorage.removeItem('customerId');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    const customerIdFromLs = localStorage.getItem('customerId');
    const orderIdFromLs = localStorage.getItem('orderId');
    if (token) {
      setAuth(true);
      setToken(token);
    }
    if (customerIdFromLs) {
      setAuth(customerIdFromLs);
    }
    if (orderIdFromLs) {
      setAuth(orderIdFromLs);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, customerId, customerOrder, token }}
    >
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
