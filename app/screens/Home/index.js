/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import {
  Alert,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardItem } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import AppBar from '../../components/AppBar';
import LoadingIndicator from '../../components/LoadingIndicator';
import colours from '../../providers/constants/colours';

const styles = StyleSheet.create({
  navContainer: {
    flex: 1,
    backgroundColor: colours.themePrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconTitle: { fontFamily: 'sans-serif-light', fontSize: 18, color: 'white' },
  previewBGImg: {
    opacity: 0.5,
    height: 200,
    width: 200,
    resizeMode: 'contain',
  },
  previewBGImgFull: {
    opacity: 0.5,
    height: 200,
    width: '100%',
    resizeMode: 'contain',
  },
});

const NavIcons = ({ navigation }) => (
  <View style={styles.navContainer}>
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('BreakfastRecipes')}
        style={{ marginRight: 20, alignItems: 'center' }}
      >
        <Image
          source={require('../../../assets/breakfast.png')}
          style={{ height: 80, width: 80 }}
        />
        <Text style={styles.iconTitle}>Breakfast</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginLeft: 20, alignItems: 'center' }}>
        <Image
          source={require('../../../assets/lunch.png')}
          style={{ height: 80, width: 80 }}
        />
        <Text style={styles.iconTitle}>Lunch</Text>
      </TouchableOpacity>
    </View>

    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity style={{ alignItems: 'center' }}>
        <Image
          source={require('../../../assets/dinner.png')}
          style={{ height: 80, width: 80 }}
        />
        <Text style={styles.iconTitle}>Dinner</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const RecipePreview = ({ feed }) => {
  if (feed.length === 1) {
    return (
      <TouchableOpacity>
        <ImageBackground
          source={{ uri: feed[0].image.image_url }}
          style={styles.previewBGImgFull}
        />
      </TouchableOpacity>
    );
  } else if (feed.length === 2) {
    return (
      <View>
        <TouchableOpacity>
          <ImageBackground
            source={{ uri: feed[0].image.image_url }}
            style={styles.previewBGImg}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <ImageBackground
            source={{ uri: feed[1].image.image_url }}
            style={styles.previewBGImg}
          />
        </TouchableOpacity>
      </View>
    );
  } else if (feed.length === 3) {
    return (
      <View>
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <TouchableOpacity>
            <ImageBackground
              source={{ uri: feed[0].image.image_url }}
              style={styles.previewBGImg}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <ImageBackground
              source={{ uri: feed[1].image.image_url }}
              style={styles.previewBGImg}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <ImageBackground
            source={{ uri: feed[2].image.image_url }}
            style={styles.previewBGImgFull}
          />
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity>
            <ImageBackground
              source={{ uri: feed[0].image.image_url }}
              style={styles.previewBGImg}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <ImageBackground
              source={{ uri: feed[1].image.image_url }}
              style={styles.previewBGImg}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity>
            <ImageBackground
              source={{ uri: feed[2].image.image_url }}
              style={styles.previewBGImg}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <ImageBackground
              source={{ uri: feed[3].image.image_url }}
              style={styles.previewBGImg}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

function Home({ navigation }) {
  const { recipeFeed } = useSelector((state) => ({
    recipeFeed: state.recipeReducer.recipeFeed,
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <AppBar />
      <ScrollView keyboardDismissMode="on-drag">
        <NavIcons navigation={navigation} />
        <RecipePreview feed={recipeFeed} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Home;
