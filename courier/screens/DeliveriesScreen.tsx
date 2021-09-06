import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
  Pressable
} from 'react-native';
import { View, Text } from '../components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useQuery, gql } from '@apollo/client';


const GET_DELIVERIES = gql`
  query myDeliveries {
    myDeliveries {
      id
      title
      price
      pickup_location
      destination_location
    }
  }
`;

export default function DeliveriesScreen() {
  const [deliveries, setDeliveries] = useState([{
    title: '',
    price: '',
    pickup_location: '',
    destination_location: '',
  }]);

  const { data, error, loading } = useQuery(GET_DELIVERIES);

  useEffect(() => {
    if (error) {
      Alert.alert('Error fetching delivery', error.message);
    }
  }, [error]);

  useEffect(() => {
    if (loading) {
      console.log('Loading delivery');
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setDeliveries(data.myDeliveries);
    }
  }, [data]);

  if (!deliveries) {
    return null;
  }

  const renderItem = ({ item }) => (
    <React.Fragment><Text>{item.price}</Text><Text>{item.title}</Text></React.Fragment>
  );

  const onSubmit = async () => {
    try {
      await AsyncStorage.removeItem('token');
      return true;
    }
    catch (exception) {
      return false;
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 130 : 0}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>My Deliveries</Text>
        <FlatList
          data={deliveries}
          renderItem={renderItem}
        />
      </View>
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
          Sign Out
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  title: {
    width: '100%',
    fontSize: 20,
    color: '#ed706e',
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
