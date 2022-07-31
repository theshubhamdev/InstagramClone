import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import colors from '../theme/colors';
import {HomeStackNavigatorParamList} from '../types/navigation';

const Stack = createNativeStackNavigator<HomeStackNavigatorParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Feed" component={HomeScreen} />
      <Stack.Screen
        name="UserProfile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          title: 'Profile',
          headerStyle: { backgroundColor: colors.black },
          headerTitleStyle: {color: colors.white}
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
