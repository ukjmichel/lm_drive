import { Button, Flex } from '@chakra-ui/react';
import { BaseLayout } from '../components';
import axios from 'axios';
import { useState } from 'react';

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
      return response; // Optionally return the response for further processing
    } else {
      throw new Error('Login failed: ' + response.statusText); // Handle non-200 status codes
    }
  } catch (error) {
    console.error('Login error:', error);
    // Handle error gracefully, e.g., display an error message to the user
    throw error; // Re-throw the error for further handling if needed
  }
};

const TestPage = () => {
  const [errorMessage, setErrorMessage] = useState(null); // State for error message

  const handleLogin = async (username, password) => {
    try {
      const response = await login(username, password);
      // Handle successful login (e.g., redirect to another page)
      console.log('Login successful:', response); // Replace with redirect logic
    } catch (error) {
      setErrorMessage(error.message || 'Login failed'); // Set error message
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
