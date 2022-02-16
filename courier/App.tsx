import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import { ApolloProvider } from '@apollo/client';
import { Provider as PaperProvider } from 'react-native-paper';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';

import Navigation from './navigation';
import LinkingConfiguration from './navigation/LinkingConfiguration';

import { client } from './apollo';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) { return null; }


  return (
    <ApolloProvider client={client}>
      <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer
          linking={LinkingConfiguration}
          theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <Navigation />
          <StatusBar />
        </NavigationContainer>
      </SafeAreaProvider>
      </PaperProvider>
    </ApolloProvider>

  );
}

