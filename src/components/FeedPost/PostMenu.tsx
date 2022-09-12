import { Text, StyleSheet, Alert } from "react-native";
import React from "react";
import { useMutation } from "@apollo/client";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import Entypo from "react-native-vector-icons/Entypo";
import colors from "../../theme/colors";
import { deletePost } from "./queries";
import {
  DeletePostMutation,
  DeletePostMutationVariables,
  Post,
} from "../../API";
import { useAuthContext } from "../../contexts/AuthContext"
import { useNavigation } from "@react-navigation/core";
import { FeedNavigationProp } from "../../types/navigation";

interface IPostMenu {
  post: Post;
}

const PostMenu = ({ post }: IPostMenu) => {
  const { userId } = useAuthContext();
  const navigation = useNavigation<FeedNavigationProp>();

  const isMyPost = userId === post.userID;
  const [runDeletePost] = useMutation<
    DeletePostMutation,
    DeletePostMutationVariables
  >(deletePost, {
    variables: {
      input: {
        id: post.id,
        _version: post._version,
      },
    },
  });

  const DeletePost = async () => {
    const response = await runDeletePost();
  };

  const onDeleteOptionPressed = () => {
    Alert.alert("Are you sure?", "Deleting a post is permanent", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete Post",
        style: "destructive",
        onPress: DeletePost,
      },
    ]);
  };
  const onEditOptionPressed = () => {
    navigation.navigate("UpdatePost", {id: post.id});
  };
  return (
    <Menu style={styles.threeDots} renderer={renderers.SlideInMenu}>
      <MenuTrigger>
        <Entypo name="dots-three-horizontal" style={styles.white} />
      </MenuTrigger>
      <MenuOptions>
        <MenuOption onSelect={() => Alert.alert("Reporting")}>
          <Text style={[styles.optionText]}>Report</Text>
        </MenuOption>
        {isMyPost &&
          <>
            <MenuOption onSelect={onDeleteOptionPressed}>
              <Text style={[styles.optionText, { color: "red" }]}>Delete</Text>
            </MenuOption>
          
            <MenuOption onSelect={onEditOptionPressed}>
              <Text style={[styles.optionText]}>Edit</Text>
            </MenuOption>
          </>
        }
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  threeDots: {
    marginLeft: "auto",
    backgroundColor: colors.black,
  },
  white: {
    color: colors.white,
  },
  optionText: {
    textAlign: "center",
    fontSize: 20,
    padding: 10,
  },
});

export default PostMenu;
