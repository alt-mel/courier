import { useEffect } from 'react';
import * as React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import { StyleSheet, Dimensions } from 'react-native';

import { Text, View } from '../components/Themed';

export default function MapScreen({ route, navigation }) {
  const { item } = route.params;

  useEffect(() => {
    if (item) {
      console.log('Data', item);
    }
  }, [item]);

  console.group(item);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map Screen</Text>
      <MapView style={styles.map} provider={PROVIDER_GOOGLE} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});
