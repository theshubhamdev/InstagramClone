import { View, Text, Image, TextInput, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import colors from "../../theme/colors";
import fonts from "../../theme/fonts";
import { useMutation } from "@apollo/client";
import {
  CreateCommentMutation,
  CreateCommentMutationVariables,
} from "../../API";
import { useAuthContext } from "../../contexts/AuthContext";
import useCommentsService from "../../services/CommentsService";

interface IInput {
  postId: string;
}

const Input = ({ postId }: IInput) => {
  const [newComment, setNewComment] = useState("");

  const { onCreateComment } = useCommentsService(postId);
  const onPost = async () => {
    onCreateComment(newComment);
    setNewComment('');
  }
  return (
    <View style={styles.root}>
      <Image
        source={{
          uri:
            "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/1.jpg",
        }}
        style={styles.image}
      />
      <TextInput
        value={newComment}
        onChangeText={setNewComment}
        placeholder="Write Your Comment"
        style={styles.input}
        multiline
      />
      <Text onPress={onPost} style={styles.button}>
        POST
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: colors.border,
    alignItems: "flex-end",
  },
  image: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 20,
  },
  input: {
    flex: 1,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 5,
    paddingRight: 50,
    height: 40,
    color: colors.white,
  },
  button: {
    position: "absolute",
    right: 25,
    top: 22,
    fontSize: fonts.size.s,
    fontWeight: fonts.weight.full,
    color: colors.primary,
  },
});

export default Input;
