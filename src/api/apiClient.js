import axios from 'axios';

// Interceptor to add the Authorization header dynamically
let isRefreshing = false; // Track whether the token is being refreshed
let refreshSubscribers = []; // Queue for requests while the token is refreshing

// Create an Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Ensure this ends with '/'
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to add requests to a queue while the token is being refreshed
const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

// Function to notify all queued requests that the token has been refreshed
const onRefreshed = (newToken) => {
  console.log('Token refreshed, notifying subscribers');
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = []; // Clear the queue after notifying all subscribers
};

// Add access token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access'); // Get the access token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh on 401 or 403 error
apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const {
      config,
      response: { status },
    } = error;
    const originalRequest = config;

    // Check for 401 or 403 status to trigger token refresh
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried

      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = localStorage.getItem('refresh'); // Get the refresh token from localStorage

        try {
          // Call the token refresh endpoint
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}api/token/refresh/`,
            { refresh: refreshToken } // Django SimpleJWT expects `refresh` key
          );

          const newAccessToken = response.data.access; // Adjust based on your API's response format
          localStorage.setItem('access', newAccessToken); // Store the new access token

          // Notify all waiting requests
          onRefreshed(newAccessToken);
          isRefreshing = false;

          // Update the original request with the new token and retry it
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          return Promise.reject(refreshError); // If refresh fails, reject the request
        }
      }

      // Queue requests while the token is being refreshed
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(originalRequest)); // Retry the request after token refresh
        });
      });
    }

    return Promise.reject(error); // For non-401 errors, reject the request
  }
);

export const getToken = async (username, password) => {
  try {
    const response = await apiClient.post('api/token/', {
      username,
      password,
    });
    return response;
  } catch (error) {
    console.error('Login error:', error.message || error);
    throw error;
  }
};
export const createAccount = async ({ username, password, email }) => {
  console.log(username, password, email);
  try {
    const response = await apiClient.post('api/customers/', {
      user: {
        username: username,
        password: password,
      },
      email: email,
    });
    return response;
  } catch (error) {
    console.error('Signup error:', error.message || error);
    throw error;
  }
};

// Fetch all products
export const fetchAllProducts = async () => {
  try {
    const response = await apiClient.get('api/store/products/');

    return response.data; // Return the data if successful
  } catch (error) {
    console.error('Error fetching products:', error);
    return { error: 'Failed to fetch products' }; // Return error message
  }
};

// Fetch customer data
export const fetchCustomerData = async () => {
  try {
    const response = await apiClient.get('api/customers/');

    return response.data; // Return the data if successful
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return { error: 'Failed to fetch customer data' }; // Return error message
  }
};

// Get customer order
export const getCustomerOrders = async () => {
  try {
    const response = await apiClient.get('api/orders/');

    return response.data; // Return the data if successful
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return { error: 'Failed to fetch customer orders' }; // Return error message
  }
};

export const getCustomerOrder = async (orderId) => {
  try {
    const response = await apiClient.get(`api/orders/${orderId}/`);

    return response.data; // Return the data if successful
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return { error: 'Failed to fetch customer orders' }; // Return error message
  }
};

// Create customer order
export const createCustomerOrder = async (token, customerId) => {
  try {
    const response = await apiClient.post(
      'api/orders/',
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

export const addItemToOrder = async (orderId, product_id, quantity) => {
  const url = `${import.meta.env.VITE_API_ORDER}${orderId}/add-item/`; // Adjust the URL as needed
  const token = localStorage.getItem('access');
  console.log(url);

  try {
    const response = await axios.post(
      url,
      {
        order_id: orderId,
        product_id: product_id,
        quantity: quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Set the authorization token in the headers
          'Content-Type': 'application/json', // Set the content type to JSON
        },
      }
    );

    return response.data; // Return the response data
  } catch (error) {
    console.error(
      'Error adding item to order:',
      error.response ? error.response.data : error.message
    );
    throw error; // Rethrow the error for handling in the calling function
  }
};
//Update item of an order, take as param the order_id, the id of the product in the commande and the quantity
export const updateItemOfOrder = async (orderId, id, quantity) => {
  const url = `${import.meta.env.VITE_API_ORDER}${orderId}/item/${id}/`; // Adjust the URL as needed
  const token = localStorage.getItem('access');
  console.log(url);

  try {
    const response = await axios.patch(
      url,
      {
        quantity: quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Set the authorization token in the headers
          'Content-Type': 'application/json', // Set the content type to JSON
        },
      }
    );

    return response.data; // Return the response data
  } catch (error) {
    console.error(
      'Error adding item to order:',
      error.response ? error.response.data : error.message
    );
    throw error; // Rethrow the error for handling in the calling function
  }
};

//Delete item of from order, take as param the order_id, the id of the product in the commande
export const deleteItemfromOrder = async (orderId, id) => {
  const url = `${import.meta.env.VITE_API_ORDER}${orderId}/item/${id}/`; // Adjust the URL as needed
  const token = localStorage.getItem('access');
  console.log(url);

  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Set the authorization token in the headers
        'Content-Type': 'application/json', // Set the content type to JSON
      },
    });

    return response.data; // Return the response data
  } catch (error) {
    console.error(
      'Error deleting item from order:',
      error.response ? error.response.data : error.message
    );
    throw error; // Rethrow the error for handling in the calling function
  }
};

// Get all customers orders pendings
export const getOrdersPendings = async () => {
  const token = localStorage.getItem('access');
  try {
    const response = await axios.get(import.meta.env.VITE_API_ORDERS_PENDINGS, {
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
