import { View, Text, StyleSheet, Image, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/core";
import { CreateNavigationProp, CreateRouteProp } from "../../types/navigation";
import Colors from "../../theme/colors";
import Button from "../../components/Button";
import { useMutation } from "@apollo/client";
import {
  CreatePostInput,
  CreatePostMutation,
  CreatePostMutationVariables,
} from "../../API";
import { createPost } from "./queries";
import { useAuthContext } from "../../contexts/AuthContext";
import Carousel from "../../components/Carousel/Carousel";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import { Storage } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CreatePostScreen = () => {
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { userId } = useAuthContext();

  const navigation = useNavigation<CreateNavigationProp>();
  const route = useRoute<CreateRouteProp>();
  const { image, images, video } = route.params;

  const [runCreatePost] = useMutation<
    CreatePostMutation,
    CreatePostMutationVariables
  >(createPost);

  let content: JSX.Element | null = null;

  if (image) {
    content = <Image source={{ uri: image }} style={styles.image} />;
  } else if (images && images.length > 0) {
    content = <Carousel images={images} />;
  } else if (video) {
    content = <VideoPlayer uri={video} paused={false} />;
  }

  const submit = async () => {
    if (isSubmitting) {
      return;
    }
    if (!image && !images && !video) {
      Alert.alert("Please select a media to upload");
      return;
    }
    setIsSubmitting(true);
    const input: CreatePostInput = {
      type: "POST",
      description,
      image: undefined,
      images: undefined,
      video: undefined,
      nofComments: 0,
      nofLikes: 0,
      userID: userId,
    };
    // upload media to s3
    if (image) {
      input.image = await uploadMedia(image);
    } else if (images) {
      const imageKeys = await Promise.all(
        images.map((img) => uploadMedia(img))
      );
      input.images = imageKeys.filter((key) => key) as string[];
    } else if (video) { 
      input.video = await uploadMedia(video);
    }
    try {
      await runCreatePost({ variables: { input } });
      setIsSubmitting(false);
      navigation.popToTop();
      navigation.navigate("HomeStack");
    } catch (error) {
      Alert.alert("Error uploading the post", (error as Error).message);
      setIsSubmitting(false);
    }
  };

  const uploadMedia = async (uri: string) => {
    try {
      //get the blob of the file from uri
      const response = await fetch(uri);
      const blob = await response.blob();
      const uriParts = uri.split(".");
      const extention = uriParts[uriParts.length - 1];

      // upload the file (blob) to s3
      const s3Response = await Storage.put(`${uuidv4()}.${extention}`, blob,{
        progressCallback(newProgress) {
          setProgress(newProgress.loaded / newProgress.total);
        },
      });
      return s3Response.key;
    } catch (error) {
      Alert.alert("Error uploading the post", (error as Error).message);
    }
  };
  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.root}>
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
      <View style={{ flexDirection: "row" }}>
        <Button
          text={isSubmitting ? "Submitting" : "Submit"}
          onPress={submit}
        />
      </View>
      {isSubmitting && (
        <View style={styles.progressContainer}>
          <View style={[styles.progress, {width: `${progress * 100}%`}]} />
          <Text>Uploading {Math.floor(progress * 100)}%</Text>
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.black,
  },
  image: {
    flex: 1,
  },
  input: {
    marginVertical: 10,
    alignSelf: "stretch",
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 5,
  },
  content: {
    width: "100%",
    aspectRatio: 1,
  },
    progressContainer: {
    backgroundColor: Colors.lightgrey,
    width: '100%',
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginVertical: 10,
  },
  progress: {
    backgroundColor: Colors.primary,
    position: 'absolute',
    height: '100%',
    alignSelf: 'flex-start',
    borderRadius: 25,
  },
});
export default CreatePostScreen;
