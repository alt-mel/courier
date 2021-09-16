import { useState, useEffect } from 'react';
import * as React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
  Pressable,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, gql } from '@apollo/client';

import { View, Text } from '../components/Themed';

const GET_DELIVERIES = gql`
  query myDeliveries {
    myDeliveries {
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

export default function DeliveriesScreen({ navigation }) {
  const [deliveries, setDeliveries] = useState([]);

  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const [state, setState] = useState({
    loading: false,
    data: [],
    error: null
  });

  const [arrayHolder, setArrayHolder] = useState([]);
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
      console.log('Data', data);
    }
  }, [data]);

  if (!deliveries) {
    return null;
  }

  const renderItem = ({ item }) => (
    <TouchableWithoutFeedback onPress={() => selectItem(item)}>
      <View style={styles.item}>
        <Text>{item.title}</Text>
        <Text>{item.status}</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  const onSubmit = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.navigate('Auth');
    } catch (exception) {
      return false;
    }
  };

  const selectItem = (item) => {
    console.log('Selected Item :', item);
    navigation.navigate('Track', {
      item: item
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
          <Text style={styles.title}>My Deliveries</Text>
          <FlatList
            style={styles.itemList}
            data={deliveries}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
          <Pressable onPress={onSubmit} disabled={loading} style={styles.button}>
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold'
              }}
            >
              Sign Out
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    display: 'flex'
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
  title: {
    width: '100%',
    alignItems: 'center',
    fontSize: 24,
    marginBottom: 52
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    width: Dimensions.get('window').width / 2,
    justifyContent: 'space-between',
    paddingTop: 30
  },
  itemList: {
    margin: 8
  }
});
