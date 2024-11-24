import axios from 'axios';

// Interceptor to add the Authorization header dynamically
let isRefreshing = false; // Track whether the token is being refreshed
let refreshSubscribers = []; // Queue for requests while the token is refreshing

// Create an Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Ensure this ends with '/'
  timeout: 10000,
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
  //console.log('Token refreshed, notifying subscribers');
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
export const createCustomerOrder = async ({ customerId, storeId }) => {
  const token = localStorage.getItem('access');
  console.log(customerId, storeId);
  try {
    const response = await apiClient.post(
      'api/orders/',
      {
        customer_id: customerId, // The customer ID
        store_id: storeId,
        items: [], // Empty items array for an empty order
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      }
    );

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

export const processPayment = async (paymentData) => {
  console.log(paymentData);
  try {
    // Log the payment data being sent for debugging purposes
    //console.log('Sending payment data:', paymentData);

    // Make the API request to process the payment
    const response = await apiClient.post(
      `api/payments/create-payment-intent/${paymentData.order_id}/`, // Adjusted endpoint to include order_id
      paymentData
    );

    // Log the response data for debugging purposes
    //console.log('Payment response:', response);

    // Ensure the response status is 200 OK and the client_secret is available
    if (response?.status === 200 && response.data?.client_secret) {
      const { client_secret, requires_action } = response.data;

      // If 3D Secure authentication is required, return client_secret for further steps
      if (requires_action) {
        return {
          requiresAction: true,
          clientSecret: client_secret, // Return client_secret for further steps
        };
      } else {
        // No further authentication needed (non-3D Secure card), confirm payment
        return {
          requiresAction: false,
          clientSecret: client_secret, // You still need client_secret for confirmation
        };
      }
    } else {
      // If no client_secret is provided or response status is not 200, throw an error
      throw new Error(
        'Payment processing failed. No client_secret provided or invalid response.'
      );
    }
  } catch (error) {
    console.error('Payment processing error:', error);

    let errorMessage;

    // Handle errors from the response if available
    if (error.response) {
      // If the server responded with an error (e.g., 400, 500)
      console.error('Server error details:', error.response.data);
      errorMessage =
        error.response.data?.error ||
        'Payment processing failed. Please try again.';
    } else if (error.request) {
      // If no response was received from the server (e.g., network issue)
      console.error('Network error, no response:', error.request);
      errorMessage =
        'No response received from the server. Please check your network connection and try again.';
    } else {
      // If the error occurred during the setup or in another part of the request
      errorMessage =
        error.message || 'Payment processing failed. Please try again.';
    }

    // Log the error message and throw it
    console.error('Error message:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const getSubcategories = async () => {
  try {
    const response = await apiClient.get('api/store/subcategories/');
    return response.data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return { error: 'Failed to fetch subcategories' }; // Return error message
  }
};

export const getBrands = async () => {
  try {
    const response = await apiClient.get('api/store/brands/');
    return response.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return { error: 'Failed to fetch brands' }; // Return error message
  }
};

export const getFilteredProducts = async ({
  categorie = '',
  subcategories = '',
  brand = '',
}) => {
  const url = `api/store/products/?category=${categorie}${
    subcategories ? `&subcategories=${subcategories}` : ''
  }${brand ? `&brand=${brand}` : ''}`;
  try {
    const response = await apiClient.get(url);

    return response.data; // Return the data if successful
  } catch (error) {
    console.error('Error fetching products:', error);
    return { error: 'Failed to fetch products' }; // Return error message
  }
};

export const getProductsStocks = async ({ store = '', product = '' }) => {
  const url = `api/store/${store}/stocks/${product}/ `;
  console.log(url);
  try {
    const response = await apiClient.get(url);

    return response.data; // Return the data if successful
  } catch (error) {
    console.error('Error fetching products:', error);
    return { error: 'Failed to fetch products' }; // Return error message
  }
};

// Function to update the payment status
export const updatePaymentStatus = async (orderId, status) => {
  const token = localStorage.getItem('access');

  if (!token) {
    console.error('No token found in localStorage');
    alert('You must be logged in to update payment status');
    return;
  }

  try {
    const response = await apiClient.post(
      'api/payments/update-payment-status/', // Your API endpoint
      {
        order_id: orderId, // Order ID to update the payment status for
        status: status, // New status ('succeeded' or 'failed')
        store_id: 'CRE71780',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Set the authorization token in the headers
          'Content-Type': 'application/json', // Ensure you're sending JSON
        },
      }
    );

    // Handle the response from the backend
    //console.log('Payment status updated:', response.data.message);
    // You can also return the response if needed
    return response.data; // Optional: return response data if you want to handle it elsewhere
  } catch (error) {
    // Handle any errors
    if (error.response) {
      console.error(
        'Error updating payment status:',
        error.response.data?.error || error.message
      );
      alert(
        `Failed to update payment status: ${
          error.response.data?.error || error.message
        }`
      );
    } else {
      console.error('Error updating payment status:', error.message);
      alert(`Failed to update payment status: ${error.message}`);
    }
  }
};
