import { useEffect, useState } from 'react';
import { BaseLayout } from '../../components';
import { Fade, Grid, GridItem, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProductsFilter from '../../components/filters/ProductsFilter';
import ProductAddToCart from './ProductAddToCart';
import { useData } from '../../context/DataContext';

const StoreListPage = () => {
  const { products, pendingOrderId } = useData([]); // Store all products
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products for display
  const [subcategories, setSubcategories] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const { auth } = useAuth();
  const { id } = useParams(); // Category ID from route

  const handleSelectBrand = (value) => {
    setSelectedBrand(value); // Update the selected brand state
  };

  const handleSelectSubcategories = (value) => {
    setSubcategories(value); // Update the subcategories state
  };

  const filterProducts = (allProducts) => {
    // Filter based on category ID, brand, and subcategories
    const filtered = allProducts.filter((product) => {
      const matchesCategory = id ? product.category.name === id : true;
      const matchesBrand = selectedBrand
        ? product.brand === selectedBrand
        : true;
      const matchesSubcategories = subcategories
        ? product.subcategories.some((sub) => sub.name === subcategories)
        : true;

      return matchesCategory && matchesBrand && matchesSubcategories;
    });

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    if (products.length > 0) {
      filterProducts(products); // Reapply filter on changes
    }
  }, [id, selectedBrand, subcategories, products]); // Refilter when filters change

  return (
    <BaseLayout>
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
        {filteredProducts && filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <GridItem
              display={'grid'}
              justifyContent={'center'}
              key={product.product_id}
            >
              <Fade
                in
                transition={{ enter: { duration: 0.4, delay: index * 0.1 } }}
              >
                <ProductAddToCart
                  orderId={pendingOrderId}
                  {...product}
                  auth={auth}
                />
              </Fade>
            </GridItem>
          ))
        ) : (
          <Text>No products available.</Text>
        )}
      </Grid>
    </BaseLayout>
  );
};

export default StoreListPage;
