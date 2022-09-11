import React from 'react';
import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import CommentsScreen from '../screens/CommentsScreen';
import {RootNavigatorParamList} from '../types/navigation';
import {ActivityIndicator, Text, View} from 'react-native';
import AuthStackNavigator from './AuthStackNavigator';
import {useAuthContext} from '../contexts/AuthContext';
import colors from '../theme/colors';
import {useQuery} from '@apollo/client';
import {GetUserQuery, GetUserQueryVariables} from '../API';
import {getUser} from './queries';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createNativeStackNavigator<RootNavigatorParamList>();

const linking: LinkingOptions<RootNavigatorParamList> = {
  prefixes: ['notjustphotos://', 'https://notjustphotos.com'],
  config: {
    initialRouteName: 'Home',
    screens: {
      Comments: 'comments',
      Home: {
        screens: {
          HomeStack: {
            initialRouteName: 'Home',
            screens: {
              UserProfile: 'user',
            },
          },
        },
      },
    },
  },
};
const Navigation = () => {
  const {user, userId} = useAuthContext();
  const {data, loading, error} = useQuery<GetUserQuery, GetUserQueryVariables>(
    getUser,
    {variables: {id: userId}},
  );

  const userData = data?.getUser;

  if (user === undefined) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  let stackScreens: JSX.Element | null = null;

  if (!user) {
    stackScreens = <Stack.Screen name="Auth" component={AuthStackNavigator} />;
  } else if (!userData?.username) {
    stackScreens = (
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{headerShown: true, title: "Setup Profile"}} />
    );
  } else {
    stackScreens = (
      <>
        <Stack.Screen name="Home" component={BottomTabNavigator} />
        <Stack.Screen
          name="Comments"
          component={CommentsScreen}
          options={{
            headerShown: true,
            headerStyle: {backgroundColor: colors.black},
            headerTitleStyle: {color: colors.white},
          }}
        />
      </>
    );
  }
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {stackScreens}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
