import { View, Text } from 'react-native'
import React from 'react'
import HomeScreen from "./src/screens/HomeScreen"
import CommentsScreen from './src/screens/CommentsScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import EditProfileScreen from './src/screens/EditProfileScreen'
import PostUploadScreen from './src/screens/PostUploadScreen'

const App = () => {
  return (
    <View style={{flex:1}}>
      {/* <HomeScreen /> */}
      {/* <CommentsScreen /> */}
      {/* <ProfileScreen /> */}
      {/* <EditProfileScreen /> */}
      <PostUploadScreen />
    </View>
  )
}

export default App