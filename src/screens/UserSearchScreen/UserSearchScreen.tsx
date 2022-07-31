import {ActivityIndicator, FlatList} from 'react-native';
import React from 'react';
import UserListItem from '../../components/UserListItem';
import {useQuery} from '@apollo/client';
import {listUsers} from './queries';
import {ListLikesQueryVariables, ListUsersQuery} from '../../API';
import ApiErrorMessage from '../../components/ApiErrorMessage';

const UserSearchScreen = () => {
  const {data, loading, error, refetch} = useQuery<
    ListUsersQuery,
    ListLikesQueryVariables
  >(listUsers);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <ApiErrorMessage
        title="Error Fetching Users"
        message={error.message}
        onRetry={refetch}
      />
    );
  }

  const users = (data?.listUsers?.items || []).filter(
    user => user && !user._deleted,
  );

  return (
    <FlatList
      data={users}
      renderItem={({item}) => item && <UserListItem user={item} />}
      onRefresh={refetch}
      refreshing={loading}
      style={{flex: 1}}
    />
  );
};

export default UserSearchScreen;
