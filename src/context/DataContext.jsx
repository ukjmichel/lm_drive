import PropTypes from 'prop-types'; // Import PropTypes
import { createContext, useState, useContext, useEffect } from 'react';
import {
  createCustomerOrder,
  fetchAllProducts,
  fetchCustomerData,
  getCustomerOrders,
} from '../api/apiClient';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [pendingOrderId, setPendingOrderId] = useState();

  const getProduct = async () => {
    
    try {
      const response = await fetchAllProducts();
      setProducts(response); // Store all products in context
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  //

  const getOrderId = async () => {
    try {
      let response = await getCustomerOrders();
      let pendingOrder = response.filter((order) => order.status === 'pending');
      if (pendingOrder.length === 0) {
        const customerData = await fetchCustomerData();
        const customerId = customerData[0].customer_id;
        pendingOrder = await createCustomerOrder({
          customerId: customerId,
          storeId: 'CRE71780',
        });
        response = await getCustomerOrders();
        pendingOrder = response.filter((order) => order.status === 'pending');
      }

      setPendingOrderId(pendingOrder[0].order_id);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    getOrderId();
  }, []);

  return (
    <DataContext.Provider
      value={{ products, setProducts, pendingOrderId, setPendingOrderId }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Add PropTypes validation
DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { DataProvider, DataContext };

// Create a custom hook to use the DataContext
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
