import { GridItem, Grid, Text } from '@chakra-ui/react';
import { BaseLayout } from '../components';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { lm_e, lm_s, lm_b, lm_na } from '../assets/images'; // Updated lm_b and lm_na to match

const categories = [
  { name: 'Epicerie', image: lm_e },
  { name: 'Surgelée', image: lm_s },
  { name: 'Boisson', image: lm_b },
  { name: 'Non-Alimentaire', image: lm_na },
];

const StorePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger the animation after component mounts
  useEffect(() => {
    setIsVisible(true); // Set visibility to true when the component mounts
  }, []);

  return (
    <BaseLayout>
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
        gap={6}
        margin={4}
        minHeight="500px"
      >
        {categories.map(({ name, image }) => (
          <NavLink to={`/store/${name}`} key={name}>
            <GridItem
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="200px"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="2xl"
              boxShadow="md"
              transition="opacity 0.8s ease" // Transition for the opacity
              opacity={isVisible ? 1 : 0} // Opacity changes from 0 to 1
              backgroundImage={`url(${image})`} // Set the background image
              backgroundSize="cover" // Ensure the image covers the whole GridItem
              backgroundPosition="center" // Center the background image
              _hover={{
                '&::before': {
                  opacity: 0, // Remove the dark filter on hover
                },
              }}
              _before={{
                content: '""', // Add an empty string for the pseudo-element
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darken the background by default
                borderRadius: 'inherit',
                transition: 'opacity 0.4s ease', // Smooth transition for the dark filter
                opacity: 1, // Initial darkened opacity
              }}
            >
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="white"
                textShadow="1px 1px #000"
                zIndex={1}
              >
                {name}
              </Text>
            </GridItem>
          </NavLink>
        ))}
      </Grid>
    </BaseLayout>
  );
};

export default StorePage;
