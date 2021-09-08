import React, { useState } from 'react';
import {
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { View, Text, TextInput } from '../components/Themed';
import { useLinkTo } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useMutation, gql } from '@apollo/client';

const SIGN_UP_MUTATION = gql`
  mutation signUp($email: String!, $password: String!, $name: String!) {
    signUp(input: { email: $email, password: $password, name: $name }) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const linkTo = useLinkTo();

  const [signUp, { data, error, loading }] = useMutation(SIGN_UP_MUTATION);

  if (error) {
    Alert.alert('Error signing up. Try again');
  }

  if (data) {
    AsyncStorage.setItem('token', data.signUp.token).then(() => {
      // navigation.navigate('Home');
      linkTo('/Home/Deliveries');
    });
  }

  const onSubmit = () => {
    signUp({ variables: { name, email, password } });
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="name"
        value={name}
        onChangeText={setName}
        style={{
          fontSize: 18,
          width: '100%',
          marginVertical: 25,
        }}
      />

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
        style={{
          backgroundColor: '#ed706E',
          height: 50,
          borderRadius: 5,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 30,
        }}
      >
        {loading && <ActivityIndicator />}
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          Sign up
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          navigation.navigate('SignIn');
        }}
        disabled={loading}
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
          Already Have an account? Sign in
        </Text>
      </Pressable>
    </View>
  );
};

export default SignUpScreen;
