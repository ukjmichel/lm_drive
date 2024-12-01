import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';

import { useState } from 'react';
import { useAuth } from '../../hook/AuthContext';

const SignInForm = () => {
  const { login } = useAuth();
  const toast = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Réinitialiser les toasts
    toast.closeAll();

    // Validation des champs
    if (!username.trim() || !password.trim()) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir tous les champs avant de continuer.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    // Timeout pour forcer l'arrêt de l'état de chargement après 10 secondes
    const timeout = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Erreur de connection',
        description:
          'Le serveur met trop de temps à répondre. Veuillez réessayer.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }, 10000); // Timeout de 10 secondes

    try {
      await login(username, password);

      // Annuler le timeout en cas de succès
      clearTimeout(timeout);

      // Succès : afficher un message de réussite
      toast({
        title: 'Connexion réussie',
        description: 'Vous êtes maintenant connecté.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Logique de redirection ici si nécessaire
      console.log('Connexion réussie');
    } catch (error) {
      // Annuler le timeout en cas d'erreur
      clearTimeout(timeout);

      const errorMessage =
        error?.response?.data?.detail ||
        'Identifiant ou mot de passe incorrect.';
      toast({
        title: 'Erreur de connexion',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      console.error('Erreur lors de la connexion :', error);
    } finally {
      setIsLoading(false); // Réinitialiser l'état de chargement
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Connectez-vous</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="username" isRequired>
                <FormLabel>Identifiant</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Entrez votre identifiant"
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Mot de passe</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                />
              </FormControl>
              <Stack spacing={10}>
                <Button
                  isLoading={isLoading} // Désactiver le bouton lors du chargement
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  type="submit"
                >
                  Se connecter
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignInForm;
