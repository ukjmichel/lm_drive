import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Flex,
  Text,
  Heading,
  Divider,
  Badge,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

const OrderModal = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  // Détermine la couleur et le texte du statut
  const getStatusDetails = (status) => {
    switch (status) {
      case 'ready':
        return { label: 'Prête', colorScheme: 'green' };
      case 'confirmed':
        return { label: 'Confirmée', colorScheme: 'blue' };
      case 'fulfilled':
        return { label: 'Terminé', colorScheme: 'purple' };
      default:
        return { label: 'Inconnu', colorScheme: 'gray' };
    }
  };

  const { label, colorScheme } = getStatusDetails(order.status);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="lg" overflow="hidden" boxShadow="lg">
        <ModalHeader bg="gray.100" py={4}>
          <Heading fontSize="lg" mb={2}>
            Détails de la commande
          </Heading>
          <Text
            fontSize="sm"
            fontWeight="bold"
            textTransform="uppercase"
            color="gray.500"
          >
            Numéro de commande : {order.order_id}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={6}>
          <Box mb={6}>
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Text fontSize="md" fontWeight="bold" color="gray.600">
                Statut :
              </Text>
              <Badge fontSize="md" colorScheme={colorScheme}>
                {label}
              </Badge>
            </Flex>

            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Text fontSize="md" fontWeight="bold" color="gray.600">
                Date :
              </Text>
              <Text fontSize="md">
                {new Date(order.confirmed_date).toLocaleDateString()}
              </Text>
            </Flex>

            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Text fontSize="md" fontWeight="bold" color="gray.600">
                Montant Total :
              </Text>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color="teal.500"
                bg="teal.50"
                px={2}
                py={1}
                borderRadius="md"
              >
                {order.total_amount.toFixed(2)} Euros
              </Text>
            </Flex>
          </Box>

          <Divider mb={6} />

          <Heading size="sm" mb={4}>
            Articles
          </Heading>
          <Box>
            {order.items.map((item) => (
              <Flex
                key={item.id}
                justifyContent="space-between"
                alignItems="center"
                bg="gray.50"
                px={4}
                py={2}
                borderRadius="md"
                mb={2}
              >
                <Text fontSize="md">{item.product.product_name}</Text>
                <Badge fontSize="sm" colorScheme="purple">
                  x{item.quantity}
                </Badge>
              </Flex>
            ))}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

OrderModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  order: PropTypes.shape({
    order_id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    confirmed_date: PropTypes.string.isRequired,
    total_amount: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        product: PropTypes.shape({
          product_name: PropTypes.string.isRequired,
        }).isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
  }),
};

export default OrderModal;
