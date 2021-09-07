import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              DeliveriesScreen: 'Deliveries',
              SendScreen: 'Send',
              TrackScreen: 'Track'
            },
          },
          Auth: {
            screens: {
              SignInScreen: 'SignIn',
              SignUpScreen: 'SignUp'
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
