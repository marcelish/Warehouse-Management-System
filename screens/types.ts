// types.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined; // Define parameters for the Login screen if any
  Home: undefined; // Define parameters for the Home screen if any
  // Add other screens here
};

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
