import * as React from 'react';
import { View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";


import Home from '../components/screens/Home';
import Chatbot from '../components/screens/Chatbot';
import UploadFile from '../components/screens/UploadFile';
import FileList from '../components/screens/FileList';
import Discussion from '../components/screens/Discussion';
import NewHome from '../components/screens/NewHome';


type RoutersProps = {
  UpdateUserState: (user: any) => void;
};

const Tab = createBottomTabNavigator();

const Routers = ({ UpdateUserState }: RoutersProps) => {
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
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}>
        {props => <NewHome UpdateUserState={UpdateUserState} />}
      </Tab.Screen>
      <Tab.Screen
        name="Chatbot"
        component={Chatbot}
        options={{
          headerShown: false,
          tabBarLabel: 'Chatbot',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Upload"
        component={UploadFile}
        options={{
          tabBarLabel: 'Upload File',
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            return (
              <View
                style={{
                  top: Platform.OS === 'ios' ? -10 : -5,
                  width: 60,
                  height: 60,
                  borderRadius: 45,
                  alignContent: 'center',
                  justifyContent: 'center',
                  backgroundColor: "white"
                }}>
                <MaterialCommunityIcons name="upload" color={color} size={60} />
              </View>
            )
          }
        }}
      />
      <Tab.Screen
        name="Explorer"
        component={FileList}
        options={{
          tabBarLabel: 'Explorer',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <IoniconsIcon name="library" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Discussion"
        component={Discussion}
        options={{
          tabBarLabel: 'Discussion',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Octicons name="comment-discussion" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Routers;
