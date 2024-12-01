import { Flex, Box, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types'; // Import de PropTypes

const OrderCard = ({ order, onClick, isReady }) => {
  return (
    <Flex
      p={4}
      borderWidth={1}
      borderRadius="md"
      justifyContent="space-between"
      alignItems="center"
      cursor="pointer"
      onClick={() => onClick(order.order_id)}
      _hover={{ bg: 'gray.100' }}
      bg={isReady ? 'green.100' : 'white'} // Couleur de fond
      borderColor={isReady ? 'green.400' : 'gray.200'} // Bordure
    >
      <Box>
        <Text fontWeight="bold" textTransform="uppercase">
          Commande : {order.order_id}
        </Text>
        <Text>
          Date : {new Date(order.confirmed_date).toLocaleDateString()}
        </Text>
      </Box>
      <Text>Statut : {isReady ? 'Prête' : 'Confirmée'}</Text>
    </Flex>
  );
};

// Validation des props avec PropTypes
OrderCard.propTypes = {
  order: PropTypes.shape({
    order_id: PropTypes.string.isRequired, // `order_id` est une chaîne obligatoire
    confirmed_date: PropTypes.string.isRequired, // `confirmed_date` est une chaîne obligatoire
  }).isRequired, // L'objet `order` est obligatoire
  onClick: PropTypes.func.isRequired, // `onClick` est une fonction obligatoire
  isReady: PropTypes.bool.isRequired, // `isReady` est un booléen obligatoire
};

export default OrderCard;
