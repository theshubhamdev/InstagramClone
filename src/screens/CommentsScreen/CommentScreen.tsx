import { FlatList, SafeAreaView, ActivityIndicator, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import React from "react";
import Comment from "../../components/Comment";
import Input from "./Input";
import colors from "../../theme/colors";
import { CommentsRouteProp } from "../../types/navigation";
import { useQuery } from "@apollo/client";
import { commentsByPost } from "./queries";
import {
  CommentsByPostQuery,
  CommentsByPostQueryVariables,
  ModelSortDirection,
} from "../../API";
import ApiErrorMessage from "../../components/ApiErrorMessage";

const CommentScreen = () => {
  const route = useRoute<CommentsRouteProp>();

  const { postId } = route.params;

  const { data, loading, error, refetch } = useQuery<
    CommentsByPostQuery,
    CommentsByPostQueryVariables
  >(commentsByPost, {
    variables: { postID: postId, sortDirection: ModelSortDirection.DESC },
  });

  if (loading) {
    return <ActivityIndicator />;
  }
  const comments = (data?.commentsByPost?.items || []).filter(
    (comment) => !comment?._deleted
  );

  if (error || !comments) {
    return (
      <ApiErrorMessage
        title="Error Fetching Comments"
        message={error?.message || "No Comments available"}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.black }}>
      <FlatList
        data={comments}
        renderItem={({ item }) => <Comment comment={item} includeDetails />}
        style={{ padding: 10 }}
        inverted
        ListEmptyComponent={()=> <Text>Be the first one to comment</Text>}
      />
      <Input postId={postId} />
    </SafeAreaView>
  );
};

export default CommentScreen;
