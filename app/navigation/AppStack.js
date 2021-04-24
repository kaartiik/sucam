import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';

const Stack = createStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Home" mode="modal" headerMode="none">
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
