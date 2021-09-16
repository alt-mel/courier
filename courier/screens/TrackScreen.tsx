import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';

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
  }
});
