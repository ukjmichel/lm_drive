import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { BaseLayout } from '../../components';
import { getCustomerOrder } from '../../api/apiClient';
import { Box, Flex, Checkbox, Text } from '@chakra-ui/react';

const OrdersListPage = () => {
  const { orderId } = useParams(); // Retrieve order ID from URL
  const [order, setOrder] = useState();
  const [orderItems, setOrderItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [finalCheckboxChecked, setFinalCheckboxChecked] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getCustomerOrder(orderId);

        setOrder(response); // Set specific order if found
        setOrderItems(response.items);
        setCheckedItems(new Array(response.items.length).fill(false)); // Initialize checkbox state
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [orderId]); // Add orderId as a dependency

  // Function to handle individual checkbox changes
  const handleCheckboxChange = (index) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index];
    setCheckedItems(updatedCheckedItems);
  };

  // Function to check if all checkboxes are validated
  const allChecked = checkedItems.every(Boolean);

  return (
    <BaseLayout>
      <Flex margin={4} gap={4}>
        <Box>Numéros de commande</Box>
        <Box>{orderId ? orderId.toUpperCase() : 'N/A'}</Box>
      </Flex>

      {orderItems.map(({ id, product, quantity }, index) => (
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
            isDisabled={finalCheckboxChecked} // Disable when the final checkbox is checked
            onChange={() => handleCheckboxChange(index)}
          />
        </Flex>
      ))}

      <Flex margin={4} gap={4}>
        <Flex width="350px">
          <Box>
            <Text>Commande prête</Text>
          </Box>
        </Flex>
        <Checkbox
          isChecked={finalCheckboxChecked}
          isDisabled={!allChecked} // Enable only when all other checkboxes are checked
          onChange={() => setFinalCheckboxChecked(!finalCheckboxChecked)}
        />
      </Flex>
    </BaseLayout>
  );
};

export default OrdersListPage;
