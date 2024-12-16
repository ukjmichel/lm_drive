import PropTypes from 'prop-types';
import {
  Box,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { deleteItemfromOrder, updateItemOfOrder } from '../../api/apiClient';
import { useState, useEffect, useRef } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { debounce } from 'lodash';

const OrderLine = ({ product, quantity, id, order_id, onDelete, onUpdate }) => {
  const { product_name, price_ttc } = product;
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const [error, setError] = useState(null);

  // Create a ref to hold the debounced function
  const debouncedUpdateRef = useRef();

  // Create the debounced function only once
  useEffect(() => {
    debouncedUpdateRef.current = debounce(async (newQuantity) => {
      try {
        await updateItemOfOrder(order_id, id, newQuantity);
        onUpdate();
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Failed to update quantity', err);
        setError('Failed to update quantity. Please try again later.');
      }
    }, 300);

    // Cleanup function to cancel the debounce on unmount
    return () => {
      debouncedUpdateRef.current.cancel();
    };
  }, [order_id, id, onUpdate]);

  const handleQuantityChange = (valueString) => {
    const newQuantity = Math.max(1, Math.min(Number(valueString), 100));
    setCurrentQuantity(newQuantity);
    if (newQuantity !== quantity) {
      debouncedUpdateRef.current(newQuantity);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteItemfromOrder(order_id, id);
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Failed to delete item', error);
      setError('Failed to delete item. Please try again later.');
    }
  };

  return (
    <Flex alignItems="center" gap={4} margin={4}>
      <Box width={24}>{product_name}</Box>
      <NumberInput
        value={currentQuantity}
        min={1}
        max={100}
        width={20}
        onChange={handleQuantityChange}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Box w={'150px'}>{`Prix ttc: ${price_ttc} Euros`}</Box>
      <IconButton
        aria-label={`Delete ${product_name}`}
        icon={<DeleteIcon />}
        onClick={handleDelete}
        colorScheme="red"
      />
      {error && (
        <Text color="red.500" ml={4}>
          {error}
        </Text>
      )}
    </Flex>
  );
};

OrderLine.propTypes = {
  product: PropTypes.shape({
    product_name: PropTypes.string.isRequired,
    price_ttc: PropTypes.number.isRequired,
    brand: PropTypes.string,
  }).isRequired,
  quantity: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  order_id: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func.isRequired,
};

export default OrderLine;
