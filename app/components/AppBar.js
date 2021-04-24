import React from 'react';
import { View, Text } from 'react-native';
import { Header, Left, Right, Body } from 'native-base';
import colours from '../providers/constants/colours';

const AppBar = () => {
  return (
    <View>
      <Header
        style={{
          backgroundColor: colours.themePrimary,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 8,
        }}
      >
        <Left />

        <Body>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Welcome!</Text>
        </Body>

        <Right />
      </Header>
    </View>
  );
};

export default AppBar;
