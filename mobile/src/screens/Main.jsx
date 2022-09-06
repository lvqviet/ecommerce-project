import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet } from "react-native";
import Color from "../constants/Color";
import Home from "./Home";
import Profile from "./Profile";

const Tab = createBottomTabNavigator();

const Main = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Home'
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: {
            fontSize: 15,
            fontFamily: "Poppins_500Medium",
          },
          headerShown: false,
          tabBarIcon: () => <MaterialCommunityIcons name='home' size={25} />,
          tabBarActiveTintColor: Color.purple717fe0,
          tabBarInactiveTintColor: Color.grey999999,
        }}
      />
      <Tab.Screen
        name='Profile'
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarLabelStyle: { fontSize: 15, fontFamily: "Poppins_500Medium" },
          headerShown: false,
          tabBarIcon: () => <MaterialCommunityIcons name='account' size={25} />,
          tabBarActiveTintColor: Color.purple717fe0,
          tabBarInactiveTintColor: Color.grey999999,
        }}
      />
    </Tab.Navigator>
  );
};

export default Main;

const styles = StyleSheet.create({});
