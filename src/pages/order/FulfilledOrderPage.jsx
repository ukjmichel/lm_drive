import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { BaseLayout } from '../../components';
import { getCustomerOrders, getCustomerOrder } from '../../api/apiClient';
import { useState, useEffect } from 'react';
import OrderModal from './OrderModal';

// Création d'un composant Motion pour Flex
const MotionFlex = motion.create(Flex);

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
            {fulfilledOrders.map((order, index) => (
              <MotionFlex
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
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
              </MotionFlex>
            ))}
          </Box>
        ) : (
          <Text>Aucune commande terminée.</Text>
        )}
      </Box>

      {/* Modal pour les détails de la commande */}
      {selectedOrder && (
        <OrderModal
          isOpen={true}
          onClose={closeOrderDetails}
          order={selectedOrder}
        />
      )}
    </BaseLayout>
  );
};

export default FulfilledOrdersPage;
