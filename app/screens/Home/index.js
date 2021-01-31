/* eslint-disable global-require */
import React, { useState, useCallback } from 'react';
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
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardItem } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import AppBar from '../../components/AppBar';
import LoadingIndicator from '../../components/LoadingIndicator';
import colours from '../../providers/constants/colours';

import { getRecipes } from '../../providers/actions/Recipes';

const SCREEN_WIDTH = Dimensions.get('window').width;

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
    width: SCREEN_WIDTH / 2,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBGImgFull: {
    opacity: 0.5,
    height: 200,
    width: '100%',
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipePreviewText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    flexWrap: 'wrap',
    margin: 5,
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

      <TouchableOpacity
        onPress={() => navigation.navigate('LunchRecipes')}
        style={{ marginLeft: 20, alignItems: 'center' }}
      >
        <Image
          source={require('../../../assets/lunch.png')}
          style={{ height: 80, width: 80 }}
        />
        <Text style={styles.iconTitle}>Lunch</Text>
      </TouchableOpacity>
    </View>

    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('DinnerRecipes')}
        style={{ alignItems: 'center' }}
      >
        <Image
          source={require('../../../assets/dinner.png')}
          style={{ height: 80, width: 80 }}
        />
        <Text style={styles.iconTitle}>Dinner</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const RecipePreview = ({ feed, navigation }) => {
  if (feed.length === 1) {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Recipe', { recipeItem: feed[0] })}
      >
        <ImageBackground
          source={{ uri: feed[0].image.image_url }}
          style={styles.previewBGImgFull}
        >
          <Text style={styles.recipePreviewText}>{feed[0].rTitle}</Text>
          <Text style={styles.recipePreviewText}>{feed[0].rTime}</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  } else if (feed.length === 2) {
    return (
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Recipe', { recipeItem: feed[0] })}
        >
          <ImageBackground
            source={{ uri: feed[0].image.image_url }}
            style={styles.previewBGImgFull}
          >
            <Text style={styles.recipePreviewText}>{feed[0].rTitle}</Text>
            <Text style={styles.recipePreviewText}>{feed[0].rTime}</Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Recipe', { recipeItem: feed[1] })}
        >
          <ImageBackground
            source={{ uri: feed[1].image.image_url }}
            style={styles.previewBGImgFull}
          >
            <Text style={styles.recipePreviewText}>{feed[1].rTitle}</Text>
            <Text style={styles.recipePreviewText}>{feed[1].rTime}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  } else if (feed.length === 3) {
    return (
      <View>
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Recipe', { recipeItem: feed[0] })
            }
          >
            <ImageBackground
              source={{ uri: feed[0].image.image_url }}
              style={styles.previewBGImg}
            >
              <Text style={styles.recipePreviewText}>{feed[0].rTitle}</Text>
              <Text style={styles.recipePreviewText}>{feed[0].rTime}</Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Recipe', { recipeItem: feed[1] })
            }
          >
            <ImageBackground
              source={{ uri: feed[1].image.image_url }}
              style={styles.previewBGImg}
            >
              <Text style={styles.recipePreviewText}>{feed[1].rTitle}</Text>
              <Text style={styles.recipePreviewText}>{feed[1].rTime}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Recipe', { recipeItem: feed[2] })}
        >
          <ImageBackground
            source={{ uri: feed[2].image.image_url }}
            style={styles.previewBGImgFull}
          >
            <Text style={styles.recipePreviewText}>{feed[2].rTitle}</Text>
            <Text style={styles.recipePreviewText}>{feed[2].rTime}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  } else if (feed.length > 3) {
    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Recipe', { recipeItem: feed[0] })
            }
          >
            <ImageBackground
              source={{ uri: feed[0].image.image_url }}
              style={styles.previewBGImg}
            >
              <Text style={styles.recipePreviewText}>{feed[0].rTitle}</Text>
              <Text style={styles.recipePreviewText}>{feed[0].rTime}</Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Recipe', { recipeItem: feed[1] })
            }
          >
            <ImageBackground
              source={{ uri: feed[1].image.image_url }}
              style={styles.previewBGImg}
            >
              <Text style={styles.recipePreviewText}>{feed[1].rTitle}</Text>
              <Text style={styles.recipePreviewText}>{feed[1].rTime}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Recipe', { recipeItem: feed[2] })
            }
          >
            <ImageBackground
              source={{ uri: feed[2].image.image_url }}
              style={styles.previewBGImg}
            >
              <Text style={styles.recipePreviewText}>{feed[2].rTitle}</Text>
              <Text style={styles.recipePreviewText}>{feed[2].rTime}</Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Recipe', { recipeItem: feed[3] })
            }
          >
            <ImageBackground
              source={{ uri: feed[3].image.image_url }}
              style={styles.previewBGImg}
            >
              <Text style={styles.recipePreviewText}>{feed[3].rTitle}</Text>
              <Text style={styles.recipePreviewText}>{feed[3].rTime}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return <View />;
  }
};

function Home({ navigation }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const { recipeFeed, isLoading } = useSelector((state) => ({
    recipeFeed: state.recipeReducer.recipeFeed,
    isLoading: state.recipeReducer.isLoading,
  }));

  setTimeout(() => {
    setLoading(isLoading);
  }, 2000);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      if (active) {
        const subscribe = dispatch(getRecipes());
      }
      return () => (active = false);
    }, [])
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <AppBar />

      {loading ? (
        <LoadingIndicator />
      ) : (
        <ScrollView keyboardDismissMode="on-drag">
          <NavIcons navigation={navigation} />
          <RecipePreview feed={recipeFeed} navigation={navigation} />
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

export default Home;
