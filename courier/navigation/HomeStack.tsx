
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { HomeParamList } from '../types';
import DeliveriesScreen from '../screens/DeliveriesScreen';
import SplashScreen from '../screens/SplashScreen';
import SendScreen from '../screens/SendScreen';
import {
  StyleSheet
} from 'react-native';

const Tab = createBottomTabNavigator<HomeParamList>();

export default function HomeStack() {
  return (
    <Tab.Navigator
    >
      <Tab.Screen
        name="Deliveries"
        component={DeliveriesScreen}
        options={{
          title: 'Deliveries',
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
    marginBottom: -3,
    color: 'white',
    padding: '34'
  }
});

