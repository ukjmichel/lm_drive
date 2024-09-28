import axios from 'axios';

// Fetch all products
export const fetchAllProducts = async () => {
  const token = localStorage.getItem('access');

  try {
    const response = await axios.get(import.meta.env.VITE_API_GET_PRODUCTS, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Return the data if successful
  } catch (error) {
    console.error('Error fetching products:', error);
    return { error: 'Failed to fetch products' }; // Return error message
  }
};

// Fetch customer data
export const fetchCustomerData = async (token) => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_GET_USER, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Return the data if successful
  } catch (error) {
    console.error('Error fetching user information:', error);
    return { error: 'Failed to fetch user information' }; // Return error message
  }
};

// Get customer order
export const getCustomerOrder = async (token) => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_ORDER, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Return the data if successful
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return { error: 'Failed to fetch user orders' }; // Return error message
  }
};

// Create customer order
export const createCustomerOrder = async (token, customerId) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_ORDER, // Your API endpoint
      {
        customer_id: customerId, // The customer ID
        items: [], // Empty items array for an empty order
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      }
    );

    console.log('Order created successfully:');
    return response.data; // Return the created order data
  } catch (error) {
    if (error.response) {
      console.error('Error creating order:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return { error: 'Failed to create order' }; // Return error message
  }
};
