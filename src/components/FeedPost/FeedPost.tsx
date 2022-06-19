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
import {IPost} from '../../types/models';
import Carousel from '../Carousel/Carousel';
import VideoPlayer from '../VideoPlayer/VideoPlayer';

interface IFeedPost {
  post: IPost;
  isVisible: boolean;
}

const FeedPost = ({post,isVisible}: IFeedPost) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(true);

  const toggleDescriptionExpanded = () => {
    setIsDescriptionExpanded(v => !v);
  };
  const toggleLike = () => {
    setIsLiked(v => !v);
  };

  let content = null;

  if (post.image) {
    content = (
      <DoublePressable onDoublePress={toggleLike}>
        <Image source={{uri: post.image}} style={styles.image} />
      </DoublePressable>
    );
  } else if (post.images) {
    content = (<Carousel images={post.images} onDoublePress={toggleLike} />);
  }
  else if (post.video) {
    content = (
      <DoublePressable onDoublePress={toggleLike}>
        <VideoPlayer uri={post.video} paused={!isVisible} />
      </DoublePressable>)
  }

  return (
    <View style={styles.post}>
      <View style={styles.header}>
        <Image source={{uri: post.user.image}} style={styles.userAvatar} />
        <Text style={styles.username}>{post.user.username}</Text>
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
              color={isLiked ? colors.accent : colors.black}
            />
          </Pressable>

          <Ionicons
            name="chatbubble-outline"
            size={24}
            style={styles.icon}
            color={colors.black}
          />
          <Feather
            name="send"
            size={24}
            style={styles.icon}
            color={colors.black}
          />
          <Feather
            name="bookmark"
            size={24}
            style={{marginLeft: 'auto'}}
            color={colors.black}
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
          <Text style={styles.bold}>{post.user.username}</Text>{' '}
          {post.description}
        </Text>
        <Text onPress={toggleDescriptionExpanded} style={{color: colors.grey}}>
          {isDescriptionExpanded ? 'see less' : 'see more'}
        </Text>
        {/* Comments */}
        <Text style={{color: colors.grey}}>
          View all {post.nofComments} comments
        </Text>
        {post.comments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
        {/* Posted Date */}
        <Text style={{color: colors.grey}}>{post.createdAt}</Text>
      </View>
    </View>
  );
};

export default FeedPost;
