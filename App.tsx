import {Linking, StatusBar, View} from 'react-native';
import Navigation from './src/navigation';
import Amplify from 'aws-amplify';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import config from './src/aws-exports';
import AuthContextProvider from './src/contexts/AuthContext';
import colors from './src/theme/colors';
import Client from './src/apollo/Client';
import React from 'react';
import {MenuProvider} from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import relativeTime from "dayjs/plugin/relativeTime"
import dayjs from 'dayjs';
dayjs.extend(relativeTime);

const urlOpener = async (url: string, redirectUrl: string) => {
  await InAppBrowser.isAvailable();
  const response = await InAppBrowser.openAuth(url, redirectUrl, {
    showTitle: false,
    enableUrlBarHiding: true,
    enableDefaultShare: false,
    ephemeralWebSession: false,
  });

  if (response.type === 'success') {
    Linking.openURL(response.url);
  }
};

const updatedConfig = {
  ...config,
  oauth: {
    ...config.oauth,
    redirectSignIn: 'notjustphotos://',
    redirectSignOut: 'notjustphotos://',
    urlOpener,
  },
};

Amplify.configure(updatedConfig);
const App = () => {
  return (
    <SafeAreaProvider>
      <MenuProvider>
        <AuthContextProvider>
          <Client>
            <StatusBar
              backgroundColor={colors.black}
              barStyle={'dark-content'}
            />
            <Navigation />
          </Client>
        </AuthContextProvider>
      </MenuProvider>
    </SafeAreaProvider>
  );
};

export default App;
