import {
  View,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/core";
import {
  CreateNavigationProp,
  UpdatePostRouteProp,
} from "../../types/navigation";
import Colors from "../../theme/colors";
import Button from "../../components/Button";
import { useMutation, useQuery } from "@apollo/client";
import {
  GetPostQuery,
  GetPostQueryVariables,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from "../../API";
import { getPost, updatePost } from "./queries";
import { useAuthContext } from "../../contexts/AuthContext";
import ApiErrorMessage from "../../components/ApiErrorMessage";

const UpdatePostScreen = () => {
  const [description, setDescription] = useState("");
  const { userId } = useAuthContext();

  const navigation = useNavigation<CreateNavigationProp>();
  const route = useRoute<UpdatePostRouteProp>();
  const { id } = route.params;

  const { data, loading, error } = useQuery<
    GetPostQuery,
    GetPostQueryVariables
  >(getPost, { variables: { id } });

  const post = data?.getPost;

  useEffect(() => {
    if (post) {
      setDescription(post.description || "");
    }
  }, [post]);

  const [runUpdatePost, { error: updateError }] = useMutation<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >(updatePost);

  const submit = async () => {
    if (!post) return;
    try {
      const response = await runUpdatePost({
        variables: { input: { id: post?.id, description,_version: post._version } },
      });
      if (response.data?.updatePost) {
        navigation.popToTop();
        navigation.navigate("Home");
      } else {
        Alert.alert("Error updating the post.", (updateError as Error).message);
      }
    } catch (error) {
      Alert.alert("Error updating the post", (error as Error).message);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    <ApiErrorMessage
      title="Failed to fetch the post"
      message={error.message}
    />;
  }

  return (
    <View style={styles.root}>
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
        <Button text="Submit" onPress={submit} />
      </View>
    </View>
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
});
export default UpdatePostScreen;
