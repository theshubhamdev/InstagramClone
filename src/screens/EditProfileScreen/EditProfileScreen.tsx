import {View, Text, Image, ActivityIndicator, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {launchImageLibrary, Asset} from 'react-native-image-picker';
import {
  DeleteCommentMutationVariables,
  DeleteUserMutation,
  GetUserQuery,
  GetUserQueryVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  UsersByUsernameQuery,
  UsersByUsernameQueryVariables,
  User,
} from '../../API';
import {useAuthContext} from '../../contexts/AuthContext';
import {useMutation, useQuery, useLazyQuery} from '@apollo/client';
import {deleteUser, getUser, updateUser, usersByUsername} from './queries';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import {useNavigation} from '@react-navigation/core';
import {DEFAULT_USER_IMAGE} from '../../config';
import {Auth} from 'aws-amplify';
import styles from './styles';
import CustomInput, {IEditableUser} from './CustomInput';

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const EditProfileScreen = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<null | Asset>(null);
  const {control, handleSubmit, setValue} = useForm<IEditableUser>();

  const {userId, user: authUser} = useAuthContext();
  const navigation = useNavigation();

  const {data, loading, error} = useQuery<GetUserQuery, GetUserQueryVariables>(
    getUser,
    {variables: {id: userId}},
  );

  const user = data?.getUser;

  const [getUsersByUsername] = useLazyQuery<UsersByUsernameQuery,UsersByUsernameQueryVariables>(usersByUsername)
  const [runUpdateUser, {loading: updateLoading, error: updateError}] =
    useMutation<UpdateUserMutation, UpdateUserMutationVariables>(updateUser);

  const [runDeleteUser, {loading: deleteLoading, error: deleteError}] =
    useMutation<DeleteUserMutation, DeleteCommentMutationVariables>(deleteUser);
  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('bio', user.bio);
      setValue('username', user.username);
      setValue('website', user.website);
    }
  }, [user]);

  const onSubmit = async (formData: IEditableUser) => {
    await runUpdateUser({
      variables: {input: {id: userId, ...formData, _version: user?._version}},
    });
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const confirmDelete = () => {
    Alert.alert('Are You Sure?', 'Deleting your user profile is permanent', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes, delete',
        style: 'destructive',
        onPress: startDeleting,
      },
    ]);
  };

  const startDeleting = async () => {
    if (!user) {
      return;
    }
    // delete from DB
    await runDeleteUser({
      variables: {input: {id: userId, _version: user._version}},
    });

    // delete from Cognito
    authUser?.deleteUser(err => {
      if (err) {
        console.log(err);
      }
      Auth.signOut();
    });
  };

  const onChangePhoto = () => {
    launchImageLibrary(
      {mediaType: 'photo'},
      ({didCancel, errorCode, errorMessage, assets}) => {
        if (!didCancel && !errorCode && assets && assets.length > 0) {
          setSelectedPhoto(assets[0]);
        }
      },
    );
  };

  const validateUsername = async (username: string) => {
    // query the database based on the usersByUsername

    try {
      const response = await getUsersByUsername({ variables: { username } })
      console.log(response);
      if (response.error) {
        Alert.alert("Failed to fetch username");
        return 'Failed to fetch username';
      }
      const users = response.data?.usersByUsername?.items;
      if (users && users?.length > 0 && users[0]?.id !== userId) {
        return 'Username is already taken';
      }
    } catch (error) {
      Alert.alert("Failed to fetch username", error);
    }

    // if there are any users with this username, then return the error
    return true;
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error || updateError || deleteError) {
    return (
      <ApiErrorMessage
        title="Error Fetching or Updating user"
        message={error?.message || updateError?.message || deleteError?.message}
      />
    );
  }

  return (
    <View style={styles.page}>
      <Image
        source={{uri: selectedPhoto?.uri || user?.image || DEFAULT_USER_IMAGE}}
        style={styles.avatar}
      />
      <Text onPress={onChangePhoto} style={styles.textButton}>
        Change Profile photo
      </Text>
      <CustomInput
        name="name"
        control={control}
        rules={{required: 'Name is Required'}}
        label="Name"
      />
      <CustomInput
        name="username"
        control={control}
        rules={{
          required: 'Username is Required',
          minLength: {
            value: 3,
            message: 'Username must be at least of 3 Characters',
            validate: validateUsername
          },
        }}
        label="Username"
      />
      <CustomInput
        name="website"
        control={control}
        rules={{
          pattern: {value: URL_REGEX, message: 'Invalid URl'},
        }}
        label="Website"
      />
      <CustomInput
        name="bio"
        control={control}
        rules={{
          maxLength: {value: 200, message: 'Bio cannot exceed 200 Characters'},
        }}
        label="Bio"
        multiline
      />
      <Text onPress={handleSubmit(onSubmit)} style={styles.textButton}>
        {updateLoading ? 'Submitting' : 'Submit'}
      </Text>
      <Text onPress={confirmDelete} style={styles.textButtonDanger}>
        {deleteLoading ? 'Deleting...' : 'DELETE USER'}
      </Text>
    </View>
  );
};

export default EditProfileScreen;
