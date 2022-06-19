import {View, Text, Image} from 'react-native';
import user from '../../assets/data/user.json';
import Button from '../../components/Button';
import {styles} from './styles';

const ProfileHeader = () => {
  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <Image source={{uri: user.image}} style={styles.avatar} />
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>100</Text>
          <Text>Posts</Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>10.1K</Text>
          <Text>Followers</Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>69</Text>
          <Text>Following</Text>
        </View>
      </View>
      <Text style={styles.name}>{user.name}</Text>
      <Text>{user.bio}</Text>
      <View style={{flexDirection: 'row'}}>
        <Button
          text="Edit Profile"
          onPress={() => console.warn('Edit Profile Pressed')}
        />
        <Button
          text="Another Button"
          onPress={() => console.warn('Another Button Pressed')}
        />
      </View>
    </View>
  );
};

export default ProfileHeader;