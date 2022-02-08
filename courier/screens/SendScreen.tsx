import { useState } from 'react';
import * as React from 'react';

import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Picker,
  SafeAreaView
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';

import { Text, View, TextInput } from '../components/Themed';

import { useMutation, useQuery, gql } from '@apollo/client';

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
    getPredictions {
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
  const status = 'waiting';
  const [state, setState] = useState({
    searchKeyword: '',
    searchResults: [],
    isShowingResults: false
  });
  const [createDelivery, { data, error, loading }] = useMutation(CREATE_DELIVERY);
  const [
    getPredictions,
    { loading: predictionLoading, error: predrictionError, data: predictionData }
  ] = useQuery(GET_PREDICTIONS_QUERY);

  //const API_KEY = 'AIzaSyBlm_ANF4hDpY31CNvAqABz-jh32w7dAbY';

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

    getPredictions({ variables: { descriptions: state.searchKeyword } });
    console.log('Address Results', data);
    // axios
    //   .request({
    //     method: 'post',
    //     url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=${state.searchKeyword}`
    //   })
    //   .then((response) => {
    //     console.log(response.data);
    //     setState({
    //       ...state,
    //       searchResults: response.data.predictions,
    //       isShowingResults: true
    //     });
    //   })
    //   .catch((e) => {
    //     console.log(e.response);
    //   });
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
    <ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 130 : 0}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Send/Details</Text>
          <View>
            <SafeAreaView style={styles.container}>
              <View style={styles.autocompleteContainer}>
                <TextInput
                  placeholder="Search for an address"
                  returnKeyType="search"
                  style={styles.searchBox}
                  placeholderTextColor="#000"
                  onChangeText={(text) => searchLocation(text)}
                  value={state.searchKeyword}
                />
                {state.isShowingResults && (
                  <FlatList
                    data={state.searchResults}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          style={styles.resultItem}
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
                    style={styles.searchResultsContainer}
                  />
                )}
              </View>
              <View style={styles.dummmy} />
            </SafeAreaView>
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
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10
  },
  numberInput: {
    fontSize: 14,
    lineHeight: 19,
    height: 30,
    width: 40
  },
  descriptionBox: {
    display: 'flex'
  },
  descriptionInput: {
    height: 100,
    marginBottom: 22
  },
  autocompleteContainer: {
    zIndex: 1
  },
  searchResultsContainer: {
    width: 340,
    height: 200,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 50
  },
  dummmy: {
    width: 600,
    height: 200,
    backgroundColor: 'hotpink',
    marginTop: 20
  },
  resultItem: {
    width: '100%',
    justifyContent: 'center',
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingLeft: 15
  },
  searchBox: {
    width: 340,
    height: 50,
    fontSize: 18,
    borderRadius: 8,
    borderColor: '#aaa',
    color: '#000',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    paddingLeft: 15
  },
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    alignItems: 'center'
  }
});
