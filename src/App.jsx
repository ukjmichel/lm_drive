import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import {
  HomePage,
  OrderDetailPage,
  SignInPage,
  SignUpPage,
  StorePage,
  TestPage,
} from './pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hook/AuthContext';

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <ChakraProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/cart" element={<OrderDetailPage />} />
              <Route path="/test" element={<TestPage />} />
            </Routes>
          </ChakraProvider>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
