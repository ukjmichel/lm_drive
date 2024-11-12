// import { useEffect, useState } from 'react';
// import { BaseLayout, OrderLine } from '../../components';
// import { getCustomerOrders, getCustomerOrder } from '../../api/apiClient';
// import { Text, Box, Flex, Center, Grid, GridItem } from '@chakra-ui/react';
// import { NavLink } from 'react-router-dom';

// const AdminOrdersListPage = () => {
//   const [ConfirmedOrders, setConfirmedOrders] = useState([]);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await getCustomerOrders();
//         if (response) {
//           // Use response.status instead of response
//           setConfirmedOrders(
//             response.filter(
//               (order) =>
//                 order.status === 'confirmed' || order.status === 'ready'
//             )
//           );
//         }
//       } catch (error) {
//         console.error('Error fetching orders:', error);
//       }
//     };

//     fetchOrders();
//   }, []);

//   return (
//     <>
//       <BaseLayout>
//         <Flex
//           alignItems="center"
//           borderBottom="1px solid"
//           borderColor="gray.200"
//           py={2}
//           my={2}
//         >
//           <Box width="100px" textAlign="Center">
//             <Text>n° cmd</Text>
//           </Box>
//           <Box width="100px" textAlign="Center">
//             <Text>status</Text>
//           </Box>
//         </Flex>
//         {ConfirmedOrders.length > 0 ? (
//           ConfirmedOrders.map(({ order_id, status }) => {
//             return (
//               <Flex
//                 alignItems="center"
//                 borderBottom="1px solid"
//                 borderColor="gray.200"
//                 py={2}
//                 my={2}
//                 key={order_id}
//               >
//                 <Box width="100px" textAlign="Center">
//                   <NavLink to={order_id}>
//                     <Text fontSize={24} margin={4}>
//                       {order_id.toUpperCase()}
//                     </Text>
//                   </NavLink>
//                 </Box>
//                 <Box width="100px" textAlign="Center">
//                   <Text>{status}</Text>
//                 </Box>
//               </Flex>
//             );
//           })
//         ) : (
//           <div>No orders found</div>
//         )}
//       </BaseLayout>
//     </>
//   );
// };

// export default AdminOrdersListPage;
