import { Grid, Box } from '@chakra-ui/react';
import { StripeContainer } from '../stripe';

const CheckoutPage = () => {
  return (
    <Grid h="100vh" alignItems={'center'}>
      <Box h={'600px'}>
        <StripeContainer />
      </Box>
    </Grid>
  );
};
export default CheckoutPage;
