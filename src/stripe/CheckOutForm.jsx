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
  const [loadingOrder, setLoadingOrder] = useState(false); // État de chargement des commandes
  const [loadingPayment, setLoadingPayment] = useState(false); // État de chargement du paiement
  const [order, setOrder] = useState(null); // Détails de la commande
  const { order_id, items = [], total_amount } = order || {}; // Détails de la commande

  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();
  const navigate = useNavigate();

  // Récupérer la commande en attente
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
          navigate('/'); // Redirection vers la page d'accueil
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

  // Fonction pour afficher les toasts
  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
    });
  };

  // Gérer le paiement
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
        amount: total_amount * 100,
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
    <Box maxWidth="500px" mx="auto">
      <Heading as="h1" mb={4} textAlign="center">
        Finalisez votre paiement
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
                  _hover={{ boxShadow: 'xl' }}
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
                      Total :
                    </Text>
                    <Text fontSize="sm" fontWeight="bold" color="teal.600">
                      €{(quantity * product.price).toFixed(2)}
                    </Text>
                  </Flex>
                </Box>
              ))}
              <Divider my={4} />
              <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                <Text>Total :</Text>
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
            <Text>Aucun article dans cette commande.</Text>
          )}
          <Divider />
          <FormControl id="payment-method">
            <FormLabel>Méthode de paiement</FormLabel>
            <CardElement options={{ hidePostalCode: true }} />
          </FormControl>
          <Flex justifyContent="space-between" alignItems="center">
            <Text>Total : €{total_amount}</Text>
            <Button
              type="submit"
              colorScheme="teal"
              isLoading={loadingPayment || loadingOrder}
              isDisabled={
                !stripe || !total_amount || loadingOrder || loadingPayment
              }
            >
              Payer maintenant
            </Button>
          </Flex>
        </VStack>
      </form>

      <Button
        mt={4}
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
