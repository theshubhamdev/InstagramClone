import {useNavigation} from '@react-navigation/native';
import {Auth} from 'aws-amplify';
import React from 'react';
import {View, Text, Image} from 'react-native';
import {User} from '../../API';
import Button from '../../components/Button';
import {DEFAULT_USER_IMAGE} from '../../config';
import {useAuthContext} from '../../contexts/AuthContext';
import {ProfileNavigationProp} from '../../types/navigation';
import {styles} from './styles';

interface IProfileHeader {
  user: User;
}
const ProfileHeader = ({user}: IProfileHeader) => {
  const {userId} = useAuthContext();
  const navigation = useNavigation<ProfileNavigationProp>();
  navigation.setOptions({title: user.username || "Profile"})
  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <Image
          source={{uri: user.image || DEFAULT_USER_IMAGE}}
          style={styles.avatar}
        />
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{user.nofPosts}</Text>
          <Text style={styles.textColor}>Posts</Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{user.nofFollowers}</Text>
          <Text style={styles.textColor}>Followers</Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{user.nofFollowings}</Text>
          <Text style={styles.textColor}>Following</Text>
        </View>
      </View>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.bio}>{user.bio}</Text>

      {userId === user.id && (
        <View style={{flexDirection: 'row'}}>
          <Button
            text="Edit Profile"
            onPress={() => navigation.navigate('Edit Profile')}
          />
          <Button text="Sign Out" onPress={() => Auth.signOut()} />
        </View>
      )}
    </View>
  );
};

export default ProfileHeader;
