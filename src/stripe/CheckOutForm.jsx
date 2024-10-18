import React, { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  VStack,
  useToast,
  Flex,
  Text,
  Divider,
} from '@chakra-ui/react';
import {
  getCustomerOrder,
  getCustomerOrders,
  processPayment,
} from '../api/apiClient';

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState({});
  const { order_id, items = [], total_amount } = order;

  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getCustomerOrders();
        const pendingOrder = response.find(
          (order) => order.status === 'pending'
        );

        if (pendingOrder) {
          const pendingOrderDetail = await getCustomerOrder(
            pendingOrder.order_id
          );
          setOrder(pendingOrderDetail);
        } else {
          console.error('No pending orders found.');
          toast({
            title: 'No Pending Orders',
            description: 'You have no pending orders.',
            status: 'info',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        toast({
          title: 'Error Fetching Order',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchOrder();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      toast({
        title: 'Stripe not loaded',
        description: 'Stripe has not been properly loaded. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Create a payment method with Stripe
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      toast({
        title: 'Payment Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    // Send payment details to your API, including the order number
    try {
      const response = await processPayment({
        order_id: order_id,
        payment_method_id: paymentMethod.id,
        amount: total_amount * 100, // Ensure amount is in cents
        currency: 'eur',
      });

      // Directly use response since it's already parsed in your processPayment function
      if (response.status === 'success') {
        const paymentIntent = response.payment_intent;
        const paymentDetails = response.payment;

        toast({
          title: 'Payment Successful',
          description: `Payment processed successfully. Order ID: ${order_id}.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Optionally, log these details for further processing
        //console.log('Payment Details:', paymentDetails);
        //console.log('Payment Intent:', paymentIntent);
      } else {
        // Handle error based on response structure
        const errorMessage = response.data?.error || response.statusText;
        toast({
          title: 'Payment Failed',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (apiError) {
      console.error('API error:', apiError);
      toast({
        title: 'API Error',
        description: apiError.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth="500px" mx="auto" p={6} boxShadow="md" borderRadius="md">
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        Finaliser la commande
      </Heading>

      {/* Order Summary */}
      <Box
        mb={4}
        p={4}
        border="1px solid #E2E8F0"
        borderRadius="md"
        boxShadow="sm"
      >
        <Heading as="h3" size="md" mb={4} textAlign="center" color="teal.500">
          Résumé
        </Heading>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Commande n°:{' '}
          <Text as="span" color="teal.600" textTransform="uppercase">
            {order_id || 'Loading...'}
          </Text>
        </Text>

        <Divider my={4} />

        {/* Item Details */}
        {items.length > 0 ? (
          items.map(({ product, quantity }, index) => (
            <Flex
              key={index}
              justifyContent="space-between"
              alignItems="center"
              my={2}
            >
              <Text fontSize="md" fontWeight="medium">
                {product.product_name}
              </Text>
              <Text>Qty: {quantity}</Text>
              <Text fontWeight="bold" color="teal.600">
                {product.price} euros
              </Text>
            </Flex>
          ))
        ) : (
          <Text>No items in the order.</Text>
        )}

        <Divider my={4} />

        {/* Total Amount */}
        <Text fontSize="lg" fontWeight="bold">
          Total:{' '}
          <Text as="span" color="teal.600">
            {total_amount ? `${total_amount} euros` : 'Calculating...'}
          </Text>
        </Text>
      </Box>

      {/* Payment Form */}
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Card Details</FormLabel>
            <Box
              border="1px solid #E2E8F0"
              p={2}
              borderRadius="md"
              boxShadow="sm"
              mb={4}
            >
              <CardElement />
            </Box>
          </FormControl>

          <Button
            colorScheme="teal"
            type="submit"
            isLoading={loading}
            loadingText="Processing"
            width="full"
          >
            Procéder au paiement
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CheckoutForm;
