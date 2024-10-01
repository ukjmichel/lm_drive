import {
  Box,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
} from '@chakra-ui/react';
import { deleteItemfromOrder, updateItemOfOrder } from '../api/apiClient';
import { useState } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';

const OrderLine = ({ product, quantity, id, order_id, onDelete }) => {
  const { product_name, brand, price } = product; // id = position of the item in the order
  const [currentQuantity, setCurrentQuantity] = useState(quantity);

  const handleUpdate = async () => {
    if (currentQuantity !== quantity) {
      try {
        const response = await updateItemOfOrder(order_id, id, currentQuantity);
        console.log('Quantity updated successfully', response);
      } catch (error) {
        console.error('Failed to update quantity', error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteItemfromOrder(order_id, id);
      console.log('Item deleted successfully', response);
      if (onDelete) onDelete(id); // Notify parent component about the deletion
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete item', error);
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
        onChange={(valueString) => setCurrentQuantity(Number(valueString))}
      >
        <NumberInputField onBlur={handleUpdate} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Box>Prix</Box>
      <Box>{price}</Box>
      <Box>Total</Box>
      <Box>{(currentQuantity * price).toFixed(2)}</Box>

      {/* Delete Button */}
      <IconButton
        aria-label="Delete item"
        icon={<DeleteIcon />}
        onClick={handleDelete}
        colorScheme="red"
      />
    </Flex>
  );
};

export default OrderLine;
