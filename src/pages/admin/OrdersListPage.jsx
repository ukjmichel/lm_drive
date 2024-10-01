import { useEffect, useState } from 'react';
import { BaseLayout, OrderLine } from '../../components';
import { getCustomerOrders, getCustomerOrder } from '../../api/apiClient';
import { Text, Box, Flex, Center } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

const OrdersListPage = () => {
  const [pendingOrders, setPendingOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getCustomerOrders();
        if (response) {
          // Use response.status instead of response
          setPendingOrders(
            response.filter(
              (order) =>
                order.status === 'confirmed' || order.status === 'ready'
            )
          );
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <BaseLayout>
        {pendingOrders.length > 0 ? (
          pendingOrders.map(({ order_id,status }) => {
            return (
              <Flex alignItems="center">
                <NavLink to={order_id}>
                  <Text fontSize={24} margin={4}>
                    {order_id.toUpperCase()}
                  </Text>
                </NavLink>
                <Box>
                  <Text>Status</Text>
                  <Text>{status}</Text>
                </Box>
              </Flex>
            );
          })
        ) : (
          <div>No orders found</div>
        )}
      </BaseLayout>
    </>
  );
};

export default OrdersListPage;
