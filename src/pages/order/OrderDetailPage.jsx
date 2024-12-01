import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { BaseLayout } from '../../components';
import {
  getCustomerOrders,
  getCustomerOrder,
  getProductsStocks,
  fetchCustomerData,
  createCustomerOrder,
} from '../../api/apiClient';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderLine from './OrderLine';
import OrderCard from './OrderCard';

const OrderDetailPage = () => {
  const [order, setOrder] = useState({});
  const [otherOrders, setOtherOrders] = useState([]); // Stocker les commandes confirmées et prêtes
  const [selectedOrder, setSelectedOrder] = useState(null); // Pour afficher les détails dans une modal
  const { order_id, items = [], total_amount, confirmed_date } = order; // Ajout de confirmed_date
  const navigate = useNavigate();
  const toast = useToast();

  // Récupérer les commandes et détails
  const fetchOrders = async () => {
    try {
      const response = await getCustomerOrders();
      const pendingOrder = response.find((order) => order.status === 'pending');
      const confirmedAndReadyOrders = response.filter(
        (order) => order.status === 'confirmed' || order.status === 'ready'
      );

      setOtherOrders(confirmedAndReadyOrders);

      if (!pendingOrder) {
        const customerData = await fetchCustomerData();
        const customerId = customerData[0].customer_id;
        await createCustomerOrder({
          customerId: customerId,
          storeId: 'CRE71780',
        });
      }

      const updatedResponse = await getCustomerOrders();
      const newPendingOrder = updatedResponse.find(
        (order) => order.status === 'pending'
      );

      if (newPendingOrder) {
        const pendingOrderDetail = await getCustomerOrder(
          newPendingOrder.order_id
        );
        setOrder(pendingOrderDetail);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fonction pour afficher les détails dans une modal
  const openOrderDetails = async (orderId) => {
    try {
      const orderDetails = await getCustomerOrder(orderId);
      setSelectedOrder(orderDetails);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des détails de la commande:',
        error
      );
    }
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  // Gestion de la validation de la commande
  const handleCheckout = async () => {
    const stockCheckPassed = await checkStocks(order);
    if (stockCheckPassed) {
      navigate('/checkout');
    }
  };

  const checkStocks = async (order) => {
    for (let item of order.items) {
      const { product, quantity } = item;
      try {
        const stockData = await getProductsStocks({
          store: 'CRE71780',
          product: product.product_id,
        });

        if (!stockData || stockData.quantity_in_stock < quantity) {
          toast({
            title: 'Stock insuffisant',
            description: `Pas assez de stock pour ${
              product.product_name
            }. Il reste seulement ${
              stockData.quantity_in_stock || 0
            } articles disponibles.`,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return false;
        }
      } catch (error) {
        console.error(
          `Échec de la vérification du stock pour ${product.product_name}`,
          error
        );
        toast({
          title: 'Erreur de vérification du stock',
          description: `Impossible de vérifier le stock pour ${product.product_name}. Veuillez réessayer.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
    }

    return true;
  };

  return (
    <BaseLayout>
      <Box marginBottom={6}>
        <Heading fontSize="xl">Commandes en cours</Heading>
        {otherOrders.length > 0 ? (
          <>
            {/* Afficher les commandes prêtes */}
            {otherOrders
              .filter((order) => order.status === 'ready')
              .map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  onClick={openOrderDetails}
                  isReady={true} // Commande prête
                />
              ))}

            {/* Afficher les commandes confirmées */}
            {otherOrders
              .filter((order) => order.status === 'confirmed')
              .map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  onClick={openOrderDetails}
                  isReady={false} // Commande confirmée
                />
              ))}
          </>
        ) : (
          <Text>Aucune commande confirmée ou prête.</Text>
        )}
      </Box>

      <Flex margin={4} gap={4} alignItems="center">
        <Heading fontSize="xl">Numéro de commande : </Heading>
        <Text textTransform="uppercase" fontSize="xl">
          {order_id || 'N/A'}
        </Text>
      </Flex>
      <Box>
        {items.length > 0 ? (
          items.map((item) => (
            <OrderLine
              key={item.id}
              {...item}
              order_id={order_id}
              onUpdate={fetchOrders}
              onDelete={fetchOrders}
            />
          ))
        ) : (
          <Box>Aucun article dans la commande.</Box>
        )}
        <Flex
          w="100%"
          p={4}
          fontSize={18}
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize="lg" fontWeight="bold">
            Montant Total : {total_amount?.toFixed(2)} Euros
          </Text>
          <Button
            bg="green.400"
            color="white"
            _hover={{ bg: 'green.300' }}
            onClick={handleCheckout}
          >
            Valider la commande
          </Button>
        </Flex>
      </Box>

      {/* Modal pour les détails de commande */}
      {selectedOrder && (
        <Modal isOpen={true} onClose={closeOrderDetails}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Détails de la commande</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text textTransform="uppercase">
                Commande : {selectedOrder.order_id}
              </Text>
              <Text>
                Statut :{' '}
                {selectedOrder.status === 'confirmed' ? 'Confirmée' : 'Prête'}
              </Text>
              <Text>
                Date :{' '}
                {new Date(selectedOrder.confirmed_date).toLocaleDateString()}
              </Text>
              <Text>Montant Total : {selectedOrder.total_amount} Euros</Text>
              <Box>
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

export default OrderDetailPage;
