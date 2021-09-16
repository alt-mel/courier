import { useState } from 'react';
import * as React from 'react';

import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Picker
} from 'react-native';
import { Text, View, TextInput } from '../components/Themed';

import { useMutation, gql } from '@apollo/client';

const CREATE_DELIVERY = gql`
  mutation CreateDelivery(
    $title: String!
    $price: String!
    $pickup_location: String!
    $destination_location: String!
    $description: String!
    $size: String!
    $weight: String!
    $status: String!
  ) {
    createDelivery(
      title: $title
      price: $price
      pickup_location: $pickup_location
      destination_location: $destination_location
      description: $description
      size: $size
      weight: $weight
      status: $status
    ) {
      id
      title
      price
      pickup_location
      destination_location
      description
      size
      weight
      status
    }
  }
`;
export default function SendScreen({ navigation }) {
  const [pickup_location, setPickupLocation] = useState('');
  const [destination_location, setDestinationLocation] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [size, setSize] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('waiting');

  const [newDeliveryId, setNewDeliveryId] = useState('');
  const [createDelivery, { data, error, loading }] = useMutation(CREATE_DELIVERY);

  if (data) {
    console.warn('Delivery Created');
    console.log(data.id);
    setNewDeliveryId(data.id);
    // navigation.navigate('Track', {
    //   item: data?.id
    // });
  }

  if (error) {
    console.log('Delivery creation unsuccessful');
    console.log(JSON.stringify(error, null, 2));
  }

  const onSubmit = () => {
    createDelivery({
      variables: {
        title,
        pickup_location,
        destination_location,
        price,
        size,
        weight,
        description,
        status
      }
    });
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
          <View>
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
          <View style={styles.box}>
            <Text style={styles.label}>Package Name</Text>
            <TextInput style={styles.numberInput} value={title} onChangeText={setTitle} />
          </View>
          <View style={styles.box}>
            <Text style={styles.label}>Package Size</Text>
            <Picker
              selectedValue={size}
              style={{ height: 42, width: '75%' }}
              onValueChange={(itemValue) => setSize(itemValue)}
            >
              <Picker.Item label="Small" value="small" />
              <Picker.Item label="Medium" value="medium" />
              <Picker.Item label="Large" value="lerge" />
            </Picker>
          </View>
          <View style={styles.box}>
            <Text style={styles.label}>Package Weight</Text>
            <TextInput
              returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
              style={styles.numberInput}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.descriptionBox}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>
          <Pressable
            style={styles.button}
            onPress={onSubmit}
            disabled={loading}
            testID="Delivery.Button"
          >
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
  sizeBox: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 38,
    marginBottom: 43,
    textAlign: 'left',
    margin: '6%'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#bebebe'
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600'
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 22
  },
  // locationBox: {
  //   backgroundColor: '#bebebe',
  //   height: 153,
  //   width: '95%',
  //   margin: 'auto',
  //   marginBottom: 52
  // },
  title: {
    width: '100%',
    alignItems: 'center',
    fontSize: 24,
    marginBottom: 52
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
    // lineHeight: 19,
    // width: '95%',
    // marginLeft: '3%',
    // marginRight: '3%',
    // marginTop: 20,

    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10
  },
  numberInput: {
    fontSize: 14,
    border: '1px solid black',
    lineHeight: 19,
    height: 30,
    width: 40
  },
  descriptionBox: {
    display: 'flex'
  },
  descriptionInput: {
    height: 100,
    border: '1px solid black',
    marginBottom: 22
  }
});
