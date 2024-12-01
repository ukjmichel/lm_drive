import { Flex, Box, Text } from '@chakra-ui/react';

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

export default OrderCard;
