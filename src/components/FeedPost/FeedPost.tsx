import {useState} from 'react';
import {View, Text, Image, StyleSheet, Pressable} from 'react-native';
import colors from '../../theme/colors';
import font from '../../theme/fonts';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DoublePressable from '../DoublePressable/DoublePressable';

import styles from './styles';
import Comment from '../Comment';
import Carousel from '../Carousel/Carousel';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import {useNavigation} from '@react-navigation/native';
import {FeedNavigationProp} from '../../types/navigation';
import {DEFAULT_USER_IMAGE} from '../../config';
import {Post} from '../../API';

interface IFeedPost {
  post: Post;
  isVisible: boolean;
}

const FeedPost = ({post, isVisible}: IFeedPost) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(true);

  const navigation = useNavigation<FeedNavigationProp>();

  const navigateToUser = () => {
    navigation.navigate('UserProfile', {userId: post.User?.id || ''});
  };
  const navigateToComments = () => {
    navigation.navigate('Comments', {postId: post.id});
  };
  const toggleDescriptionExpanded = () => {
    setIsDescriptionExpanded(v => !v);
  };
  const toggleLike = () => {
    setIsLiked(v => !v);
  };

  let content = null;
  console.log(post);

  if (post.image) {
    content = (
      <DoublePressable onDoublePress={toggleLike}>
        <Image source={{uri: post.image}} style={styles.image} />
      </DoublePressable>
    );
  } else if (post.images && post.images.length > 0) {
    content = <Carousel images={post.images} onDoublePress={toggleLike} />;
  } else if (post.video) {
    content = (
      <DoublePressable onDoublePress={toggleLike}>
        <VideoPlayer uri={post.video} paused={!isVisible} />
      </DoublePressable>
    );
  }

  return (
    <View style={styles.post}>
      <View style={styles.header}>
        <Image
          source={{uri: post.User?.image || DEFAULT_USER_IMAGE}}
          style={styles.userAvatar}
        />
        <Text onPress={navigateToUser} style={styles.username}>
          {post.User?.username}
        </Text>
        <Entypo name="dots-three-horizontal" style={styles.threeDots} />
      </View>
      {content}
      <View style={styles.footer}>
        <View style={styles.iconContainer}>
          <Pressable onPress={toggleLike}>
            <AntDesign
              name={isLiked ? 'heart' : 'hearto'}
              size={24}
              style={styles.icon}
              color={isLiked ? colors.accent : colors.white}
            />
          </Pressable>

          <Ionicons
            name="chatbubble-outline"
            size={24}
            style={styles.icon}
            color={colors.white}
          />
          <Feather
            name="send"
            size={24}
            style={styles.icon}
            color={colors.white}
          />
          <Feather
            name="bookmark"
            size={24}
            style={{marginLeft: 'auto'}}
            color={colors.white}
          />
        </View>

        {/* Likes */}
        <Text>
          Liked by <Text style={styles.bold}>raghuvansiayush</Text> and{' '}
          <Text style={{fontWeight: font.weight.bold}}>
            {post.nofLikes} others
          </Text>
        </Text>

        {/* Post Description */}
        <Text style={styles.text} numberOfLines={isDescriptionExpanded ? 0 : 3}>
          <Text style={styles.bold}>{post.User?.username}</Text>{' '}
          {post.description}
        </Text>
        <Text onPress={toggleDescriptionExpanded} style={{color: colors.grey}}>
          {isDescriptionExpanded ? 'see less' : 'see more'}
        </Text>
        {/* Comments */}
        <Text style={{color: colors.grey}} onPress={navigateToComments}>
          View all {post.nofComments} comments
        </Text>
        {(post.Comments?.items || []).map(
          comment =>
            comment && (
              <Comment
                key={comment.id}
                comment={comment}
                includeDetails={false}
              />
            ),
        )}
        {/* Posted Date */}
        <Text style={{color: colors.grey}}>{post.createdAt}</Text>
      </View>
    </View>
  );
};

export default FeedPost;
