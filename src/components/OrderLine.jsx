import {
  Box,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

const OrderLine = ({ product_name, quantity }) => {
  return (
    <>
      <Flex alignItems="center" gap={4} margin={4}>
        <Box width={24}>{product_name}</Box>
        <NumberInput defaultValue={quantity} min={0} max={100} width={20}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Box>Prix</Box>
        <Box>10.00</Box>
        <Box>Total</Box>
        <Box>20.00</Box>
      </Flex>
    </>
  );
};
export default OrderLine;
