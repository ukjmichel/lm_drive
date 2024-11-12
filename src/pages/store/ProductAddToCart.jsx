import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  ButtonGroup,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  Box,
  useToast, // Import useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { addItemToOrder } from '../../api/apiClient';
import { useAuth } from '../../hook/AuthContext';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB').format(date);
};

const ProductAddToCart = ({
  product_id,
  product_name,
  brand,
  price,
  orderId,
  image,
  stock_summary = {},
}) => {
  const [quantity, setQuantity] = useState(1);
  const [quantityInStock, setQuantityInStock] = useState(0);
  const [expirationDate, setExpirationDate] = useState(null);
  const toast = useToast(); // Initialize toast
  const navigate = useNavigate();
  const priceValue = parseFloat(price);
  const formattedPrice = !isNaN(priceValue) ? priceValue.toFixed(2) : '0.00';
  const { auth } = useAuth();

  useEffect(() => {
    if (auth && stock_summary && stock_summary.stock_details) {
      const stock = stock_summary.stock_details['LAO MARKET CRECHE'];
      if (stock) {
        setQuantityInStock(stock.quantity_in_stock);
        setExpirationDate(stock.expiration_date);
      } else {
        setQuantityInStock(0);
        setExpirationDate(null);
      }
    }
  }, [auth, stock_summary]);

  const handleAddToCart = async () => {
    if (auth) {
      try {
        await addItemToOrder(orderId, product_id, quantity);
        setQuantity(1);

        // Show toast notification
        toast({
          title: 'Product added to cart',
          description: `${product_name} has been added to your cart.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);

        // Show error toast
        toast({
          title: 'Failed to add product',
          description: 'There was an issue adding the product to your cart.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      navigate('/signin');
    }
  };

  return (
    <Card maxW="sm">
      <CardBody>
        {image && <Image src={image} alt={product_name} borderRadius="lg" />}
        <Stack mt="6" spacing="3">
          <Heading size="md">{product_name}</Heading>
          <Text>{brand}</Text>
          <HStack spacing="6" w="100%">
            {auth && (
              <>
                <Box flex="1">
                  <Text>{`DLC: ${
                    expirationDate ? formatDate(expirationDate) : 'N/A'
                  }`}</Text>
                </Box>
                <Box flex="1">
                  <Text>{`Stock: ${quantityInStock}`}</Text>
                </Box>
              </>
            )}
          </HStack>

          <Text color="blue.600" fontSize="2xl">
            {auth ? `${formattedPrice} euros` : ''}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button variant="solid" colorScheme="blue" onClick={handleAddToCart}>
            Ajouter
          </Button>
          <NumberInput
            value={quantity}
            min={1}
            max={20}
            onChange={(valueString) => setQuantity(parseInt(valueString, 10))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

// Prop validation
ProductAddToCart.propTypes = {
  product_id: PropTypes.string.isRequired,
  product_name: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  orderId: PropTypes.string,
  image: PropTypes.string,
  stock_summary: PropTypes.shape({
    stock_details: PropTypes.objectOf(
      PropTypes.shape({
        quantity_in_stock: PropTypes.number,
        expiration_date: PropTypes.string,
      })
    ),
  }),
};

export default ProductAddToCart;
