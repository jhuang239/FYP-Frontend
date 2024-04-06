import {NavigationContainer} from '@react-navigation/native';
import Routes from './routes/Routers';
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StackRouters from './routes/StackRouters';
import UploadFile from './components/screens/UploadFile';
import FileList from './components/screens/FileList';
import QuestionAnswer from './components/screens/QuestionAnswer';
import NewHome from './components/screens/NewHome';
import AuthorizedRouters from './routes/AuthorizedRouters';
import {Platform, View} from 'react-native';
import {LogBox} from 'react-native';

export default function App() {
  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
  LogBox.ignoreAllLogs(); //Ignore all log notifications

  const [userData, setUserData] = React.useState<any>(null);

  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem('userData').then(value => {
      console.log('userData123', value);
      if (value) {
        setUserData(JSON.parse(value));
        setLoaded(true);
      } else {
        setUserData(null);
        setLoaded(true);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      {userData != null && loaded && (
        <AuthorizedRouters UpdateUserState={setUserData} />
      )}
      {userData == null && loaded && (
        <StackRouters UpdateUserState={setUserData} />
      )}
    </NavigationContainer>
  );
}
