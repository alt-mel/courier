import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              DeliveriesScreen: 'deliveries',
              SendScreen: 'send',
              TrackScreen: 'track'
            },
          },
          Auth: {
            screens: {
              SignInScreen: 'SignUp',
              SignUpScreen: 'SignIn'
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
