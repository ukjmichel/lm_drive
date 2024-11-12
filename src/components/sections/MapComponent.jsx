import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
  Box,
  Heading,
  VStack,
  Grid,
  GridItem,
  Text,
  Flex,
  HStack,
  Link,
  Icon,
  Button,
} from '@chakra-ui/react';
import L from 'leaflet';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Set up the marker icon (default leaflet marker icon setup)
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const googleMapsLink = 'https://maps.app.goo.gl/72P9ZjBAiwrsEonw7';

const MapComponent = () => {
  const position = [45.990740174373386, 4.721768149075462]; // Default position (LAO Market)

  return (
    <Box p={5}>
      <VStack spacing={5}>
        <Grid
          w="100%"
          h={{ base: 'auto', md: '500px' }}
          border="1px solid #e2e8f0"
          borderRadius="lg"
          boxShadow="md"
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
        >
          <GridItem
            p={6}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={12}
          >
            <Flex flexDirection="column" alignItems="center">
              <Heading as="h1" fontSize="2xl">
                Nous trouver
              </Heading>
              <Text fontWeight="bold">LAO MARKET</Text>
              <Text>9 Bd Louis Blanc</Text>
              <Text>69400 Villefranche-sur-Saône</Text>
            </Flex>
            <Flex flexDirection="column" alignItems="center">
              <Heading as="h1" fontSize="2xl">
                Nous joindre
              </Heading>
              <Text>09 83 97 95 80</Text>
            </Flex>
            <Flex flexDirection="column" alignItems="center">
              <Heading as="h1" fontSize="2xl">
                Nous Suivre
              </Heading>
              <HStack spacing={4}>
                <Link href="https://www.instagram.com" isExternal>
                  <Icon as={FaInstagram} w={6} h={6} />
                </Link>
                <Link href="https://www.facebook.com" isExternal>
                  <Icon as={FaFacebook} w={6} h={6} />
                </Link>
              </HStack>
            </Flex>
          </GridItem>

          <GridItem
            p={12}
            display="flex"
            flexDirection="column"
            gap={4}
            alignItems="center"
            justifyContent="center"
            minH={'500px'}
          >
            {/* Wrap only the MapContainer with motion.div */}
            <motion.div
              initial={{ opacity: 0, y: 100 }} // Start from the bottom with opacity 0
              animate={{ opacity: 1, y: 0 }} // Animate to the original position with full opacity
              transition={{ duration: 1 }} // 1 second transition duration
              style={{ width: '100%', height: '100%' }} // Ensure the motion container takes up the full size
            >
              <MapContainer
                center={position}
                zoom={13}
                style={{ height: '100%', width: '100%' }} // Set the size of the map
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position} icon={icon}>
                  <Popup>Lao Market</Popup>
                </Marker>
              </MapContainer>
            </motion.div>

            {/* Delay the appearance of the Button */}
            <motion.div
              initial={{ opacity: 0 }} // Start with opacity 0
              animate={{ opacity: 1 }} // Fade in
              transition={{ duration: 1, delay: 1 }} // Start the fade-in after the map animation completes
            >
              <Link href={googleMapsLink} isExternal>
                <Button
                  bg="blue.400"
                  color="white"
                  _hover={{ bg: 'blue.500' }}
                  _focus={{ boxShadow: 'outline' }}
                >
                  View on Google Maps
                </Button>
              </Link>
            </motion.div>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};

export default MapComponent;
