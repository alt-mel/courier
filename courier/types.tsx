import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Root: NavigatorScreenParams<HomeParamList> | undefined;
  Splash: undefined;
  NotFound: undefined;
  Home: undefined;
  Auth: undefined;
};

export type HomeParamList = {
  Home: undefined;
  Send: undefined;
  Track: undefined;
};

export type AuthParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type HomecreenProps<Screen extends keyof HomeParamList> = CompositeScreenProps<
  BottomTabScreenProps<HomeParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;