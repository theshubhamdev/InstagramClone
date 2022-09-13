import { FlatList, SafeAreaView, ActivityIndicator, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Comment from "../../components/Comment";
import Input from "./Input";
import colors from "../../theme/colors";
import { CommentsRouteProp } from "../../types/navigation";
import { useQuery, useSubscription } from "@apollo/client";
import {
  commentsByPost,
  onCreateCommentsByPostId,
} from "./queries";
import {
  CommentsByPostQuery,
  CommentsByPostQueryVariables,
  ModelSortDirection,
  OnCreateCommentsByPostIdSubscription,
  OnCreateCommentsByPostIdSubscriptionVariables,
  Comment as CommentType
} from "../../API";
import ApiErrorMessage from "../../components/ApiErrorMessage";

const CommentScreen = () => {
  const route = useRoute<CommentsRouteProp>();
  const [newComments, setNewComments] = useState<CommentType[]>([]);

  const { postId } = route.params;

  const { data, loading, error, refetch, fetchMore } = useQuery<
    CommentsByPostQuery,
    CommentsByPostQueryVariables
  >(commentsByPost, {
    variables: {
      postID: postId,
      sortDirection: ModelSortDirection.DESC,
      limit: 20,
    },
  });

  const {
    data: newCommentsData,
    loading: newCommentsLoading,
    error: newCommentsError,
  } = useSubscription<
    OnCreateCommentsByPostIdSubscription,
    OnCreateCommentsByPostIdSubscriptionVariables
  >(onCreateCommentsByPostId,{variables: {postID: postId}});

  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const nextToken = data?.commentsByPost?.nextToken;
  console.log("newCommentsData", newCommentsData);
  
    useEffect(() => {
    if (newCommentsData?.onCreateCommentsByPostId) {
      setNewComments(existingNewComments => [
        newCommentsData.onCreateCommentsByPostId as CommentType,
        ...existingNewComments,
      ]);
    }
    }, [newCommentsData]);
  
  const loadMore = async () => {
    if (!nextToken || isFetchingMore) {
      return;
    }
    setIsFetchingMore(true);
    fetchMore({ variables: { nextToken } });
    setIsFetchingMore(false);
  };

    const isNewComment = (comment: CommentType) => {
    return newComments.some(c => c.id === comment.id);
    };
  
  if (loading) {
    return <ActivityIndicator />;
  }
  const comments = (data?.commentsByPost?.items || []).filter(
    (comment) => !comment?._deleted
  )|| [];

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
        data={[...newComments,...comments]}
        renderItem={({ item }) => <Comment comment={item} includeDetails isNew={isNewComment(item)}/>}
        style={{ padding: 10 }}
        inverted
        ListEmptyComponent={() => <Text>Be the first one to comment</Text>}
        onEndReached={() => loadMore()}
      />
      <Input postId={postId} />
    </SafeAreaView>
  );
};

export default CommentScreen;
