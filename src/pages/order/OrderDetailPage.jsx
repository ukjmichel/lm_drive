import { Box, Button, Flex, Heading, Text, useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';
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
import OrderModal from './OrderModal';

// Utilisation de motion.create pour définir des composants animés
const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);

const OrderDetailPage = () => {
  const [order, setOrder] = useState({});
  const [otherOrders, setOtherOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { order_id, items = [], total_ttc } = order;
  const navigate = useNavigate();
  const toast = useToast();

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
        <Heading fontSize="xl" p={4}>
          Commandes en cours
        </Heading>
        {otherOrders.length > 0 ? (
          <MotionBox
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {otherOrders
              .filter((order) => order.status === 'ready')
              .map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  onClick={openOrderDetails}
                  isReady={true}
                />
              ))}

            {otherOrders
              .filter((order) => order.status === 'confirmed')
              .map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  onClick={openOrderDetails}
                  isReady={false}
                />
              ))}
          </MotionBox>
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
          items.map((item, index) => (
            <MotionFlex
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <OrderLine
                {...item}
                order_id={order_id}
                onUpdate={fetchOrders}
                onDelete={fetchOrders}
              />
            </MotionFlex>
          ))
        ) : (
          <Box p={4}>Aucun article dans la commande.</Box>
        )}
        <Flex
          w="100%"
          p={4}
          fontSize={18}
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize="lg" fontWeight="bold">
            Montant Total : {total_ttc?.toFixed(2)} Euros
          </Text>
          <Button
            bg="green.400"
            color="white"
            _hover={{ bg: 'green.300' }}
            onClick={handleCheckout}
            isDisabled={total_ttc < 15} // Désactiver le bouton si le montant est 0
          >
            Valider la commande
          </Button>
        </Flex>
      </Box>

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

export default OrderDetailPage;
