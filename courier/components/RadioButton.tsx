import React from 'react';
import {
    StyleSheet, Pressable
  } from 'react-native';

import { Text, View } from '../components/Themed';

export default function RadioButton(props) {
    return (
        <Pressable style={styles.radioButton}>
        <View style={[{
          height: 24,
          width: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: '#ed706e',
          alignItems: 'center',
          justifyContent: 'center',

        }, props.style]}>{props.selected ?
          <View style={{
            height: 12,
            width: 12,
            borderRadius: 6,
            backgroundColor: '#ed706e'
          }} /> : null} </View><Text style={styles.selection}> {props.value}</Text></Pressable>
    );
}

const styles = StyleSheet.create({

    radioButton: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 22
    },
    selection: {
      fontWeight: '600',
      lineHeight: 19,
      margin: 3,
      color: '#8C8C8C'
    }
  });
  