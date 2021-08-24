import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Home: undefined;
  Send: undefined;
  Track: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Splash: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Send: undefined;
  Track: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  Send: undefined;
  SplashScreen: undefined
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;