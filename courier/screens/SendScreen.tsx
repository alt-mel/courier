import React, { useState } from 'react';
import RadioButton from '../components/RadioButton';

import {
  StyleSheet, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Picker
} from 'react-native';
import { Text, View, TextInput } from '../components/Themed';

import { useMutation, gql } from '@apollo/client';


const CREATE_DELIVERY = gql`
mutation CreateDelivery($title: String!, $price: String!, $pickup_location: String!, $destination_location: String!) {
  createDelivery(title: $title, price: $price, pickup_location: $pickup_location, destination_location: $destination_location) {
    title
    price
    pickup_location
    destination_location
}
}
`;
export default function SendScreen() {

  const [selectedValue, setSelectedValue] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [checked, setChecked] = useState('');

  const [createDelivery, { data, error, loading }] = useMutation(CREATE_DELIVERY);

  createDelivery({ variables: { pickup_location: 'test-pickup', destination_location: 'test-destination', price: 'test-price', title: 'test-Title' } });

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
              value={pickupLocation}
              onChangeText={setPickupLocation}
              style={styles.textInput}
            />
            <TextInput
              placeholder="Drop off....."
              value={destinationLocation}
              onChangeText={setDestinationLocation}
              style={styles.textInput}
            />
          </View>
          <View style={styles.sizeBox}>
            <View style={styles.column}>
              <Text style={styles.label}>Package Size</Text>
              <Picker
                selectedValue={selectedValue}
                style={{ height: 42, width: '75%' }}
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
              >
                <Picker.Item label="Small" value="small" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="Large" value="lerge" />
              </Picker>
            </View>
            <View >
              <Image
                style={styles.image}
                source={require('../assets/images/courier.jpg')}
              />
            </View>
          </View>
          <View style={styles.weightBox}>
            <Text style={styles.label}>Package Weight</Text>
            <RadioButton onPress={() => setChecked('first')} selected={checked === 'first' ? 'checked' : 'unchecked'} value="0 - 5 kg" />
            <RadioButton onPress={() => setChecked('second')} selected={checked === 'second' ? 'checked' : 'unchecked'} value="5 - 10 kg" />
            <RadioButton onPress={() => setChecked('third')} selected={checked === 'third' ? 'checked' : 'unchecked'} value="Over 10 kg" />
          </View>
          <Pressable style={styles.button} onPress={() => {
            createDelivery({ variables: { pickup_location: 'test-pickup', destination_location: 'test-destination', price: 'test-price', title: 'test-Title' } });
          }
          }>
            <Text style={styles.buttonText}>Create delivery</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
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
    backgroundColor: '#ed706e',
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
    backgroundColor: '#F3D598',
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

