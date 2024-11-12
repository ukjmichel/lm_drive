import {
  Container,
  Stack,
  Heading,
  Text,
  Button,
  Icon,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import SimpleSlider from './SimpleSlider';
import { motion } from 'framer-motion';

const BaseHero = () => {
  return (
    <Container maxW={'7xl'}>
      <Stack
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: 'column', md: 'row' }} // Stacks will be stacked vertically on small screens
      >
        {/* First Stack: From the left */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
            >
              <Text
                as={'span'}
                position={'relative'}
                _after={{
                  content: "''",
                  width: 'full',
                  height: '30%',
                  position: 'absolute',
                  bottom: 1,
                  left: 0,
                  bg: 'blue.400',
                  zIndex: -1,
                }}
              >
                Lao Market
              </Text>
              <br />
              <Text as={'span'} color={'blue.400'}>
                l&apos;asie en beaujolais
              </Text>
            </Heading>
            <Text color={'gray.500'}>
              Notre magasin de crèche sur saône vous propose une large gamme de
              produits d&apos;asie dans un service de Click&Collect.
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: 'column', sm: 'row' }}
            >
              <Button
                rounded={'full'}
                size={'lg'}
                fontWeight={'normal'}
                px={6}
                colorScheme={'red'}
                bg={'blue.400'}
                _hover={{ bg: 'blue.500' }}
              >
                <NavLink to="/store">Nos Produits</NavLink>
              </Button>

              <Button rounded={'full'} size={'lg'} fontWeight={'normal'} px={6}>
                Nous trouver
              </Button>
            </Stack>
          </Stack>
        </motion.div>

        {/* Second Stack: From the right */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <Stack
            flex={1}
            justify={'center'}
            align={'center'}
            position={'relative'}
            w={'full'}
            display={{ base: 'none', md: 'flex' }} // Hide this stack on small screens
          >
            <Blob
              w={'100%'}
              h={'150%'}
              position={'absolute'}
              top={'-20%'}
              left={0}
              zIndex={-1}
              color={'rgba(66, 153, 225, 0.2)'}
            />
            <SimpleSlider />
          </Stack>
        </motion.div>
      </Stack>
    </Container>
  );
};

const Blob = (props) => {
  return (
    <Icon viewBox="0 0 578 440" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
        fill="currentColor"
      />
    </Icon>
  );
};

export default BaseHero;
