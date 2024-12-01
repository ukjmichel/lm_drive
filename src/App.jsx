import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import {
  FulfilledOrdersPage,
  HomePage,
  OrderDetailPage,
  SignInPage,
  SignUpPage,
  StoreListPage,
  StorePage,
} from './pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hook/AuthContext';
import { AdminOrdersListPage, AdminOrderDetailPage } from './pages/admin';
import 'leaflet/dist/leaflet.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CheckoutPage from './pages/CheckoutPage';

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
              <Route path="/historic" element={<FulfilledOrdersPage />} />
              <Route path="/cart" element={<OrderDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/admin/orders" element={<AdminOrdersListPage />} />
              <Route
                path="/admin/orders/:orderId"
                element={<AdminOrderDetailPage />}
              />
              <Route path="/store/:id" element={<StoreListPage />} />
            </Routes>
          </ChakraProvider>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
