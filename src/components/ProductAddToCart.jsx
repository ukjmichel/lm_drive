import React, { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { addItemToOrder } from '../api/apiClient';
import { useAuth } from '../hook/AuthContext';

const ProductAddToCart = ({
  product_id,
  product_name,
  brand,
  price,
  orderId,
  image,
}) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const priceValue = parseFloat(price); // Convert to float
  const formattedPrice = !isNaN(priceValue) ? priceValue.toFixed(2) : '0.00'; // Format price
  const { auth } = useAuth();

  const handleAddToCart = async () => {
    if (auth) {
      try {
        const response = await addItemToOrder(orderId, product_id, quantity);
        setQuantity(1);
      } catch (error) {
        console.error(error);
      }
    } else {
      navigate('/signin');
    }
  };

  return (
    <Card maxW="sm">
      <CardBody>
        <Image src={image} alt={product_name} borderRadius="lg" />
        <Stack mt="6" spacing="3">
          <Heading size="md">{product_name}</Heading>
          <Text>{brand}</Text>
          <Text color="blue.600" fontSize="2xl">
            {auth ? formattedPrice : ''}
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

export default ProductAddToCart;
