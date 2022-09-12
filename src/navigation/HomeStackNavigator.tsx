import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import colors from "../theme/colors";
import { HomeStackNavigatorParamList } from "../types/navigation";
import { UpdatePostScreen } from "../screens/UpdatePostScreen";
import PostLikesScreen from "../screens/PostLikesScreen";

const Stack = createNativeStackNavigator<HomeStackNavigatorParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feed"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="UserProfile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          title: "Profile",
          headerStyle: { backgroundColor: colors.black },
          headerTitleStyle: { color: colors.white },
        }}
      />
      <Stack.Screen
        name="UpdatePost"
        component={UpdatePostScreen}
        options={{ title: "Update Post" }}
      />
      <Stack.Screen
        name="PostLikes"
        component={PostLikesScreen}
        options={{ title: "Post Likes" }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
