
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import DeliveriesScreen from '../screens/DeliveriesScreen';
import TrackScreen from '../screens/TrackScreen';
import SendScreen from '../screens/SendScreen';
import { HomeParamList } from '../types';

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
      {/* <Tab.Screen
        name="Track"
        component={TrackScreen}
        options={{
          title: 'Track',
          tabBarIcon: ({ color }) => <TabBarIcon name="map-marker" color={color} />,
        }}
      /> */}

    </ Tab.Navigator>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} {...props} />;
}


