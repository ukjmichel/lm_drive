import { useAuth } from '../hook/AuthContext';
import BaseFooter from './BaseFooter';
import BaseNavbar from './BaseNavbar';
import { Box } from '@chakra-ui/react';
import ConnectedNavbar from './ConnectedNavbar';

const BaseLayout = ({ children }) => {
  const { auth } = useAuth();
  return (
    <Box maxWidth="1400px" margin="0 auto">
      <header>{auth ? <ConnectedNavbar /> : <BaseNavbar />}</header>
      <main>{children}</main>
      <footer>
        <BaseFooter />
      </footer>
    </Box>
  );
};
export default BaseLayout;
