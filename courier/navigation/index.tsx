import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';


import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';

import HomeStack from './HomeStack';
import AuthStack from './AuthStack';
import { RootStackParamList } from '../types';


const RootStack = createStackNavigator<RootStackParamList>();

const isAuthenticated = async () => {
  const token = await AsyncStorage.getItem('token');
  return !!token;
};


export default function Navigation(){

  const navigation = useNavigation();

  useEffect(() => {
    const checkUser = async () => {
      if (await isAuthenticated()) {
        navigation.navigate('Home');
      } else {
        navigation.navigate('Auth');
      }
    };

    checkUser();
  }, []);

  return (

    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Home" component={HomeStack} />
      <RootStack.Screen name="Auth" component={AuthStack} />
    </RootStack.Navigator>
  );
}