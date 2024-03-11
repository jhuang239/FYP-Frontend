import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import SignUp from '../components/screens/SignUp';
import Login from '../components/screens/Login';
import WelcomePage from '../components/screens/WelcomePage';
import Routes from './Routers';

type StackRoutersProps = {
  UpdateUserState: (user: any) => void;
};

const Stack = createStackNavigator();

const StackRouters = ({UpdateUserState}: StackRoutersProps) => {
  console.log('StackRouters', UpdateUserState);

  return (
    <Stack.Navigator initialRouteName="WelcomePage">
      <Stack.Screen
        name="Welcome"
        component={WelcomePage}
        options={{headerShown: false}}
      />
      <Stack.Screen name="SignUp">{props => <SignUp />}</Stack.Screen>
      <Stack.Screen name="Login" options={{headerShown: false}}>
        {props => <Login UpdateUserState={UpdateUserState} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default StackRouters;
