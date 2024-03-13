import {NavigationContainer} from '@react-navigation/native';
import Routes from './routes/Routers';
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StackRouters from './routes/StackRouters';
import UploadFile from './components/screens/UploadFile';

export default function App() {
  const [userData, setUserData] = React.useState<any>(() => {
    AsyncStorage.getItem('userData').then(value => {
      console.log('userData123', value);
      if (value) {
        return JSON.parse(value);
      } else {
        return null;
      }
    });
  });

  return (
    <NavigationContainer>
      <UploadFile />
      {/* {userData != null ? (
        <Routes UpdateUserState={setUserData} />
      ) : (
        <StackRouters UpdateUserState={setUserData} />
      )} */}
    </NavigationContainer>
  );
}
