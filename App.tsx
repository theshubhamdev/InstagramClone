import {Linking, StatusBar, View} from 'react-native';
import Navigation from './src/navigation';
import Amplify from 'aws-amplify';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import config from './src/aws-exports';
import AuthContextProvider from './src/contexts/AuthContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import colors from './src/theme/colors';
import Client from './src/apollo/Client';

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
    <AuthContextProvider>
      <Client>
        <StatusBar backgroundColor={colors.black} barStyle={'light-content'} />
        <Navigation />
      </Client>
    </AuthContextProvider>
  );
};

export default App;
