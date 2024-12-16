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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import {
  getCustomerOrder,
  getCustomerOrders,
  processPayment,
  updatePaymentStatus,
} from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = () => {
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [order, setOrder] = useState(null);
  const { order_id, items = [], total_ttc } = order || {};

  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoadingOrder(true);
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
          showToast(
            'Aucune commande en attente',
            "Vous n'avez aucune commande en attente.",
            'info'
          );
          navigate('/');
        }
      } catch (error) {
        showToast(
          'Erreur lors de la récupération de la commande',
          error.message,
          'error'
        );
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [toast, navigate]);

  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingPayment(true);

    if (!stripe || !elements) {
      showToast('Stripe non chargé', 'Veuillez réessayer plus tard.', 'error');
      setLoadingPayment(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      showToast(
        'Élément de carte introuvable',
        "Veuillez vérifier que l'élément de carte est disponible.",
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
        showToast('Erreur de paiement', paymentError.message, 'error');
        setLoadingPayment(false);
        return;
      }

      const response = await processPayment({
        order_id,
        payment_method_id: paymentMethod.id,
        amount: total_ttc * 100,
        currency: 'eur',
      });

      const { clientSecret, requiresAction } = response;

      if (!clientSecret) {
        showToast(
          'Échec du paiement',
          'Aucun clientSecret trouvé. Veuillez réessayer.',
          'error'
        );
        await updatePaymentStatus(order_id, 'failed');
        setLoadingPayment(false);
        return;
      }

      if (requiresAction) {
        const stripeResponse = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

        if (stripeResponse.error) {
          showToast(
            'Erreur de paiement',
            stripeResponse.error.message,
            'error'
          );
          await updatePaymentStatus(order_id, 'failed');
        } else if (stripeResponse.paymentIntent) {
          const paymentIntent = stripeResponse.paymentIntent;

          if (paymentIntent.status === 'succeeded') {
            showToast(
              'Paiement réussi',
              `La commande n° ${order_id.toUpperCase()} a été payée.`,
              'success'
            );
            await updatePaymentStatus(order_id, 'succeeded');
            setTimeout(() => navigate('/'), 2000);
          } else {
            showToast(
              'Échec du paiement',
              'Le paiement n’a pas pu être traité. Veuillez réessayer.',
              'error'
            );
            await updatePaymentStatus(order_id, 'failed');
          }
        }
      } else {
        showToast(
          'Paiement réussi',
          `La commande n° ${order_id.toUpperCase()} a été payée.`,
          'success'
        );
        await updatePaymentStatus(order_id, 'succeeded');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (apiError) {
      console.error('Erreur API :', apiError);
      showToast('Erreur API', apiError.message, 'error');
      await updatePaymentStatus(order_id, 'failed');
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <Box
      maxWidth="600px"
      mx="auto"
      mt={8}
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="xl"
      bg="gray.50"
    >
      <Heading
        as="h1"
        mb={6}
        textAlign="center"
        color="teal.600"
        fontSize="2xl"
      >
        Finalisez votre paiement
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          {items.length > 0 ? (
            <>
              <TableContainer>
                <Table colorScheme="teal">
                  <Thead>
                    <Tr>
                      <Th>Produit</Th>
                      <Th isNumeric>Quantité</Th>
                      <Th isNumeric>Pu TTC (€)</Th>
                      <Th isNumeric>Total (€)</Th>
                    </Tr>
                  </Thead>
                  <Tbody
                    sx={{
                      '& > tr': {
                        bg: 'gray.100', // Set the background color for all rows
                      },
                    }}
                  >
                    {items.map(({ product, id, quantity }) => (
                      <Tr key={id}>
                        <Td>{product.product_name}</Td>
                        <Td isNumeric>{quantity}</Td>
                        <Td isNumeric>{product.price_ttc.toFixed(2)}</Td>

                        <Td isNumeric>
                          {(quantity * product.price_ttc).toFixed(2)}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              <Divider my={4} />
              <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                <Text>Total :</Text>
                <Text color="teal.600">
                  €
                  {items
                    .reduce(
                      (total, { product, quantity }) =>
                        total + product.price_ttc * quantity,
                      0
                    )
                    .toFixed(2)}
                </Text>
              </Flex>
            </>
          ) : (
            <Text>Aucun article dans cette commande.</Text>
          )}
          <Divider my={4} />

          <Box
            p={4}
            borderWidth="2px"
            borderRadius="md"
            borderColor="teal.500"
            bg="white"
            boxShadow="lg"
          >
            <FormControl id="payment-method">
              <FormLabel fontWeight="bold" fontSize="lg" color="teal.600">
                Méthode de paiement
              </FormLabel>
              <CardElement options={{ hidePostalCode: true }} />
            </FormControl>
            <Flex justifyContent="space-between" alignItems="center" mt={4}>
              <Text fontSize="lg" fontWeight="semibold">
                Total : €{total_ttc}
              </Text>
              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                isLoading={loadingPayment || loadingOrder}
                isDisabled={
                  !stripe || !total_ttc || loadingOrder || loadingPayment
                }
              >
                Payer maintenant
              </Button>
            </Flex>
          </Box>
        </VStack>
      </form>

      <Button
        mt={6}
        onClick={() => navigate(`/cart`)}
        colorScheme="gray"
        variant="outline"
        isDisabled={loadingOrder}
      >
        Retour aux détails de la commande
      </Button>
    </Box>
  );
};

export default CheckoutForm;
