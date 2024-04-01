import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";

import SignUp from '../components/screens/SignUp';
import Login from '../components/screens/Login';
import WelcomePage from '../components/screens/WelcomePage';
import UploadFile from '../components/screens/UploadFile';
import Home from '../components/screens/Home';
import Chatbot from '../components/screens/Chatbot';
import FileList from '../components/screens/FileList';
import Discussion from '../components/screens/Discussion';
import NewHome from '../components/screens/NewHome';
import QuestionAnswer from '../components/screens/QuestionAnswer';
import PdfViewer from '../components/screens/PdfViewer';
import DiscussionDetail from '../components/screens/DiscussionDetail';
import CreateDiscussion from '../components/screens/CreateDiscussion';
import Routers from './Routers';


const Stack = createStackNavigator();

type RoutersProps = {
    UpdateUserState: (user: any) => void;
};

const AuthorizedRouters = ({ UpdateUserState }: RoutersProps) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Main"
                options={{ headerShown: false }}
            >
                {props => <Routers UpdateUserState={UpdateUserState} />}
            </Stack.Screen>
            <Stack.Screen
                name="QuestionAnswer"
                component={QuestionAnswer}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PdfViewer"
                component={PdfViewer}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="DiscussionDetail"
                component={DiscussionDetail}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CreateDiscussion"
                component={CreateDiscussion}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default AuthorizedRouters;
