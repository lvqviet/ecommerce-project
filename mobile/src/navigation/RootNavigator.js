// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import React from "react";
// import { Home, Login, ProductDetail, Register, Account } from "../screens";

// const ProtectedRoutes = [
//   {
//     name: "HOME",
//     component: Home,
//     headerShown: false,
//   },
//   {
//     name: "LOGIN",
//     component: Login,
//     headerShown: false,
//   },
//   {
//     name: "REGISTER",
//     component: Register,
//     headerShown: false,
//   },
//   {
//     name: "PRODUCT_DETAIL",
//     component: ProductDetail,
//     headerShown: false,
//   },
//   {
//     name: "ACCOUNT",
//     component: Account,
//     headerShown: false,
//   },
// ];

// const Stack = createNativeStackNavigator();

// export const ProtectedRoute = ({ children }) => (
//   <Stack.Navigator
//     initialRouteName='HOME'
//     screenOptions={{ gestureDirection: "horizontal" }}
//   >
//     {children}
//   </Stack.Navigator>
// );

// const MainStackNavigator = () => {
//   return (
//     <ProtectedRoute>
//       {ProtectedRoutes.map((item) => (
//         <Stack.Screen
//           initialRouteName='MAIN'
//           key={item.name}
//           name={item.name}
//           component={item.component}
//           options={{
//             title: item.title,
//             header: item.header,
//             headerShown: item.headerShown,
//           }}
//         />
//       ))}
//     </ProtectedRoute>
//   );
// };

// export { MainStackNavigator };
