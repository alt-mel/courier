import { useState, useEffect } from 'react';
import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  Pressable,
  TouchableWithoutFeedback,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, gql } from '@apollo/client';

import { View as StyledView, Text as StyledText } from '../components/Themed';

export const GET_DELIVERIES_QUERY = gql`
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

  const { data, error, loading } = useQuery(GET_DELIVERIES_QUERY);

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

  const getHeader = () => {
    return (
      <Text style={styles.title} testID="Deliveries.Title">
        My Deliveries
      </Text>
    );
  };

  const getFooter = () => {
    return (
      <Pressable style={styles.button} onPress={onSubmit} disabled={loading}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={deliveries}
        numColumns={1}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => selectItem(item)}>
            <View style={styles.item} testID={`Deliveries.Item-${item.id}`}>
              <Text>{item.title}</Text>
              <Text>{item.status}</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={getHeader}
        ListFooterComponent={getFooter}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 20
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
    fontSize: 18,
    fontWeight: 'bold'
  },
  title: {
    width: '100%',
    alignItems: 'center',
    fontSize: 24
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15
  }
  // itemList: {
  //   margin: 8
  // }
});
