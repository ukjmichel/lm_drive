import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';

import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';

// AdminNavbar component
const AdminNavbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate('/');
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>

        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Flex
            display={{ base: 'none', md: 'flex' }}
            ml={4}
            gap={6}
            alignItems={'center'}
          >
            <NavLink to="/">
              <Text
                textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                fontFamily={'heading'}
                color={'white'}
                bg={'blue.400'}
                p={2}
              >
                LAO MARKET
              </Text>
            </NavLink>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          <Button
            fontSize={'sm'}
            fontWeight={400}
            bg={'blue.400'}
            color={'white'}
            _hover={{ bg: 'blue.300' }}
            onClick={handleLogout}
            aria-label="Log out"
          >
            Se déconnecter
          </Button>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

// Desktop navigation items (links)
const DesktopNav = () => {
  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <NavLink
          key={navItem.label}
          to={navItem.url}
          style={({ isActive }) => ({
            color: isActive ? 'blue.400' : 'inherit', // Highlight active link
          })}
        >
          <Box>{navItem.label}</Box>
        </NavLink>
      ))}
    </Stack>
  );
};

// Mobile navigation items (links)
const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

// Mobile navigation item with collapsible sub-items
const MobileNavItem = ({ label, children, url }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        display={'flex'}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: 'none',
        }}
      >
        <NavLink to={url} style={{ width: '100%' }}>
          <Text
            fontWeight={600}
            color={useColorModeValue('gray.600', 'gray.200')}
          >
            {label}
          </Text>
        </NavLink>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Box>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <NavLink key={child.label} to={child.url}>
                <Box py={2}>{child.label}</Box>
              </NavLink>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

// Navigation items for the desktop and mobile views
const NAV_ITEMS = [
  {
    label: 'Accueil',
    url: '/',
  },
  {
    label: 'Commande',
    url: '/admin/orders/',
  },
];

// Prop validation for MobileNavItem
MobileNavItem.propTypes = {
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
};

export default AdminNavbar;
