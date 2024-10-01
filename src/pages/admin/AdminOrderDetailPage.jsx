import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { BaseLayout, OrderLine } from '../../components';
import { getCustomerOrders } from '../../api/apiClient';
import { Box, Flex, Heading, Checkbox } from '@chakra-ui/react';

const OrdersListPage = () => {
  const { orderId } = useParams(); // Retrieve order ID from URL
  const [pendingOrders, setPendingOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getCustomerOrders();
        if (response.status === 200) {
          // If orderId is provided, filter for that specific order
          if (orderId) {
            const specificOrder = response.data.find(
              (order) => order.order_id === orderId
            );
            if (specificOrder) {
              setPendingOrders([specificOrder]); // Set specific order if found
            }
          } else {
            // No specific orderId, filter for pending orders
            setPendingOrders(
              response.data.filter((order) => order.status === 'pending')
            );
          }
        }
        console.log(response);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [orderId]); // Add orderId as a dependency

  return (
    <BaseLayout>
      <Flex margin={4} gap={4}>
        <Box>Numéros de commande</Box>
        {/* Ensure orderId is logged for debugging */}
        <Box>{orderId ? orderId.toUpperCase() : 'N/A'}</Box>{' '}
        {/* Convert orderId to uppercase */}
      </Flex>
      {pendingOrders.length > 0 ? (
        pendingOrders.map(({ order_id, items }) => (
          <Box key={order_id}>
            <Heading>{order_id}</Heading>
            {items.map((item) => (
              <Flex key={item.id} align="center">
                <OrderLine {...item} order_id={orderId} />
                <Checkbox ml={4} />
              </Flex>
            ))}
          </Box>
        ))
      ) : (
        <div>No orders found</div>
      )}
    </BaseLayout>
  );
};

export default OrdersListPage;
