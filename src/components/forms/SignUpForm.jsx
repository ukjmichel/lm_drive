import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { createAccount } from '../../api/apiClient'; // Ajustez selon votre implémentation
import { useAuth } from '../../context/AuthContext';

const SignUpForm = () => {
  const { login } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

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
    if (!formData.confirmPassword.trim()) {
      validationErrors.confirmPassword =
        'La confirmation du mot de passe est requise.';
    } else if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword =
        'Les mots de passe ne correspondent pas.';
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Effectuer une validation avant d'envoyer la requête
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

    setIsSubmitting(true);

    try {
      const response = await createAccount(formData);

      if (response.status === 201) {
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        toast({
          title: 'Inscription réussie',
          description: 'Votre compte a été créé avec succès.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        await login(formData.username, formData.password);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        const apiErrors = error.response.data;
        const formattedErrors = {};

        // Gestion des erreurs API
        if (
          apiErrors.user &&
          apiErrors.user.username &&
          apiErrors.user.username[0] !== formData.username
        ) {
          formattedErrors.username = 'Cet identifiant existe déjà.';
        }

        if (apiErrors.email && apiErrors.email !== formData.email) {
          formattedErrors.email = 'Cet email est déjà utilisé.';
        }

        setErrors(formattedErrors);

        toast({
          title: 'Erreur lors de l’inscription',
          description: 'Veuillez corriger les erreurs signalées.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Erreur serveur',
          description: 'Une erreur inattendue est survenue.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl">Inscription</Heading>
        </Stack>
        <Box
          rounded="lg"
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow="lg"
          p={8}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Champ username */}
              <FormControl id="username" isInvalid={Boolean(errors.username)}>
                <FormLabel>Identifiant</FormLabel>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <Text color="red.500" mt={1}>
                    {errors.username}
                  </Text>
                )}
              </FormControl>

              {/* Champ email */}
              <FormControl id="email" isInvalid={Boolean(errors.email)}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <Text color="red.500" mt={1}>
                    {errors.email}
                  </Text>
                )}
              </FormControl>

              {/* Champ password */}
              <FormControl id="password" isInvalid={Boolean(errors.password)}>
                <FormLabel>Mot de passe</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <InputRightElement h="full">
                    <Button
                      variant="ghost"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errors.password && (
                  <Text color="red.500" mt={1}>
                    {errors.password}
                  </Text>
                )}
              </FormControl>

              {/* Champ confirmPassword */}
              <FormControl
                id="confirmPassword"
                isInvalid={Boolean(errors.confirmPassword)}
              >
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <Text color="red.500" mt={1}>
                    {errors.confirmPassword}
                  </Text>
                )}
              </FormControl>

              {/* Bouton de soumission */}
              <Stack spacing={10} pt={4}>
                <Button
                  isLoading={isSubmitting}
                  loadingText="Envoi..."
                  size="lg"
                  bg="blue.400"
                  color="white"
                  _hover={{ bg: 'blue.500' }}
                  type="submit"
                >
                  Valider l’inscription
                </Button>
              </Stack>

              <Stack pt={6}>
                <Text align="center">
                  Vous avez déjà un compte ?{' '}
                  <Link color="blue.400">Se connecter</Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignUpForm;
