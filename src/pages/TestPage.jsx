import { Button, Flex } from '@chakra-ui/react';
import { BaseLayout } from '../components';
import { useState } from 'react';
import { useAuth } from '../hook/AuthContext';
import axios from 'axios';

export const addItemToOrder = async (orderId) => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/${orderId}/items/`; // Adjust the URL as needed
  const token = localStorage.getItem('access');
  console.log(url);
  try {
    const response = await axios.post(
      url,
      {
        order_id: orderId,
        product_id: 'bulcurry',
        quantity: 2,
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

const TestPage = () => {
  const [errorMessage, setErrorMessage] = useState(null); // State for error message
  const { customerOrder } = useAuth();

  console.log(useAuth());
  const handleLogin = async () => {
    try {
      const response = await addItemToOrder(customerOrder);
      // Handle successful login (e.g., redirect to another page)
      console.log(response); // Replace with redirect logic
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <BaseLayout>
        {/* Login form component goes here (replace with your form) */}
        <Flex justifyContent="center" alignItems="center">
          <Button onClick={() => handleLogin('admin', 'admin')} margin="100px">
            test
          </Button>
        </Flex>
        {errorMessage && <p>{errorMessage}</p>}{' '}
        {/* Display error message if present */}
      </BaseLayout>
    </>
  );
};

export default TestPage;
