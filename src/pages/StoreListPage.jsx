import { useEffect, useState } from 'react';
import { BaseLayout, ProductAddToCart } from '../components';
import { fetchAllProducts, getCustomerOrders } from '../api/apiClient';
import { Flex, Fade } from '@chakra-ui/react';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../hook/AuthContext';

const StoreListPage = () => {
  const [products, setProducts] = useState([]);
  const [orderId, setOrderId] = useState();
  const { auth } = useAuth();
  const { id } = useParams();
  const location = useLocation();

  const getProduct = async () => {
    try {
      const response = await fetchAllProducts();
      const filteredProductsList = response.filter(
        (product) => product.category.name === id
      );
      setProducts(filteredProductsList);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getOrderId = async () => {
    try {
      const response = await getCustomerOrders();
      const PendingOrder = response.filter(
        (order) => order.status === 'pending'
      );
      setOrderId(PendingOrder[0].order_id);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    getProduct();
  }, [location]);

  useEffect(() => {
    getOrderId();
  }, [location]);

  return (
    <BaseLayout>
      <Flex gap={4} wrap="wrap" minHeight="500px">
        {products.map((product, index) => (
          // Wrap each ProductAddToCart component in a Fade with a staggered delay
          <Fade
            in
            key={product.product_id}
            transition={{ enter: { duration: 0.4, delay: index * 0.1 } }} // Dynamic delay for each product
          >
            <ProductAddToCart orderId={orderId} {...product} auth={auth} />
          </Fade>
        ))}
      </Flex>
    </BaseLayout>
  );
};

export default StoreListPage;
