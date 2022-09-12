import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/core";
import { PostLikesRoute } from "../../types/navigation";
import { useQuery } from "@apollo/client";
import { likesForPostByUser } from "./queries";
import {
  LikesForPostByUserQuery,
  LikesForPostByUserQueryVariables,
} from "../../API";
import ApiErrorMessage from "../../components/ApiErrorMessage";
import UserListItem from "../../components/UserListItem/UserListItem";
import colors from "../../theme/colors";

const PostLikesScreen = () => {
  const route = useRoute<PostLikesRoute>();
  const { id } = route.params;

  const { data, loading, error, refetch } = useQuery<
    LikesForPostByUserQuery,
    LikesForPostByUserQueryVariables
      >(likesForPostByUser, { variables: { postID: id } });
    
  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <ApiErrorMessage
        title="Error Fetching Likes"
        message={error?.message || 'No posts available'}
        onRetry={() => refetch()}
      />
    );
  }
  const likes = (data?.likesForPostByUser?.items || []).filter(like => !like?._deleted) || [];
    
  return (
      <FlatList
          data={likes}
          renderItem={({ item }) => <UserListItem user={item?.User} />}
          style={styles.root}
          refreshing={loading}
      />
  );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.black
  },
});
export default PostLikesScreen;
