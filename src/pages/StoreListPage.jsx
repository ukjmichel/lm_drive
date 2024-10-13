import { useEffect, useState } from 'react';
import { BaseLayout, ProductAddToCart } from '../components';
import {
  createCustomerOrder,
  fetchAllProducts,
  getCustomerOrders,
} from '../api/apiClient';
import { Flex, Fade, Grid, GridItem } from '@chakra-ui/react';
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
      let pendingOrder = response.filter((order) => order.status === 'pending');
      if (pendingOrder.length === 0) {
        pendingOrder = await createCustomerOrder();
      }
      setOrderId(pendingOrder[0].order_id);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    getOrderId();
  }, []);

  return (
    <BaseLayout>
      <Grid
        gap={4}
        wrap="wrap"
        minHeight="500px"
        templateColumns={{
          base: '1fr',
          md: '1fr 1fr',
          lg: '1fr 1fr 1fr',
          xl: '1fr 1fr 1fr 1fr',
        }}
      >
        {products.map((product, index) => (
          // Wrap each ProductAddToCart component in a Fade with a staggered delay
          <GridItem
            display={'grid'}
            justifyContent={'center'}
            key={product.product_id}
          >
            <Fade
              in
              transition={{ enter: { duration: 0.4, delay: index * 0.1 } }} // Dynamic delay for each product
            >
              <ProductAddToCart orderId={orderId} {...product} auth={auth} />
            </Fade>
          </GridItem>
        ))}
      </Grid>
    </BaseLayout>
  );
};

export default StoreListPage;
