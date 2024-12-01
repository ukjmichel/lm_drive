import PropTypes from 'prop-types'; // Import PropTypes
import { useAuth } from '../../hook/AuthContext';
import BaseFooter from '../sections/BaseFooter';
import BaseNavbar from '../navbar/BaseNavbar';
import { Box } from '@chakra-ui/react';
import ConnectedNavbar from '../navbar/ConnectedNavbar';
import AdminNavbar from '../navbar/AdminNavBar';

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

// Define prop types for the component
BaseLayout.propTypes = {
  children: PropTypes.node.isRequired, // Ensure children is a valid React node and is required
};

export default BaseLayout;
