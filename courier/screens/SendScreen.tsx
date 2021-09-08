import React, { useState } from 'react';

import {
  StyleSheet, KeyboardAvoidingView, Platform, Pressable, ScrollView, Picker
} from 'react-native';
import { Text, View, TextInput } from '../components/Themed';
import { RadioButton } from 'react-native-paper';

import { useMutation, gql } from '@apollo/client';

const CREATE_DELIVERY = gql`
mutation CreateDelivery($title: String!, $price: String!, $pickup_location: String!, $destination_location: String!, $description: String!, $size: String!, $weight: String!) {
  createDelivery(title: $title, price: $price, pickup_location: $pickup_location, destination_location: $destination_location, description: $description, size: $size, weight: $weight) {
    title
    price
    pickup_location
    destination_location
    description
    size
    weight
}
}
`;
export default function SendScreen() {

  const [pickup_location, setPickupLocation] = useState('');
  const [destination_location, setDestinationLocation] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');


  const [createDelivery, { data, error, loading }] = useMutation(CREATE_DELIVERY);

  if (data ) {
    console.warn('Delivery Created');
    console.log(data);
  }

  if (error) {
    console.log('Delivery creation unsuccessful');
  }

  const onSubmit = () => {
    createDelivery({ variables: { pickup_location, destination_location, price, size, weight, description } });
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 130 : 0}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Send/Details</Text>
          <View style={styles.locationBox}>
            <TextInput
              placeholder="Pick up....."
              value={pickup_location}
              onChangeText={setPickupLocation}
              style={styles.textInput}
            />
            <TextInput
              placeholder="Drop off....."
              value={destination_location}
              onChangeText={setDestinationLocation}
              style={styles.textInput}
            />
          </View>
          <View style={styles.sizeBox}>
            <View style={styles.column}>
              <Text style={styles.label}>Package Size</Text>
              <Picker
                selectedValue={size}
                style={{ height: 42, width: '75%' }}
                onValueChange={(itemValue, itemIndex) => setSize(itemValue)}
              >
                <Picker.Item label="Small" value="small" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="Large" value="lerge" />
              </Picker>
            </View>
          </View>
          <View style={styles.weightBox}>
            <Text style={styles.label}>Package Weight</Text>
            <RadioButton.Group onValueChange={newValue => setWeight(newValue)} value={weight}>
              <View>
                <Text>0 - 5 kg</Text>
                <RadioButton value="light" />
              </View>
              <View>
                <Text>5 - 10 kg</Text>
                <RadioButton value="medium" />
              </View>
              <View>
                <Text>Over 10 kg</Text>
                <RadioButton value="second" />
              </View>
            </RadioButton.Group>
          </View>
          <Pressable style={styles.button} onPress={onSubmit} disabled={loading} testID="Delivery.Button" >
            <Text style={styles.buttonText}>Create delivery</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: 'center',
    padding: 12
  },
  column: {
  },
  sizeBox: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 38,
    marginBottom: 43,
    textAlign: 'left',
    width: '95%',
    margin: '6%',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#bebebe',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600'
  },
  weightBox: {
    width: '95%',
    margin: '6%',
  },
  locationBox: {
    backgroundColor: '#bebebe',
    height: 153,
    width: '95%',
    margin: 'auto',
    marginBottom: 52,
  },
  title: {
    width: '100%',
    alignItems: 'center',
    fontSize: 24,
    marginBottom: 52,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 21,
    textAlign: 'left'
  },
  textInput: {
    fontSize: 14,
    padding: 7,
    lineHeight: 19,
    border: '1px solid black',
    width: '95%',
    marginLeft: '3%',
    marginRight: '3%',
    marginTop: 20,
    backgroundColor: 'white'
  },
  image: {
    width: 190,
    height: 221,
  },
});

