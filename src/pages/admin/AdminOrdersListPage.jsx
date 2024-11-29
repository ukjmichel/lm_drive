import { useEffect, useState } from 'react';
import { BaseLayout } from '../../components';
import { getCustomerOrders, updateOrderStatus } from '../../api/apiClient';
import {
  Text,
  Box,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminOrderItem from './AdminOrderItem'; // Import the new component

const AdminOrdersListPage = () => {
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Track selected order for modal
  const [animate, setAnimate] = useState(false); // Trigger animation after fetching orders
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI modal hooks
  const toast = useToast(); // Chakra UI toast for notifications

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getCustomerOrders();
        if (response) {
          setConfirmedOrders(
            response.filter(
              (order) =>
                order.status === 'confirmed' || order.status === 'ready'
            )
          );
          setAnimate(true); // Trigger animations after orders are set
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Handle status update to 'fulfilled'
  const handleSetToFulfilled = async () => {
    if (!selectedOrder) return;

    try {
      const response = await updateOrderStatus(
        selectedOrder.order_id,
        'fulfilled'
      );
      toast({
        title: `Order ${response.order_id} marked as fulfilled.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Update the local state to reflect the change
      setConfirmedOrders((prev) =>
        prev.filter((order) => order.order_id !== selectedOrder.order_id)
      );

      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Failed to update order status.',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <BaseLayout>
      <Flex
        alignItems="center"
        borderBottom="1px solid"
        borderColor="gray.200"
        py={2}
        my={2}
      >
        <Box width="100px" textAlign="Center">
          <Text>n° cmd</Text>
        </Box>
        <Box width="100px" textAlign="Center">
          <Text>status</Text>
        </Box>
        <Box width="200px" textAlign="Center">
          <Text>Actions</Text>
        </Box>
      </Flex>

      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={animate ? 'visible' : 'hidden'}
        >
          {confirmedOrders.length > 0 ? (
            confirmedOrders.map((order) => (
              <AdminOrderItem
                key={order.order_id}
                order={order}
                onOpenModal={(selected) => {
                  setSelectedOrder(selected);
                  onOpen();
                }}
              />
            ))
          ) : (
            <Text>No orders found</Text>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modal for confirmation */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Action</ModalHeader>
          <ModalBody>
            Are you sure you want to mark order{' '}
            <Text as="span" fontWeight="bold">
              {selectedOrder?.order_id}
            </Text>{' '}
            as fulfilled?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleSetToFulfilled}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </BaseLayout>
  );
};

export default AdminOrdersListPage;
