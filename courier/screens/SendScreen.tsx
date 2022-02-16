import { useState } from 'react';
import * as React from 'react';

import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { TextInput, Searchbar, Text, Button } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import { View } from '../components/Themed';

import { useMutation, useQuery, gql, useLazyQuery } from '@apollo/client';

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

export const GET_PREDICTIONS_QUERY = gql`
  query getPredictions {
    getPredictions(description: $description) {
      id
      description
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
  const [showDropDown, setShowDropDown] = useState(false);
  const status = 'waiting';
  const sizeList = [
    {
      label: 'Small',
      value: 'small'
    },
    {
      label: 'Medium',
      value: 'medium'
    },
    {
      label: 'Large',
      value: 'large'
    }
  ];
  const [state, setState] = useState({
    searchKeyword: '',
    searchResults: [],
    isShowingResults: false
  });

  const [createDelivery, { data, error, loading }] = useMutation(CREATE_DELIVERY);

  const [getPredictions, { data: predictionData }] = useLazyQuery(GET_PREDICTIONS_QUERY, {
    fetchPolicy: 'network-only',
    variables: {
      description: state.searchKeyword
    }
  });

  if (data) {
    console.warn('Delivery Created');
    console.log(data?.id);
    navigation.navigate('Track', {
      item: data
    });
  }

  if (predictionData) {
    console.log('Data', predictionData);
  }

  const searchLocation = async (text: string) => {
    setState({ ...state, searchKeyword: text });

    getPredictions({ variables: { description: state.searchKeyword } });
    console.log('Address Results', predictionData);
  };

  if (error) {
    console.log('Delivery creation unsuccessful');
    console.log(JSON.stringify(error, null, 2));
  }

  const onSubmit = () => {
    console.log('Delivery Created');
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
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 130 : 0}
        style={{ flex: 1 }}
      >
        <View>
          <SafeAreaView>
            <Searchbar
              placeholder="Search for an address"
              onChangeText={(text) => searchLocation(text)}
              value={state.searchKeyword}
            />
            {state.isShowingResults && (
              <FlatList
                data={state.searchResults}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        setState({
                          ...state,
                          searchKeyword: item.description,
                          isShowingResults: false
                        })
                      }
                    >
                      <Text>{item.description}</Text>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item) => item.id}
              />
            )}
          </SafeAreaView>
          <TextInput
            style={styles.input}
            placeholder="Pick up....."
            value={pickup_location}
            onChangeText={setPickupLocation}
          />
          <TextInput
            style={styles.input}
            placeholder="Drop off....."
            value={destination_location}
            onChangeText={setDestinationLocation}
          />
          <TextInput
            style={styles.input}
            value={title}
            label="Package Name"
            onChangeText={setTitle}
          />
          <DropDown
            style={styles.input}
            label={'Package Size'}
            mode={'outlined'}
            visible={showDropDown}
            showDropDown={() => setShowDropDown(true)}
            onDismiss={() => setShowDropDown(false)}
            value={size}
            setValue={setSize}
            list={sizeList}
            multiSelect
          />

          <TextInput
            style={styles.input}
            label="Package Weight"
            returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <Button
            style={styles.input}
            mode="contained"
            onPress={onSubmit}
            disabled={loading}
            testID="Delivery.Button"
          >
            Create delivery
          </Button>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20
  },
  input: {
    margin: 10
  }
});
