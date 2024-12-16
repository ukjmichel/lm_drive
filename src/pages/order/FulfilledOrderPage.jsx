import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { BaseLayout } from '../../components';
import {
  getCustomerOrders,
  getCustomerOrder,
  downloadFacture,
} from '../../api/apiClient';
import { useState, useEffect } from 'react';
import { DownloadIcon } from '@chakra-ui/icons'; // Icône pour télécharger
import OrderModal from './OrderModal';

// Création d'un composant Motion pour Flex
const MotionFlex = motion.create(Flex);

const FulfilledOrdersPage = () => {
  const [fulfilledOrders, setFulfilledOrders] = useState([]); // Commandes terminées
  const [selectedOrder, setSelectedOrder] = useState(null); // Détails d'une commande
  const [loading, setLoading] = useState(false); // Indicateur de chargement
  const [error, setError] = useState(null); // Gestion des erreurs

  // Récupérer les commandes terminées
  const fetchFulfilledOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCustomerOrders();
      const fulfilled = response.filter(
        (order) => order.status === 'fulfilled'
      );
      setFulfilledOrders(fulfilled);
    } catch (err) {
      console.error('Erreur lors de la récupération des commandes :', err);
      setError('Impossible de récupérer les commandes. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Afficher les détails d'une commande
  const openOrderDetails = async (orderId) => {
    try {
      const orderDetails = await getCustomerOrder(orderId);
      setSelectedOrder(orderDetails);
    } catch (err) {
      console.error(
        'Erreur lors de la récupération des détails de la commande :',
        err
      );
      alert('Impossible de charger les détails de la commande.');
    }
  };

  // Fermer la modale des détails
  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  // Télécharger une facture
  const handleDownload = async (orderId, event) => {
    event.stopPropagation(); // Empêche d'ouvrir la modale
    try {
      await downloadFacture(orderId);
    } catch (err) {
      console.error('Erreur lors du téléchargement de la facture :', err);
      alert('Erreur lors du téléchargement de la facture. Veuillez réessayer.');
    }
  };

  // Charger les commandes terminées au chargement du composant
  useEffect(() => {
    fetchFulfilledOrders();
  }, []);

  // Détecter la taille de l'écran
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return (
    <BaseLayout>
      <Box p={6}>
        <Heading mb={4}>Commandes Terminées</Heading>

        {loading ? (
          <Flex justify="center" align="center" minHeight="100px">
            <Text>Chargement des commandes...</Text>
          </Flex>
        ) : error ? (
          <Text color="red.500">{error}</Text>
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
                _hover={{ bg: 'gray.100' }}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => openOrderDetails(order.order_id)}
              >
                <Box>
                  <Text fontWeight="bold" textTransform="uppercase">
                    Commande : {order.order_id}
                  </Text>
                  <Text>
                    Date : {new Date(order.fulfilled_date).toLocaleDateString()}
                  </Text>
                  <Text>Montant Total : {order.total_ttc} Euros</Text>
                </Box>
                <Box>
                  {/* Bouton ou icône en fonction de la taille de l'écran */}
                  {isSmallScreen ? (
                    <IconButton
                      icon={<DownloadIcon />}
                      aria-label="Télécharger la facture"
                      colorScheme="blue"
                      size="sm"
                      onClick={(event) => handleDownload(order.order_id, event)}
                    />
                  ) : (
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={(event) => handleDownload(order.order_id, event)}
                    >
                      Télécharger la facture
                    </Button>
                  )}
                </Box>
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
