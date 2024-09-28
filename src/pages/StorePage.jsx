import { useEffect, useState } from 'react';
import { BaseLayout, ProductAddToCart } from '../components';
import { fetchAllProducts } from '../api/apiClient';
import { Flex } from '@chakra-ui/react';


const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const getProduct = async () => {
    try {
      const response = await fetchAllProducts();
      setProducts(response);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <BaseLayout>
        <Flex gap={4}>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductAddToCart key={product.product_id} {...product} />
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
