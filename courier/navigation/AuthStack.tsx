import { createStackNavigator } from '@react-navigation/stack';
import { AuthParamList } from '../types';
import * as React from 'react';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator<AuthParamList>();

export default function AuthStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
    );
}

