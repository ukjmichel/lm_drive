import { useAuth } from '../hook/AuthContext';
import BaseFooter from './BaseFooter';
import BaseNavbar from './BaseNavbar';
import { Box } from '@chakra-ui/react';
import ConnectedNavbar from './ConnectedNavbar';
import AdminNavbar from './AdminNavBar';

const BaseLayout = ({ children }) => {
  const { auth, isAdmin } = useAuth();
  return (
    <Box maxWidth="1400px" margin="0 auto">
      <header>
        {auth && !isAdmin ? (
          <ConnectedNavbar />
        ) : auth && isAdmin ? (
          <AdminNavbar />
        ) : (
          <BaseNavbar />
        )}
      </header>
      <main>{children}</main>
      <footer>
        <BaseFooter />
      </footer>
    </Box>
  );
};
export default BaseLayout;
