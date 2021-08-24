import React, { useState, useEffect } from 'react';
import { Pressable, Alert } from 'react-native';
import { View, Text, TextInput } from '../components/Themed';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, gql } from '@apollo/client';

const SIGN_IN_MUTATION = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password }) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const [signIn, { data, error, loading }] = useMutation(SIGN_IN_MUTATION);

  useEffect(() => {
    if (error) {
      Alert.alert('Invalid credentials, try again');
    }
  }, [error]);

  if (data) {
    AsyncStorage.setItem('token', data.signIn.token).then(() => {
      navigation.navigate('Home');
    });
  }

  const onSubmit = () => {
    signIn({ variables: { email, password } });
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="email@email.com"
        value={email}
        onChangeText={setEmail}
        style={{
          fontSize: 18,
          width: '100%',
          marginVertical: 25,
        }}
      />

      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          fontSize: 18,
          width: '100%',
          marginVertical: 25,
        }}
      />
      <Pressable
        onPress={onSubmit}
        disabled={loading}
        style={{
          backgroundColor: '#ed706E',
          height: 50,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 30,
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          Sign In
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          console.warn('nbavigate');
          navigation.navigate('SignUp');
        }}
        style={{
          height: 50,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 30,
        }}
      >
        <Text
          style={{
            color: '#ed706E',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          New here? Sign up
        </Text>
      </Pressable>
    </View>
  );
};

export default SignInScreen;
