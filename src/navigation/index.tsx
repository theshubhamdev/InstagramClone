import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import CommentsScreen from '../screens/CommentsScreen';
import {RootNavigatorParamList} from '../types/navigation';
import {ActivityIndicator, Text, View} from 'react-native';
import AuthStackNavigator from './AuthStackNavigator';
import {useAuthContext} from '../contexts/AuthContext';
import colors from '../theme/colors';

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
  const {user} = useAuthContext();
  if (user === undefined) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        ) : (
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
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
