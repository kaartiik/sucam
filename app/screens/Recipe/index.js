/* eslint-disable global-require */
import React, { useState, useEffect, useRef } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Animated,
  FlatList,
  Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardItem } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import AppBar from '../../components/AppBar';
import LoadingIndicator from '../../components/LoadingIndicator';
import colours from '../../providers/constants/colours';
import ImageEnlargeViewer from '../../components/ImageViewer';

const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const styles = StyleSheet.create({
  saveArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#402583',
    backgroundColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 1,
    borderRadius: 10,
    marginHorizontal: 12,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colours.themePrimary,
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  topBar: {
    flexDirection: 'row',
    marginTop: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: 'white',
    fontSize: 20,
  },
  avatar: {
    height: 54,
    width: 54,
    resizeMode: 'contain',
    borderRadius: 54 / 2,
  },
  fullNameText: {
    fontSize: 16,
    marginLeft: 24,
  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    padding: 10,
    borderRadius: 4,
    backgroundColor: colours.veryLightPink,
  },
  subHeader: { fontSize: 15, fontWeight: 'bold' },
  descriptionText: { fontSize: 15 },
  spacingComponent: { marginVertical: 10 },
  imagePreviewContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 90,
    width: 120,
    margin: 5,
    backgroundColor: 'lightgrey',
    borderRadius: 4,
  },
  imagePreview: {
    margin: 5,
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
});

function Recipe({ route, navigation }) {
  const { recipeItem } = route.params;
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(-1);

  const { isAdmin } = useSelector((state) => ({
    isAdmin: state.userReducer.isAdmin,
  }));

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0.9],
    extrapolate: 'clamp',
  });
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, -8],
    extrapolate: 'clamp',
  });

  const renderImages = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        setImgIndex(index);
        setIsImgModalOpen(true);
      }}
      style={styles.imagePreviewContainer2}
    >
      <Image source={{ uri: item.imgUri }} style={styles.imagePreview} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.saveArea}>
      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: HEADER_MAX_HEIGHT + 10,
          padding: 10,
        }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <FlatList
          horizontal
          data={recipeItem.rImages}
          renderItem={renderImages}
        />

        <Text style={styles.subHeader}>Ingredients</Text>

        <Text style={styles.descriptionText}>{recipeItem.rIngr}</Text>

        <View style={styles.spacingComponent} />

        <Text style={styles.subHeader}>Steps</Text>

        <Text style={styles.descriptionText}>{recipeItem.rDescr}</Text>

        {recipeItem.rURL !== '' && (
          <>
            <View style={styles.spacingComponent} />

            <Text style={styles.subHeader}>Video</Text>
            <WebView
              source={{ uri: recipeItem.rURL }}
              style={{
                height: 200,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </>
        )}

        {isAdmin && (
          <TouchableOpacity
            onPress={() => navigation.navigate('EditRecipe', recipeItem)}
            style={styles.editButton}
          >
            <Text>Edit</Text>
          </TouchableOpacity>
        )}
      </Animated.ScrollView>
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslateY }] },
        ]}
      >
        <Animated.Image
          style={[
            styles.headerBackground,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslateY }],
            },
          ]}
          source={{
            uri: recipeItem.image.image_url,
          }}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.topBar,
          {
            transform: [{ scale: titleScale }, { translateY: titleTranslateY }],
          },
        ]}
      >
        <Ionicons
          name="ios-arrow-back"
          size={20}
          color="white"
          style={{ position: 'absolute', left: 1, marginLeft: 5 }}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>{recipeItem.rTitle}</Text>
      </Animated.View>
      <ImageEnlargeViewer
        index={imgIndex}
        images={recipeItem.rImages2}
        isImgModalOpen={isImgModalOpen}
        setIsImgModalOpen={setIsImgModalOpen}
      />
    </SafeAreaView>
  );
}

export default Recipe;
