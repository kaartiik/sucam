import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { useSelector } from 'react-redux';
import BreakfastRecipes from '../screens/BreakfastRecipes';
// import { AuthContext } from './AuthProvider';

const Stack = createStackNavigator();

export default function RecipeStack() {
  // const { isAdmin } = useContext(AuthContext);

  const { isAdmin } = useSelector((state) => ({
    isAdmin: state.userReducer.isAdmin,
  }));

  return (
    <Stack.Navigator
      initialRouteName="BreakfastRecipes"
      mode="modal"
      headerMode="none"
    >
      <Stack.Screen name="BreakfastRecipes" component={BreakfastRecipes} />
    </Stack.Navigator>
  );
}
