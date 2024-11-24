import { useEffect, useState } from 'react';
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
  updatePaymentStatus,
} from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = () => {
  const [loadingOrder, setLoadingOrder] = useState(false); // Loading state for order fetching
  const [loadingPayment, setLoadingPayment] = useState(false); // Loading state for payment processing
  const [order, setOrder] = useState(null); // Store order details
  const { order_id, items = [], total_amount } = order || {}; // Destructuring order details (safe for null)

  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();
  const navigate = useNavigate();

  // Fetch the pending order
  useEffect(() => {
    const fetchOrder = async () => {
      setLoadingOrder(true); // Set loading state before making API call
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
          showToast('No Pending Orders', 'You have no pending orders.', 'info');
          navigate('/'); // Redirect to homepage if no orders
        }
      } catch (error) {
        showToast('Error Fetching Order', error.message, 'error');
      } finally {
        setLoadingOrder(false); // Turn off loading state after fetch completes
      }
    };

    fetchOrder();
  }, [toast, navigate]);

  // Helper function to display toast messages
  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
    });
  };

  // Handle payment processing
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingPayment(true);

    if (!stripe || !elements) {
      showToast('Stripe not loaded', 'Please try again later.', 'error');
      setLoadingPayment(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      showToast(
        'Card Element Not Found',
        'Please ensure the card element is available.',
        'error'
      );
      setLoadingPayment(false);
      return;
    }

    try {
      const { error: paymentError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

      if (paymentError) {
        showToast('Payment Error', paymentError.message, 'error');
        setLoadingPayment(false);
        return;
      }

      const response = await processPayment({
        order_id,
        payment_method_id: paymentMethod.id,
        amount: total_amount * 100,
        currency: 'eur',
      });

      const { clientSecret, requiresAction } = response;

      if (!clientSecret) {
        showToast(
          'Payment Failed',
          'No clientSecret found. Please try again.',
          'error'
        );
        await updatePaymentStatus(order_id, 'failed'); // Update to failed on clientSecret error
        setLoadingPayment(false);
        return;
      }

      if (requiresAction) {
        const stripeResponse = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

        if (stripeResponse.error) {
          showToast('Payment Error', stripeResponse.error.message, 'error');
          await updatePaymentStatus(order_id, 'failed'); // Update to failed on 3D Secure error
        } else if (stripeResponse.paymentIntent) {
          const paymentIntent = stripeResponse.paymentIntent;

          if (paymentIntent.status === 'succeeded') {
            showToast(
              'Payment Successful',
              `Order ID: ${order_id} has been paid.`,
              'success'
            );
            await updatePaymentStatus(order_id, 'succeeded');
            setTimeout(() => navigate('/'), 2000);
          } else {
            showToast(
              'Payment Failed',
              'The payment could not be processed. Please try again.',
              'error'
            );
            await updatePaymentStatus(order_id, 'failed'); // Update to failed on unexpected intent status
          }
        }
      } else {
        showToast(
          'Payment Successful',
          `Order ID: ${order_id} has been paid.`,
          'success'
        );
        await updatePaymentStatus(order_id, 'succeeded');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (apiError) {
      console.error('API Error:', apiError);
      showToast('API Error', apiError.message, 'error');
      await updatePaymentStatus(order_id, 'failed'); // Update to failed on API error
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <Box maxWidth="500px" mx="auto">
      <Heading as="h1" mb={4} textAlign="center">
        Complete Your Payment
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={2} align="stretch">
          {items.length > 0 ? (
            <>
              {items.map(({ product, id, quantity }) => (
                <Box
                  key={id}
                  p={2}
                  borderWidth="1px"
                  borderRadius="md"
                  boxShadow="lg"
                  mb={2}
                  _hover={{ boxShadow: 'xl' }} // Hover effect for better interactivity
                  bg="white"
                >
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontWeight="semibold" fontSize="lg" color="gray.800">
                      {quantity} x {product.product_name}
                    </Text>
                    <Text fontSize="lg" fontWeight="medium" color="teal.500">
                      €{product.price.toFixed(2)}
                    </Text>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.500">
                      Total:
                    </Text>
                    <Text fontSize="sm" fontWeight="bold" color="teal.600">
                      €{(quantity * product.price).toFixed(2)}
                    </Text>
                  </Flex>
                </Box>
              ))}
              <Divider my={4} />
              <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                <Text>Total:</Text>
                <Text color="teal.600">
                  €
                  {items
                    .reduce(
                      (total, { product, quantity }) =>
                        total + product.price * quantity,
                      0
                    )
                    .toFixed(2)}
                </Text>
              </Flex>
            </>
          ) : (
            <Text>No items in this order.</Text>
          )}
          <Divider />
          <FormControl id="payment-method">
            <FormLabel>Payment Method</FormLabel>
            <CardElement options={{ hidePostalCode: true }} />
          </FormControl>
          <Flex justifyContent="space-between" alignItems="center">
            <Text>Total: €{total_amount}</Text>
            <Button
              type="submit"
              colorScheme="teal"
              isLoading={loadingPayment || loadingOrder} // Disable button during loading
              isDisabled={
                !stripe || !total_amount || loadingOrder || loadingPayment
              }
            >
              Pay Now
            </Button>
          </Flex>
        </VStack>
      </form>

      {/* Button to return to the order detail page */}
      <Button
        mt={4}
        onClick={() => navigate(`/cart`)} // Navigate back to the order detail page
        colorScheme="gray"
        variant="outline"
        isDisabled={loadingOrder}
      >
        Return to Order Details
      </Button>
    </Box>
  );
};

export default CheckoutForm;
