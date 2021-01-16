import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { useSelector } from 'react-redux';
import BreakfastRecipes from '../screens/BreakfastRecipes';
import LunchRecipes from '../screens/LunchRecipes';
import DinnerRecipes from '../screens/DinnerRecipes';

const Stack = createStackNavigator();

export default function RecipeStack() {
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
      <Stack.Screen name="LunchRecipes" component={LunchRecipes} />
      <Stack.Screen name="DinnerRecipes" component={DinnerRecipes} />
    </Stack.Navigator>
  );
}
