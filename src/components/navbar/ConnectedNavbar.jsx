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

import { IoIosBasket } from 'react-icons/io';
import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';

const ConnectedNavbar = () => {
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
            variant={'link'}
            onClick={handleLogout}
          >
            Se déconnecter
          </Button>
          <NavLink to="/cart">
            <Button
              display={'inline-flex'}
              fontSize={'2xl'}
              fontWeight={600}
              color={'white'}
              bg={'blue.400'}
              _hover={{ bg: 'blue.300' }}
            >
              <Icon as={IoIosBasket} p={0} />
            </Button>
          </NavLink>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

const DesktopNav = () => {
  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <NavLink key={navItem.label} to={navItem.url}>
          <Box>{navItem.label}</Box>
        </NavLink>
      ))}
    </Stack>
  );
};

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

const MobileNavItem = ({ label, children, url }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        display={'flex'}
        justifyContent="space-between"
        alignItems="center"
        _hover={{ textDecoration: 'none' }}
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
              <NavLink key={child.label} to={child.href}>
                <Box py={2}>{child.label}</Box>
              </NavLink>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

MobileNavItem.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ),
  url: PropTypes.string,
};

const NAV_ITEMS = [
  {
    label: 'Acceuil',
    url: '/',
  },
  {
    label: 'Boutique',
    url: '/store',
  },
  {
    label: 'Historique',
    url: '/historic',
  },
  {
    label: 'Profile',
    url: '/profil',
  },
];

export default ConnectedNavbar;
