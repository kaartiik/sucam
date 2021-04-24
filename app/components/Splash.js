import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import Logo from './Logo';
import LoadingIndicator from './LoadingIndicator';

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Splash = () => {
  return (
    <View style={style.container}>
      <LoadingIndicator />
    </View>
  );
};

export default Splash;
