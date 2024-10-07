import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import all screen components
import LoginScreen from './login';
import HomeScreen from './screens/HomeScreen';
import Scan_Barcode from './screens/Scan_Barcode';
import Previous_Warehouse_Receipt from './screens/Previous_Warehouse_Receipt';
import MoveStock from './screens/MoveStock';
import Settings from './screens/Settings';
import Edit from './screens/Edit';
import View_receipt from './screens/View_Receipt';

// Create the stack navigator
const Stack = createNativeStackNavigator();

// Define the type for the navigation prop
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Scan_Barcode: undefined;
  Previous_Warehouse_Receipt: undefined;
  Move_Stock: undefined;
  Settings: undefined;
  Edit: undefined;
  View_Receipt: undefined;
};

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Scan_Barcode" 
            component={Scan_Barcode} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Previous_Warehouse_Receipt" 
            component={Previous_Warehouse_Receipt} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Move_Stock" 
            component={MoveStock} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Settings" 
            component={Settings} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Edit" 
            component={Edit} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="View_Receipt" 
            component={View_receipt} 
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;