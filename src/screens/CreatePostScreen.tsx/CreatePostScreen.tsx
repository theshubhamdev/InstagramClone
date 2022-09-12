import {View, Text, StyleSheet, Image, TextInput, Alert} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/core';
import {CreateNavigationProp, CreateRouteProp} from '../../types/navigation';
import Colors from '../../theme/colors';
import Button from '../../components/Button';
import {useMutation} from '@apollo/client';
import {CreatePostMutation, CreatePostMutationVariables} from '../../API';
import {createPost} from './queries';
import {useAuthContext} from '../../contexts/AuthContext';
import Carousel from '../../components/Carousel/Carousel';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';

const CreatePostScreen = () => {
  const [description, setDescription] = useState('');
  const {userId} = useAuthContext();

  const navigation = useNavigation<CreateNavigationProp>();
  const route = useRoute<CreateRouteProp>();
  const {image, images, video} = route.params;

  const [runCreatePost] = useMutation<
    CreatePostMutation,
    CreatePostMutationVariables
  >(createPost);

  let content: JSX.Element | null = null;

  if (image) {
    content = <Image source={{uri: image}} style={styles.image} />;
  } else if (images && images.length > 0) {
    content = <Carousel images={images} />;
  } else if (video) {
    content = <VideoPlayer uri={video} paused={false} />;
  }

  const submit = async () => {
    try {
      const response = await runCreatePost({
        variables: {
          input: {
            description,
            image: image,
            images: images,
            video: video,
            nofComments: 0,
            nofLikes: 0,
            userID: userId,
          },
        },
      });
      navigation.popToTop();
      navigation.navigate('HomeStack');
      console.log(response);
    } catch (error) {
      Alert.alert('Error uploading the post', (error as Error).message);
    }
  };
  return (
    <View style={styles.root}>
      <View style={styles.content}>{content}</View>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description..."
        style={styles.input}
        placeholderTextColor={Colors.lightgrey}
        multiline
        numberOfLines={5}
      />
      <View style={{flexDirection: 'row'}}>
        <Button text="Submit" onPress={submit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  image: {
    flex: 1,
  },
  input: {
    marginVertical: 10,
    alignSelf: 'stretch',
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 5,
  },
  content: {
    width: '100%',
    aspectRatio: 1,
  },
});
export default CreatePostScreen;
