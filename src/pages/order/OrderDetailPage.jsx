import { Box, Button, Flex, Heading, Text, useToast } from '@chakra-ui/react';
import { BaseLayout } from '../../components';
import {
  getCustomerOrders,
  getCustomerOrder,
  getProductsStocks,
} from '../../api/apiClient';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderLine from './OrderLine';

const OrderDetailPage = () => {
  const [order, setOrder] = useState({});
  const { order_id, items = [], total_amount } = order;
  const navigate = useNavigate();
  const toast = useToast();

  // Fetch order details
  const fetchOrder = async () => {
    try {
      const response = await getCustomerOrders();
      const pendingOrder = response.filter(
        (order) => order.status === 'pending'
      );
      const pendingOrderDetail = await getCustomerOrder(
        pendingOrder[0].order_id
      );
      setOrder(pendingOrderDetail);
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  // Function to check stock levels for each product in the order
  const checkStocks = async (order) => {
    for (let item of order.items) {
      const { product, quantity } = item;
      const stockData = await getProductsStocks({
        store: 'CRE71780',
        product: product.product_id, // assuming product_id is a unique identifier for the product
      });

      // Check if the stock is insufficient
      if (stockData && stockData.quantity_in_stock < quantity) {
        toast({
          title: 'Insufficient Stock',
          description: `Not enough stock for ${product.product_name}. Only ${stockData.quantity_in_stock} items are available.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return false; // Stop the checkout process if any item has insufficient stock
      }
    }
    return true; // All items have sufficient stock
  };

  // Handle the checkout process
  const handleCheckout = async () => {
    const stockCheckPassed = await checkStocks(order);
    if (stockCheckPassed) {
      navigate('/checkout');
    }
  };

  return (
    <BaseLayout>
      <Flex margin={4} gap={4} alignItems={'center'}>
        <Heading fontSize={'xl'}>Numéros de commande: </Heading>
        <Text textTransform="uppercase" fontSize={'xl'}>
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
              onUpdate={fetchOrder} // Pass fetchOrder to refresh on update
              onDelete={fetchOrder} // Pass fetchOrder to refresh on delete
            />
          ))
        ) : (
          <Box>No items in the order.</Box>
        )}
        <Flex
          w={{ base: '100%' }}
          p={4}
          fontSize={18}
          alignItems={'center'}
          justifyContent="space-between"
        >
          <Text fontSize={'lg'} fontWeight="bold">
            Total Amount: {total_amount?.toFixed(2)} Euros
          </Text>
          <Button
            bg={'green.400'}
            color={'white'}
            _hover={{ bg: 'green.300' }}
            onClick={handleCheckout} // Trigger stock check and proceed to checkout
          >
            Valider commande
          </Button>
        </Flex>
      </Box>
    </BaseLayout>
  );
};

export default OrderDetailPage;
