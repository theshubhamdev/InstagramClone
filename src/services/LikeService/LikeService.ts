import { useMutation, useQuery } from "@apollo/client";
import {
  CreateLikeMutation,
  CreateLikeMutationVariables,
  DeleteLikeMutation,
  DeleteLikeMutationVariables,
  LikesForPostByUserQuery,
  LikesForPostByUserQueryVariables,
  Post,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from "../../API";
import { useAuthContext } from "../../contexts/AuthContext";
import {
  createLike,
  deleteLike,
  likesForPostByUser,
  updatePost,
} from "./queries";

const useLikeService = (post: Post) => {
  const { userId } = useAuthContext();

  const { data: usersLikeData } = useQuery<
    LikesForPostByUserQuery,
    LikesForPostByUserQueryVariables
  >(likesForPostByUser, {
    variables: { postID: post.id, userID: { eq: userId } },
  });

  const userLike = (usersLikeData?.likesForPostByUser?.items || []).filter(
    (like) => !like?._deleted
  )?.[0];

  const incrementNofLikes = async (amount: 1 | -1) => {
    const [runUpdatePost] = useMutation<
      UpdatePostMutation,
      UpdatePostMutationVariables
    >(updatePost);

    await runUpdatePost({
      variables: {
        input: {
          id: post.id,
          nofLikes: post.nofLikes + amount,
          _version: post._version,
        },
      },
    });
  };

  const [runCreateLike] = useMutation<
    CreateLikeMutation,
    CreateLikeMutationVariables
  >(createLike, {
    variables: { input: { userID: userId, postID: post.id } },
    refetchQueries: ["LikesForPostByUser"],
  });

  const [runDeleteLike] = useMutation<
    DeleteLikeMutation,
    DeleteLikeMutationVariables
  >(deleteLike);

  const doAddLike = async () => {
    await runCreateLike();
    await incrementNofLikes(1);
  };

  const doDeleteLike = async () => {
    if (userLike) {
      await runDeleteLike({
        variables: { input: { id: userLike.id, _version: userLike._version } },
      });
      await incrementNofLikes(-1);
    }
  };

  const toggleLike = () => {
    if (userLike) {
      // delete the user like
      doDeleteLike();
    } else {
      doAddLike();
    }
  };
  return {
    isLiked: !!userLike,
    toggleLike,
  };
};

export default useLikeService;
