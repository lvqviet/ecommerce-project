import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";
import { setNewToken } from "./src/api/api";
import { storage } from "./src/helper";
import { actions } from "./src/redux";
import store from "./src/redux/store";
import {
  Account,
  Cart,
  ChangePassword,
  Checkout,
  Login,
  MyOrder,
  ProductDetail,
  Register,
  Search,
} from "./src/screens";
import Main from "./src/screens/Main";

const Stack = createNativeStackNavigator();

const ProtectedRoutes = [
  {
    name: "HOME",
    component: Main,
    headerShown: false,
  },
  {
    name: "LOGIN",
    component: Login,
    headerShown: false,
  },
  {
    name: "REGISTER",
    component: Register,
    headerShown: false,
  },
  {
    name: "PRODUCT_DETAIL",
    component: ProductDetail,
    headerShown: false,
  },
  {
    name: "ACCOUNT",
    component: Account,
    headerShown: false,
  },
  {
    name: "CHANGE_PASSWORD",
    component: ChangePassword,
    headerShown: false,
  },
  {
    name: "CART",
    component: Cart,
    headerShown: false,
  },
  {
    name: "CHECKOUT",
    component: Checkout,
    headerShown: false,
  },
  {
    name: "MY_ORDER",
    component: MyOrder,
    headerShown: false,
  },
  {
    name: "SEARCH",
    component: Search,
    headerShown: false,
  },
];

function App() {
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Text
          style={{
            fontSize: 30,
            letterSpacing: 1,
            color: "#444",
            fontWeight: "bold",
          }}
        >
          SHOPPING
        </Text>
      </View>
    );
  }

  const ProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
      async function getToken() {
        try {
          const token = await storage.get("token");
          if (token) {
            setNewToken(token);
            dispatch(actions.user.login({}));
          }
        } catch (error) {
          Alert.alert("An error occurred");
        }
      }

      getToken();
    }, []);

    return <Stack.Navigator>{children}</Stack.Navigator>;
  };

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <ProtectedRoute>
            {ProtectedRoutes.map((item) => (
              <Stack.Screen
                key={item.name}
                name={item.name}
                component={item.component}
                options={{
                  headerShown: item.headerShown,
                }}
              />
            ))}
          </ProtectedRoute>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
