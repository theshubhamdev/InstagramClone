import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import UserSearchScreen from "../screens/UserSearchScreen";
import colors from "../theme/colors";
import { SearchTabNavigatorParamList } from "../types/navigation";
import HomeScreen from "../screens/HomeScreen";
import { Platform } from "react-native";

const Tab = createMaterialTopTabNavigator<SearchTabNavigatorParamList>();

const SearchTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.black,
          marginTop: Platform.OS === "ios" ? 50 : 0,
        },
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.border,
        tabBarIndicatorStyle: { backgroundColor: colors.primary },
      }}
    >
      <Tab.Screen name="Users" component={UserSearchScreen} />
      <Tab.Screen name="Posts" component={HomeScreen} />
    </Tab.Navigator>
  );
};

export default SearchTabNavigator;
