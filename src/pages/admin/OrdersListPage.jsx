import { useEffect, useState } from 'react';
import { BaseLayout, OrderLine } from '../../components';
import { getCustomerOrder } from '../../api/apiClient';
import { Box, Flex, Heading } from '@chakra-ui/react';

const OrdersListPage = () => {
  const [pendingOrders, setPendingOrders] = useState([]); // You can initialize it with null or empty values.

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getCustomerOrder();
        console.log(response);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <BaseLayout>
        {pendingOrders.length > 0 ? (
          pendingOrders.map(({ order_id, items }) => (
            <Box>
              <Heading>{order_id}</Heading>
              {items.map((item) => (
                <OrderLine {...item} />
              ))}
            </Box>
          ))
        ) : (
          <div>No orders found</div>
        )}
      </BaseLayout>
    </>
  );
};

export default OrdersListPage;
