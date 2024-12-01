import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  VStack,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { fetchCustomerData, updateCustomerInfo } from '../api/apiClient';
import { BaseLayout } from '../components';

const UserProfilPage = ({ onUpdate = null }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  });
  const [customerId, setCustomerId] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  // Charger les données utilisateur
  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const customerData = await fetchCustomerData();
        const customer = customerData[0];

        if (customer) {
          setCustomerId(customer.customer_id);
          setCustomerData(customer);
          setFormData({
            username: customer.user.username || '',
            email: customer.email || '',
            password: '',
            confirmPassword: '',
          });
        } else {
          toast({
            title: 'Erreur',
            description:
              'Impossible de récupérer les informations utilisateur.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: 'Erreur',
          description:
            "Une erreur s'est produite lors du chargement des données.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [toast]);

  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 20) {
      return 'Le mot de passe doit contenir entre 8 et 20 caractères.';
    }
    return null;
  };

  const validateForm = () => {
    const validationErrors = {};

    // Validation pour le champ "username"
    if (!formData.username.trim()) {
      validationErrors.username = 'L’identifiant est requis.';
    } else if (formData.username.length < 4 || formData.username.length > 20) {
      validationErrors.username =
        'L’identifiant doit contenir entre 4 et 20 caractères.';
    }

    // Validation pour le champ "email"
    if (!formData.email.trim()) {
      validationErrors.email = 'L’email est requis.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = 'Veuillez entrer une adresse email valide.';
    }

    // Validation pour le champ "password"
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      validationErrors.password = passwordError;
    }

    // Validation pour le champ "confirmPassword"
    if (formData.password && formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword =
        'Les mots de passe ne correspondent pas.';
    }

    return validationErrors;
  };

  const handleSubmit = async () => {
    setErrors({});
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: 'Erreur de validation',
        description: 'Veuillez corriger les erreurs dans le formulaire.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    const payload = {};

    if (formData.username && formData.username !== customerData.user.username) {
      payload.user = { ...payload.user, username: formData.username };
    }

    if (formData.password) {
      payload.user = { ...payload.user, password: formData.password };
    }

    if (formData.email && formData.email !== customerData.email) {
      payload.email = formData.email;
    }

    if (Object.keys(payload).length === 0) {
      toast({
        title: 'Aucune modification',
        description: 'Aucune information à mettre à jour.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      await updateCustomerInfo(customerId, payload);

      toast({
        title: 'Succès',
        description: 'Les informations utilisateur ont été mises à jour.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      if (onUpdate) onUpdate();
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return (
      <BaseLayout>
        <Flex justify="center" align="center" h="100vh">
          <Spinner size="xl" />
        </Flex>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Box
        p={8}
        borderWidth={1}
        borderRadius="md"
        boxShadow="lg"
        maxW="500px"
        mx="auto"
        bg="white"
      >
        <Heading as="h3" size="lg" mb={6} textAlign="center">
          Profil Utilisateur
        </Heading>

        <VStack spacing={6} align="stretch">
          {/* Customer ID */}
          <Flex justify="space-between" align="center">
            <Text fontWeight="bold">ID Client :</Text>
            <Text fontSize="lg" fontWeight="bold" color="teal.500">
              {customerId}
            </Text>
          </Flex>

          {/* Nom d'utilisateur */}
          <FormControl isInvalid={Boolean(errors.username)}>
            <FormLabel>Nom d'utilisateur</FormLabel>
            <Input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            {errors.username && <Text color="red.500">{errors.username}</Text>}
          </FormControl>

          {/* Email */}
          <FormControl isInvalid={Boolean(errors.email)}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && <Text color="red.500">{errors.email}</Text>}
          </FormControl>

          {/* Mot de passe */}
          <FormControl isInvalid={Boolean(errors.password)}>
            <FormLabel>Mot de passe</FormLabel>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {errors.password && <Text color="red.500">{errors.password}</Text>}
          </FormControl>

          {/* Confirmation du mot de passe */}
          <FormControl isInvalid={Boolean(errors.confirmPassword)}>
            <FormLabel>Confirmer le mot de passe</FormLabel>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            {errors.confirmPassword && (
              <Text color="red.500">{errors.confirmPassword}</Text>
            )}
          </FormControl>
        </VStack>

        <Flex justify="center" mt={6}>
          <Button
            colorScheme="green"
            isLoading={loading}
            onClick={handleSubmit}
          >
            Mettre à jour
          </Button>
        </Flex>
      </Box>
    </BaseLayout>
  );
};

// Validation des props
UserProfilPage.propTypes = {
  onUpdate: PropTypes.func,
};

export default UserProfilPage;
