
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { BottomTabParamList } from '../types';
import DeliveriesScreen from '../screens/DeliveriesScreen';
import SplashScreen from '../screens/SplashScreen';
import SendScreen from '../screens/SendScreen';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarBadgeStyle: { borderTopWidth: 0, borderWidth: 0, borderTopColor: 'white' }
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={DeliveriesScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Send"
        component={SendScreen}
        options={{
          title: 'Send',
          tabBarIcon: ({ color }) => <TabBarIcon name="gift" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Track"
        component={SplashScreen}
        options={{
          title: 'Track',
          tabBarIcon: ({ color }) => <TabBarIcon name="map-marker" color={color} />,
        }}
      />

    </BottomTab.Navigator>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

