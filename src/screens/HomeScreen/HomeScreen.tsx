import {
  ActivityIndicator,
  FlatList,
  ViewabilityConfig,
  ViewToken,
} from "react-native";
import FeedPost from "../../components/FeedPost";
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@apollo/client";
import {
  ListCommentsQueryVariables,
  ListPostsQuery,
  ModelSortDirection,
  PostsByDateQuery,
  PostsByDateQueryVariables,
} from "../../API";
import { postsByDate } from "./queries";
import ApiErrorMessage from "../../components/ApiErrorMessage";
import React from "react";

const HomeScreen = () => {
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const { data, loading, error, refetch } = useQuery<
    PostsByDateQuery,
    PostsByDateQueryVariables
  >(postsByDate, {
    variables: { type: "POST", sortDirection: ModelSortDirection.DESC },
  });

  const viewabilityConfig: ViewabilityConfig = {
    itemVisiblePercentThreshold: 51,
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length > 0) {
        setActivePostId(viewableItems[0].item.id);
      }
    }
  );
  if (loading) {
    return <ActivityIndicator />;
  }
  const posts = (data?.postsByDate?.items || []).filter(
    (post) => !post?._deleted
  );

  if (error || !posts) {
    return (
      <ApiErrorMessage
        title="Error Fetching Posts"
        message={error?.message || "No posts available"}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <FeedPost post={item} isVisible={activePostId === item.id} />
      )}
      showsVerticalScrollIndicator={false}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged.current}
      refreshing={loading}
      onRefresh={refetch}
    />
  );
};

export default HomeScreen;
