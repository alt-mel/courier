import { useState } from 'react';
import * as React from 'react';

import { Pressable, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, gql } from '@apollo/client';

import { View, Text, TextInput } from '../components/Themed';

export const SIGN_IN_MUTATION = gql`
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

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [signIn, { data, error, loading }] = useMutation(SIGN_IN_MUTATION);

  if (data) {
    AsyncStorage.setItem('token', data.signIn.token).then(() => {
      navigation.navigate('Home');
    });
  }

  if (error) {
    console.log(error);
  }

  const onSubmit = () => {
    signIn({ variables: { email, password } });
  };

  return (
    <SafeAreaView style={{ padding: 20 }}>
      <TextInput
        placeholder="email@email.com"
        testID="SignIn.Email"
        value={email}
        onChangeText={setEmail}
        style={{
          fontSize: 18,
          width: '100%',
          marginVertical: 25
        }}
      />

      <TextInput
        placeholder="password"
        testID="SignIn.Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          fontSize: 18,
          width: '100%',
          marginVertical: 25
        }}
      />
      <Pressable
        onPress={onSubmit}
        disabled={loading}
        testID="SignIn.Button"
        style={{
          backgroundColor: '#bebebe',
          height: 50,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 30
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold'
          }}
        >
          Sign In
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          console.warn('navigate: Sign Up');
          navigation.navigate('SignUp');
        }}
        style={{
          height: 50,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 30
        }}
      >
        {error && (
          <Text
            style={{
              color: '#bebebe',
              fontSize: 18,
              fontWeight: 'bold'
            }}
          >
            Invalid credentials, try again
          </Text>
        )}
        <Text
          style={{
            color: '#bebebe',
            fontSize: 18,
            fontWeight: 'bold'
          }}
        >
          New here? Sign up
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default SignInScreen;
