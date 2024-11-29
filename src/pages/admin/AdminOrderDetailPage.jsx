import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BaseLayout } from '../../components';
import { getCustomerOrder, updateOrderStatus } from '../../api/apiClient';
import { Box, Flex, Checkbox, Text, Spinner, useToast } from '@chakra-ui/react';

const OrdersListPage = () => {
  const { orderId } = useParams(); // Retrieve order ID from URL
  const navigate = useNavigate(); // Initialize useNavigate
  const [order, setOrder] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const [loading, setLoading] = useState(false); // For API call status
  const [error, setError] = useState(null); // For error handling
  const toast = useToast(); // Chakra UI Toast for notifications

  // Fetch order details on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getCustomerOrder(orderId);

        // Initialize item checkboxes based on order status
        const allItemsChecked = response.status === 'ready';
        setOrder(response);
        setCheckedItems(
          new Array(response.items.length).fill(allItemsChecked) // All true if "ready", otherwise all false
        );
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [orderId]);

  // Derived state: whether all item checkboxes are checked
  const allChecked = checkedItems.every(Boolean);

  // Function to handle individual checkbox changes
  const handleCheckboxChange = useCallback((index) => {
    setCheckedItems((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  }, []);

  // Function to handle final checkbox change
  const handleFinalCheckboxChange = useCallback(async () => {
    if (!order) return;

    const newStatus = order.status === 'ready' ? 'confirmed' : 'ready';

    try {
      setLoading(true);
      setError(null);

      const response = await updateOrderStatus(orderId, newStatus);

      // Update order status locally
      setOrder((prev) => ({ ...prev, status: response.status }));

      // Show success toast notification
      toast({
        title: `Order status updated to ${response.status}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Navigate to /admin/orders/ after 1-second timeout if the status is set to "ready"
      if (response.status === 'ready') {
        setTimeout(() => {
          navigate('/admin/orders/');
        }, 1000); // 1-second delay
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status.');
    } finally {
      setLoading(false);
    }
  }, [order, orderId, toast, navigate]);

  if (loading && !order) {
    return (
      <BaseLayout>
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Spinner size="xl" />
        </Flex>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Flex margin={4} gap={4}>
        <Box>Order Number</Box>
        <Box>{orderId ? orderId.toUpperCase() : 'N/A'}</Box>
      </Flex>

      {error && (
        <Text color="red" margin={4}>
          {error}
        </Text>
      )}

      {order?.items.map(({ id, product, quantity }, index) => (
        <Flex
          key={id}
          gap={4}
          margin={4}
          borderBottom="1px solid"
          borderColor="gray.200"
          py={2}
        >
          <Flex width="350px">
            <Box width="100px">{product.product_name}</Box>
            <Box width="100px">{product.brand}</Box>
            <Box width="40px">{quantity}</Box>
            <Box width="100px">{product.price}</Box>
          </Flex>
          <Checkbox
            isChecked={checkedItems[index]}
            isDisabled={order?.status === 'ready'} // Disable when the final checkbox is checked
            onChange={() => handleCheckboxChange(index)}
          />
        </Flex>
      ))}

      <Flex margin={4} gap={4}>
        <Flex width="350px">
          <Box>
            <Text>Order Ready</Text>
          </Box>
        </Flex>
        <Checkbox
          isChecked={order?.status === 'ready'}
          isDisabled={!allChecked || loading} // Enable only when all other checkboxes are checked
          onChange={handleFinalCheckboxChange} // Call API when the checkbox state changes
        />
      </Flex>
    </BaseLayout>
  );
};

export default OrdersListPage;
