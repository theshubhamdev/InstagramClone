import { useMutation, useQuery } from "@apollo/client";
import { Alert } from "react-native";
import {
  CreateCommentMutation,
  CreateCommentMutationVariables,
  DeleteCommentMutation,
  DeleteCommentMutationVariables,
  GetPostQuery,
  GetPostQueryVariables,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from "../../API";
import { useAuthContext } from "../../contexts/AuthContext";
import { createComment, getPost, updatePost } from "./queries";

const useCommentsService = (postId: string) => {
  const { userId } = useAuthContext();

  const [runDeleteComment] = useMutation<
    DeleteCommentMutation,
    DeleteCommentMutationVariables
  >(createComment);

  const [runCreateComment] = useMutation<
    CreateCommentMutation,
    CreateCommentMutationVariables
  >(createComment);

  const [runUpdatePost] = useMutation<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >(updatePost);

  const { data: postData } = useQuery<GetPostQuery, GetPostQueryVariables>(
    getPost,
    { variables: { id: postId } }
  );

  const post = postData?.getPost;
  const incrementNofComments = async (amount: 1 | -1) => {
    if (!post) {
      Alert.alert("Error fetching post details");
      return;
    } else {
      await runUpdatePost({
        variables: {
          input: {
            id: postId,
            nofComments: post.nofComments + amount,
            _version: post._version,
          },
        },
      });
    }
  };

  const onCreateComment = async (comment: string) => {
    if (!post) {
      Alert.alert("Error fetching post details");
      return;
    }
    try {
      await runCreateComment({
        variables: {
          input: {
            postID: postId,
            userID: userId,
            comment: comment,
          },
        },
        refetchQueries: ["CommentsByPost"],
      });
      incrementNofComments(1);
    } catch (error) {
      Alert.alert("Error Submitting the comment", (error as Error).message);
    }
  };

  const onDeleteComment = async (comment: string) => {};

  return {
    onCreateComment,
    incrementNofComments,
  };
};

export default useCommentsService;
