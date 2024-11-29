import PropTypes from 'prop-types';
import { Flex, Box, Text, Button } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

const AdminOrderItem = ({ order, onOpenModal }) => {
  const { order_id, status } = order;

  return (
    <Flex
      alignItems="center"
      borderBottom="1px solid"
      borderColor="gray.200"
      py={2}
      my={2}
    >
      <Box width="100px" textAlign="Center">
        <NavLink to={order_id}>
          <Text fontSize={24} margin={4}>
            {order_id.toUpperCase()}
          </Text>
        </NavLink>
      </Box>
      <Box width="100px" textAlign="Center">
        <Text>{status}</Text>
      </Box>
      {status === 'ready' && (
        <Box width="200px" textAlign="Center">
          <Button colorScheme="teal" onClick={() => onOpenModal(order)}>
            Set to Fulfilled
          </Button>
        </Box>
      )}
    </Flex>
  );
};

// Define prop types for validation
AdminOrderItem.propTypes = {
  order: PropTypes.shape({
    order_id: PropTypes.string.isRequired, // order_id must be a string and required
    status: PropTypes.oneOf(['confirmed', 'ready', 'fulfilled']).isRequired, // status must be one of these values
  }).isRequired,
  onOpenModal: PropTypes.func.isRequired, // onOpenModal must be a function and required
};

export default AdminOrderItem;
