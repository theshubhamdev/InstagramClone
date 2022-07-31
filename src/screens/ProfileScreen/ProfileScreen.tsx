import {useNavigation, useRoute} from '@react-navigation/native';

import FeedGridView from '../../components/FeedGridView';
import ProfileHeader from './ProfileHeader';
import {
  UserProfileNavigationProp,
  UserProfileRouteProp,
  MyProfileNavigationProp,
  MyProfileRouteProp,
} from '../../types/navigation';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useQuery} from '@apollo/client';
import {getUser} from './queries';
import {ActivityIndicator} from 'react-native';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import {GetUserQuery, GetUserQueryVariables} from '../../API';
import { useAuthContext } from '../../contexts/AuthContext';
import colors from '../../theme/colors';

const ProfileScreen = () => {
  const route = useRoute<UserProfileRouteProp | MyProfileRouteProp>();
  const navigation = useNavigation<
    UserProfileNavigationProp | MyProfileNavigationProp
    >();
  
  const { userId: authUserId } = useAuthContext();
  const userId = route.params?.userId || authUserId;

  const {data, loading, error, refetch} = useQuery<GetUserQuery, GetUserQueryVariables>(
    getUser,
    {variables: {id: userId}},
  );

  const user = data?.getUser;

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error || !user) {
    return (
      <ApiErrorMessage
        title="Error Fetching the user"
        message={error?.message || 'User not found'}
        onRetry={()=>refetch()}
      />
    );
  }

  return (
    <SafeAreaView style={{backgroundColor: colors.black, flex:1}}>
      <FeedGridView
        data={user.Posts?.items}
        ListHeaderComponent={() => <ProfileHeader user={user} />}
        refetch={refetch}
        loading={loading}
      />
    </SafeAreaView>
  );
};
export default ProfileScreen;
