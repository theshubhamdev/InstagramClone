import {View, Image, ActivityIndicator} from 'react-native';
import React, { useEffect, useState } from 'react';
import colors from '../../theme/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Post } from '../../API';
import { Storage } from 'aws-amplify';

const FeedGridItem = ({ post }: { post: Post }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  useEffect(() => {
    downloadMedia();
  }, []);

  const downloadMedia = async () => {
    if (post.image) {
      // download the image
      const uri = await Storage.get(post.image);
      setImageUri(uri);
    } else if (post.images) {
      const uris = await Storage.get(post.images[0]);
      setImageUri(uris);
    }
  };
  console.log(post);
  if (!imageUri) {
    return <ActivityIndicator />
  }
  return (
    <View style={{flex: 1, padding: 1, aspectRatio: 1, maxWidth: '33.33%'}}>
      <Image source={{uri: imageUri}} style={{flex: 1}} />
      {post.images && (
        <MaterialIcons
          name="collections"
          size={16}
          color={colors.white}
          style={{position: 'absolute', top: 5, right: 5}}
        />
      )}
    </View>
  );
};

export default FeedGridItem;
