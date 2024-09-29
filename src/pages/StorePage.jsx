import { useEffect, useState } from 'react';
import { BaseLayout, ProductAddToCart } from '../components';
import { fetchAllProducts, getCustomerOrder } from '../api/apiClient';
import { Flex } from '@chakra-ui/react';

const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [orderId, setOrderId] = useState();

  const getProduct = async () => {
    try {
      const response = await fetchAllProducts();
      setProducts(response);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getOrderId = async () => {
    try {
      const response = await getCustomerOrder();
      setOrderId(response[0].order_id);
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
    <>
      <BaseLayout>
        <Flex gap={4}>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductAddToCart
                key={product.product_id}
                orderId={orderId}
                {...product}
              />
            ))
          ) : (
            <div>Loading...</div>
          )}
        </Flex>
      </BaseLayout>
    </>
  );
};
export default StorePage;
