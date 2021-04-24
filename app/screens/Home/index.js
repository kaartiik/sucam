/* eslint-disable global-require */
import React from 'react';
import {
  Alert,
  TouchableOpacity,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import AppBar from '../../components/AppBar';
import colours from '../../providers/constants/colours';
import { View } from 'native-base';

const IMAGE_DIMENSION = 100;

const styles = StyleSheet.create({
  iconOuterContainer: {
    alignItems: 'center',
  },
  touchableContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 5,
  },
  imageContainer: {
    height: IMAGE_DIMENSION,
    width: IMAGE_DIMENSION,
  },
  textStyle: {
    fontWeight: 'bold',
  },
});

function Home({ navigation }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: 'white' }}
    >
      <AppBar />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={styles.iconOuterContainer}>
          <TouchableOpacity
            onPress={() => Linking.openURL('http://192.168.0.153:5000')}
            style={styles.touchableContainer}
          >
            <Image
              source={require('../../../assets/camera_icon.jpeg')}
              style={styles.imageContainer}
            />
          </TouchableOpacity>
          <Text style={styles.textStyle}>Live Feed</Text>
        </View>

        <View style={styles.iconOuterContainer}>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.dropbox.com')}
            style={styles.touchableContainer}
          >
            <Image
              source={require('../../../assets/picture_icon.jpeg')}
              style={styles.imageContainer}
            />
          </TouchableOpacity>
          <Text style={styles.textStyle}>Pictures</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default Home;
