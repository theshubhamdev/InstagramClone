import {
  ActivityIndicator,
  FlatList,
  ViewabilityConfig,
  ViewToken,
} from "react-native";
import FeedPost from "../../components/FeedPost";
import { useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  ModelSortDirection,
  PostsByDateQuery,
  PostsByDateQueryVariables,
} from "../../API";
import { postsByDate } from "./queries";
import ApiErrorMessage from "../../components/ApiErrorMessage";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../theme/colors";

const HomeScreen = () => {
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const { data, loading, error, refetch, fetchMore } = useQuery<
    PostsByDateQuery,
    PostsByDateQueryVariables
  >(postsByDate, {
    variables: {
      type: "POST",
      sortDirection: ModelSortDirection.DESC,
      limit: 10,
    },
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

  const nextToken = data?.postsByDate?.nextToken;

  const loadMore = async () => {
    if (!nextToken || isFetchingMore) {
      return;
    }
    setIsFetchingMore(true);
    fetchMore({ variables: { nextToken } });
    setIsFetchingMore(false);
  };

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
      onEndReached={() => loadMore()}
      style={{ backgroundColor: colors.black }}
    />
  );
};

export default HomeScreen;
