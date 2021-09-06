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
          SignIn: {
            screens: {
              SignInScreen: 'two',
            },
          },
          SignUp: {
            screens: {
              SignUpScreen: 'three',
            },
          },
          Send: {
            screens: {
              TabOneScreen: 'four',
            },
          },
          Track: {
            screens: {
              SplashScreen: 'five',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
