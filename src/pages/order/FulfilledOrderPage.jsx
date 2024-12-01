import {
  Box,
  Flex,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { BaseLayout } from '../../components';
import { getCustomerOrders, getCustomerOrder } from '../../api/apiClient';
import { useState, useEffect } from 'react';

const FulfilledOrdersPage = () => {
  const [fulfilledOrders, setFulfilledOrders] = useState([]); // Stocker uniquement les commandes terminées
  const [selectedOrder, setSelectedOrder] = useState(null); // Pour afficher les détails dans une modal
  const [loading, setLoading] = useState(false); // Indicateur de chargement

  // Récupérer les commandes terminées
  const fetchFulfilledOrders = async () => {
    setLoading(true);
    try {
      const response = await getCustomerOrders();
      const fulfilledOrders = response.filter(
        (order) => order.status === 'fulfilled'
      );
      setFulfilledOrders(fulfilledOrders);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes :', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour afficher les détails d'une commande dans une modal
  const openOrderDetails = async (orderId) => {
    try {
      const orderDetails = await getCustomerOrder(orderId);
      setSelectedOrder(orderDetails);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des détails de la commande :',
        error
      );
    }
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  useEffect(() => {
    fetchFulfilledOrders();
  }, []);

  return (
    <BaseLayout>
      <Box p={6}>
        <Heading mb={4}>Commandes Terminées</Heading>
        {loading ? (
          <Text>Chargement des commandes...</Text>
        ) : fulfilledOrders.length > 0 ? (
          <Box>
            {fulfilledOrders.map((order) => (
              <Flex
                key={order.order_id}
                p={4}
                mb={2}
                borderWidth={1}
                borderRadius="md"
                justifyContent="space-between"
                alignItems="center"
                cursor="pointer"
                _hover={{ bg: 'gray.100' }}
                onClick={() => openOrderDetails(order.order_id)}
              >
                <Box>
                  <Text fontWeight="bold" textTransform="uppercase">
                    Commande : {order.order_id}
                  </Text>
                  <Text>
                    Date : {new Date(order.fulfilled_date).toLocaleDateString()}
                  </Text>
                </Box>
                <Text>Montant Total : {order.total_amount} Euros</Text>
              </Flex>
            ))}
          </Box>
        ) : (
          <Text>Aucune commande terminée.</Text>
        )}
      </Box>

      {/* Modal pour les détails de la commande */}
      {selectedOrder && (
        <Modal isOpen={true} onClose={closeOrderDetails}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Détails de la commande</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontWeight="bold" textTransform="uppercase">
                Commande : {selectedOrder.order_id}
              </Text>
              <Text>
                Date de Validation :{' '}
                {new Date(selectedOrder.fulfilled_date).toLocaleDateString()}
              </Text>
              <Text>Montant Total : {selectedOrder.total_amount} Euros</Text>
              <Box mt={4}>
                <Heading size="sm" mb={2}>
                  Articles
                </Heading>
                {selectedOrder.items.map((item) => (
                  <Text key={item.id}>
                    {item.product.product_name} - Quantité : {item.quantity}
                  </Text>
                ))}
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </BaseLayout>
  );
};

export default FulfilledOrdersPage;
