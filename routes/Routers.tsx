import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../components/screens/Home';
import Chatbot from '../components/screens/Chatbot';

type RoutersProps = {
  UpdateUserState: (user: any) => void;
};

const Tab = createBottomTabNavigator();

const Routers = ({UpdateUserState}: RoutersProps) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
      }}>
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}>
        {props => <Home UpdateUserState={UpdateUserState} />}
      </Tab.Screen>
      <Tab.Screen
        name="Chatbot"
        component={Chatbot}
        options={{
          tabBarLabel: 'Chatbot',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="chat" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Routers;
