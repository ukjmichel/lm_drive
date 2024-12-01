import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  Checkbox,
  Flex,
  Heading,
  Select,
} from '@chakra-ui/react';
import { getBrands, getSubcategories } from '../../api/apiClient';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const ProductsFilter = ({ handleSelectBrand, handleSelectSubcategories }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState();
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSubcategories();
        setSubcategories(response);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBrands();
        setBrands(response);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchData();
  }, []);

  const handleOnBrandSelect = (brandName) => {
    setSelectedBrand(brandName);
    handleSelectBrand(brandName);
  };

  const handleOnSelectSubcategories = (subCategoryName) => {
    setSelectedSubcategories((prevSelected) => {
      const isAlreadySelected = prevSelected.includes(subCategoryName);
      const updatedSelected = isAlreadySelected
        ? prevSelected.filter((name) => name !== subCategoryName)
        : [...prevSelected, subCategoryName];

      handleSelectSubcategories(updatedSelected.join(',')); // Pass comma-separated string to parent
      return updatedSelected;
    });
  };

  const handleResetFilters = () => {
    setSelectedBrand(null);
    setSelectedSubcategories([]);
    handleSelectBrand(''); // Reset brand in parent component
    handleSelectSubcategories(''); // Reset subcategories in parent component
  };

  return (
    <Box px={8} py={2}>
      <Button onClick={onOpen}>Filtre</Button>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent
          maxW={{ base: '100vw', sm: '100vw', md: '400px' }} // Full-width for base and sm, default width for md and up
          width={{ base: '100vw', sm: '100vw', md: '400px' }}
        >
          <DrawerCloseButton />
          <DrawerHeader> Options</DrawerHeader>
          <DrawerBody>
            <Heading fontSize={24}>Sous-catégories</Heading>
            <Flex flexDir={'column'}>
              {subcategories.map(({ name }, index) => (
                <Checkbox
                  key={index}
                  textTransform={'capitalize'}
                  onChange={() => handleOnSelectSubcategories(name)}
                  isChecked={selectedSubcategories.includes(name)}
                >
                  {name}
                </Checkbox>
              ))}
            </Flex>

            <Heading fontSize={24} mt={4}>
              Brands
            </Heading>
            <Select
              placeholder="Select a brand"
              value={selectedBrand || ''}
              onChange={(e) => handleOnBrandSelect(e.target.value)}
            >
              {brands.map((brand) => (
                <option key={brand.id} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </Select>

            <Button mt={4} colorScheme="red" onClick={handleResetFilters}>
              Reset Filter
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

// Define PropTypes
ProductsFilter.propTypes = {
  handleSelectBrand: PropTypes.func.isRequired,
  handleSelectSubcategories: PropTypes.func.isRequired,
};

export default ProductsFilter;
