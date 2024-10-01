import { Box, Flex } from '@chakra-ui/react';
import { BaseLayout, OrderLine } from '../components';
import { getCustomerOrders, getCustomerOrder } from '../api/apiClient';
import { useState, useEffect } from 'react';

const OrderDetailPage = () => {
  const [order, setOrder] = useState({}); // You can initialize it with null or empty values.
  const { order_id, items = [], total_amount } = order; // Set items to an empty array by default.

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getCustomerOrders();
        const pendingOrder = response.filter(
          (order) => order.status === 'pending'
        );
        console.log(pendingOrder[0].order_id);
        const pendingOrderDetail = await getCustomerOrder(
          pendingOrder[0].order_id
        );
        console.log(pendingOrderDetail);
        setOrder(pendingOrderDetail);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };
    fetchOrder();
  }, []);

  return (
    <BaseLayout>
      <Flex margin={4} gap={4}>
        <Box>Numéros de commande</Box>
        <Box>{order_id || 'N/A'}</Box>{' '}
        {/* Handle the case where order_id is not yet available */}
      </Flex>
      <Box>
        {/* Check if items exist and map over them */}
        {items.length > 0 ? (
          items.map(
            (item, index) => (
              <OrderLine key={item.id} {...item} order_id={order_id} />
            )

            // Provide a unique key
          )
        ) : (
          <Box>No items in the order.</Box> // Display a message if no items exist
        )}
      </Box>
    </BaseLayout>
  );
};

export default OrderDetailPage;
