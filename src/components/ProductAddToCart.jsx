import React, { useState } from 'react';
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
import addItemToOrder from '../api/apiClient';

const ProductAddToCart = ({
  product_id,
  product_name,
  brand,
  price,
  orderId,
}) => {
  const [quantity, setQuantity] = useState(1);
  const priceValue = parseFloat(price); // Convert to float
  const formattedPrice = !isNaN(priceValue) ? priceValue.toFixed(2) : '0.00'; // Format price

  const handleAddToCart = async () => {
    try {
      const response = await addItemToOrder(orderId, product_id, quantity);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card maxW="sm">
      <CardBody>
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt={product_name}
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{product_name}</Heading>
          <Text>{brand}</Text>
          <Text color="blue.600" fontSize="2xl">
            ${formattedPrice}
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
