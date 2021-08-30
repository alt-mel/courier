
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { BottomTabParamList } from '../types';
import DeliveriesScreen from '../screens/DeliveriesScreen';
import SplashScreen from '../screens/SplashScreen';
import SendScreen from '../screens/SendScreen';
import {
  StyleSheet
} from 'react-native';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={DeliveriesScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tab.Screen
        name="Send"
        component={SendScreen}
        options={{
          title: 'Send',
          tabBarIcon: ({ color }) => <TabBarIcon name="gift" color={color} />,
        }}
      />
      <Tab.Screen
        name="Track"
        component={SplashScreen}
        options={{
          title: 'Track',
          tabBarIcon: ({ color }) => <TabBarIcon name="map-marker" color={color} />,
        }}
      />

    </ Tab.Navigator>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={styles.icon} {...props} />;
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: '#ED706E',
    marginBottom: -3,
    color: 'white',
    padding: '34'
  }
});

