import {View, Text, FlatList, SafeAreaView} from 'react-native';
import React from 'react';
import comments from '../../assets/data/comments.json';
import Comment from '../../components/Comment';
import Input from './Input';
import colors from '../../theme/colors';

const CommentScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.black}}>
      <FlatList
        data={comments}
        renderItem={({item}) => <Comment comment={item} includeDetails />}
        style={{padding: 10}}
      />
      <Input />
    </SafeAreaView>
  );
};

export default CommentScreen;
