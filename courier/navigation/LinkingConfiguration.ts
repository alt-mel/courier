import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              DeliveriesScreen: 'one',
            },
          },
          Send: {
            screens: {
              TabOneScreen: 'two',
            },
          },
          Track: {
            screens: {
              SplashScreen: 'three',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
