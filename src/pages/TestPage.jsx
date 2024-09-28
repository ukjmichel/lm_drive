import { Button, Flex } from '@chakra-ui/react';
import { BaseLayout } from '../components';
import { useState } from 'react';
import {
  fetchAllProducts,
  getCustomerOrder,
  createCustomerOrder,
} from '../api/apiClient';

const TestPage = () => {
  const [errorMessage, setErrorMessage, customerId] = useState(null); // State for error message
  const token = localStorage.getItem('access');

  const handleLogin = async () => {
    try {
      const response = await createCustomerOrder(token, customerId);
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
