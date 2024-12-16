import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  ButtonGroup,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  Box,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { addItemToOrder } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB').format(date);
};

const ProductAddToCart = ({
  product_id,
  product_name,
  brand,
  price_ttc,
  orderId,
  image1,
  image2,
  image3,
  stocks = [],
}) => {
  const [quantity, setQuantity] = useState(1);
  const [quantityInStock, setQuantityInStock] = useState(0);
  const [expirationDate, setExpirationDate] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal controls
  const priceValue = parseFloat(price_ttc);
  const formattedPrice = !isNaN(priceValue) ? priceValue.toFixed(2) : '0.00';
  const [currentImage, setCurrentImage] = useState(image1);

  useEffect(() => {
    if (auth && Array.isArray(stocks)) {
      const stock = stocks.find((item) => item.store === 'CRE71780'); // Adjust store ID as needed
      if (stock) {
        setQuantityInStock(stock.quantity);
        setExpirationDate(stock.expiration_date);
      } else {
        setQuantityInStock(0);
        setExpirationDate(null);
      }
    }
  }, [auth, stocks]);

  const handleAddToCart = async () => {
    if (auth) {
      try {
        await addItemToOrder(orderId, product_id, quantity);
        setQuantity(1);

        toast({
          title: 'Produit ajouté au panier',
          description: `${product_name} a été ajouté à votre panier.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Échec de l'ajout du produit",
          description:
            "Un problème est survenu lors de l'ajout du produit à votre panier.",
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      navigate('/signin');
    }
  };

  const handleImageClick = (image) => {
    setCurrentImage(image);
    onOpen();
  };

  return (
    <>
      <Card maxW="sm">
        <CardBody>
          {image1 && (
            <Image
              src={image1}
              alt={product_name}
              borderRadius="lg"
              onClick={() => handleImageClick(image1)}
              cursor="pointer"
            />
          )}
          <Stack mt="6" spacing="3">
            <Heading size="md">{product_name}</Heading>
            <Text>{brand}</Text>
            <HStack spacing="6" w="100%">
              {auth && (
                <>
                  <Box flex="1">
                    <Text>{`DLC: ${
                      expirationDate ? formatDate(expirationDate) : 'N/A'
                    }`}</Text>
                  </Box>
                  <Box flex="1">
                    <Text>{`Stock: ${quantityInStock}`}</Text>
                  </Box>
                </>
              )}
            </HStack>
            <Text color="blue.600" fontSize="2xl">
              {auth ? `${formattedPrice} euros` : ''}
            </Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup spacing="2">
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={handleAddToCart}
            >
              Ajouter
            </Button>
            <NumberInput
              value={quantity}
              min={1}
              max={quantityInStock > 0 ? quantityInStock : 20}
              onChange={(valueString) => setQuantity(parseInt(valueString, 10))}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </ButtonGroup>
        </CardFooter>
      </Card>

      {/* Modal for gallery */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Image src={currentImage} alt={product_name} borderRadius="lg" />
            <HStack spacing="4" mt="4" justify="center">
              {[image1, image2, image3].filter(Boolean).map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  boxSize="50px"
                  onClick={() => setCurrentImage(image)}
                  cursor="pointer"
                  border={currentImage === image ? '2px solid blue' : 'none'}
                />
              ))}
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

ProductAddToCart.propTypes = {
  product_id: PropTypes.string.isRequired,
  product_name: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
  price_ttc: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  orderId: PropTypes.string,
  image1: PropTypes.string,
  image2: PropTypes.string,
  image3: PropTypes.string,
  stocks: PropTypes.arrayOf(
    PropTypes.shape({
      store: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      expiration_date: PropTypes.string.isRequired,
    })
  ),
};

export default ProductAddToCart;
