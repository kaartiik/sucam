import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppStack from './AppStack';
import Authentication from '../screens/Authentication';

export default function AppNavigator() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="AuthScreen" headerMode="none">
      <Stack.Screen name="AuthScreen" component={Authentication} />
      <Stack.Screen name="AppStack" component={AppStack} />
    </Stack.Navigator>
  );
}
