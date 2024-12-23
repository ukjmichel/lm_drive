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
  UserProfilPage,
  CheckoutPage,
} from './pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminOrdersListPage, AdminOrderDetailPage } from './pages/admin';
import 'leaflet/dist/leaflet.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <>
      <AuthProvider>
        <DataProvider>
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
                <Route path="/profil" element={<UserProfilPage />} />
              </Routes>
            </ChakraProvider>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </>
  );
}

export default App;
