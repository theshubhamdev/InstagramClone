import React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UserSearchScreen from '../screens/UserSearchScreen';
import colors from '../theme/colors';
import { SearchTabNavigatorParamList } from '../types/navigation';
import HomeScreen from "../screens/HomeScreen";

const Tab = createMaterialTopTabNavigator<SearchTabNavigatorParamList>();

const SearchTabNavigator = () => {
    return (
      <Tab.Navigator screenOptions={{
        tabBarStyle: { backgroundColor: colors.black },
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.border,
        tabBarIndicatorStyle: { backgroundColor: colors.primary }
    }}>
      <Tab.Screen name="Users" component={UserSearchScreen} />
      <Tab.Screen name="Posts" component={HomeScreen} />
    </Tab.Navigator>
  );
};

export default SearchTabNavigator;
