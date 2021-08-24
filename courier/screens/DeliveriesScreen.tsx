import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList
} from 'react-native';
import { View, Text } from '../components/Themed';

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

  const [geoData, setGeoData] = useState({ words: '' })
  const { data, error, loading } = useQuery(GET_DELIVERIES);

  useEffect(() => {
    if (error) {
      console.log(error);
      Alert.alert('Error fetching delivery', error.message);
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
          renderItem={({ item }) => (<React.Fragment><Text>{item.price}</Text><Text>{item.title}</Text></React.Fragment>)}
        />
        {

          <Text>{geoData.words}</Text>
        }
      </View>
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
    color: '#e33062',
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
