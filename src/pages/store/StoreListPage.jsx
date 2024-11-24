import { useEffect, useState } from 'react';
import { BaseLayout } from '../../components';
import {
  createCustomerOrder,
  fetchCustomerData,
  getCustomerOrders,
  getFilteredProducts,
} from '../../api/apiClient';
import { Fade, Grid, GridItem, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hook/AuthContext';
import ProductsFilter from '../../components/filters/ProductsFilter';
import ProductAddToCart from './ProductAddToCart';

const StoreListPage = () => {
  const [products, setProducts] = useState([]);
  const [orderId, setOrderId] = useState();
  const [subcategories, setSubcategories] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const { auth } = useAuth();
  const { id } = useParams();

  const handleSelectBrand = (value) => {
    setSelectedBrand(value); // Update the selected brand state
  };

  const handleSelectSubcategories = (value) => {
    setSubcategories(value); // Update the selected brand state
  };

  const getProduct = async () => {
    try {
      const response = await getFilteredProducts({
        categorie: id,
        subcategories: subcategories,
        brand: selectedBrand,
      });
      setProducts(response);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getOrderId = async () => {
    try {
      let response = await getCustomerOrders();
      let pendingOrder = response.filter((order) => order.status === 'pending');
      if (pendingOrder.length === 0) {
        const customerData = await fetchCustomerData();
        const customerId = customerData[0].customer_id;
        pendingOrder = await createCustomerOrder({
          customerId: customerId,
          storeId: 'CRE71780',
        });
        response = await getCustomerOrders();
        pendingOrder = response.filter((order) => order.status === 'pending');
      }

      setOrderId(pendingOrder[0].order_id);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    getProduct();
  }, [selectedBrand, subcategories]); // Add selectedBrand and subcategories as dependencies

  useEffect(() => {
    getOrderId();
  }, []);

  return (
    <BaseLayout>
      {/* Pass the handleOnSelectBrand function as a prop to ProductsFilter */}
      <ProductsFilter
        handleSelectBrand={handleSelectBrand}
        handleSelectSubcategories={handleSelectSubcategories}
      />
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
        {products && products.length > 0 ? (
          products.map((product, index) => (
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
          ))
        ) : (
          <Text>No products available.</Text> // Display a message or handle the empty state
        )}
      </Grid>
    </BaseLayout>
  );
};

export default StoreListPage;
