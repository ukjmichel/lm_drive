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
import { useAuth } from '../../hook/AuthContext';
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
            onClick={() => handleLogout()}
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

// Sub-navigation for desktop view
const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Box
      as="a"
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400 ' }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>

        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
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
const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        as="a"
        href={href ?? '#'}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>

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
              <Box as="a" key={child.label} py={2} href={child.href}>
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

// Navigation items for the desktop and mobile views
const NAV_ITEMS = [
  {
    label: 'Acceuil',
    url: '/',
  },
  {
    label: 'Commande',
    url: '/admin/orders/',
  },
];

// Prop validation for DesktopSubNav
DesktopSubNav.propTypes = {
  label: PropTypes.string.isRequired, // For the label of the sub-nav item
  href: PropTypes.string.isRequired, // For the URL of the sub-nav item
  subLabel: PropTypes.string.isRequired, // For the sub-label text
};

// Prop validation for MobileNavItem
MobileNavItem.propTypes = {
  label: PropTypes.string.isRequired, // For the label of the nav item
  href: PropTypes.string, // For the URL of the nav item
  children: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired, // For the label of the sub-nav item
      href: PropTypes.string.isRequired, // For the URL of the sub-nav item
    })
  ), // Array of sub-nav items
};

// Prop validation for AdminNavbar (optional)
AdminNavbar.propTypes = {
  // If any props are expected in AdminNavbar, define them here
  // For example:
  // user: PropTypes.object.isRequired,
};

export default AdminNavbar;
