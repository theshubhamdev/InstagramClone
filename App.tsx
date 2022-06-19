import { View, Text } from 'react-native'
import React from 'react'
import HomeScreen from "./src/screens/HomeScreen"
import CommentsScreen from './src/screens/CommentsScreen'
import ProfileScreen from './src/screens/ProfileScreen'

const App = () => {
  return (
    <View style={{flex:1}}>
      {/* <HomeScreen /> */}
      {/* <CommentsScreen /> */}
      <ProfileScreen />
    </View>
  )
}

export default App