import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';


import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import LinkingConfiguration from './LinkingConfiguration';
import HomeStack from './HomeStack';
import AuthStack from './AuthStack';
import AsyncStorage from '@react-native-community/async-storage';
import { RootStackParamList } from '../types';

async function checkIfUserSignIn() {
  console.log('HIIIIIII');
  let value = AsyncStorage.getItem('token');
  console.log('Value', value);
  if (!value) {
    return false;
  }
  return false;
}
const RootStack = createStackNavigator<RootStackParamList>();

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {



  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootStack.Navigator screenOptions={{ headerShown: false }}>

        {AsyncStorage.getItem('token') !== null ? <RootStack.Screen name="Home" component={HomeStack} /> : <RootStack.Screen name="Auth" component={AuthStack} />}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}