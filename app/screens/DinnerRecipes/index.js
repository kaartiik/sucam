import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import AppBar from '../../components/AppBar';
import LoadingIndicator from '../../components/LoadingIndicator';

import colours from '../../providers/constants/colours';

import {
  getDinnerRecipes,
  deleteRecipe,
} from '../../providers/actions/Recipes';

const styles = StyleSheet.create({
  divider: {
    marginHorizontal: 16,
    height: 0.5,
    width: '100%',
    backgroundColor: colours.borderGrey,
    alignSelf: 'center',
  },
  recipeDescription: {
    marginVertical: 3,
    width: 220,
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 6,
  },
  previewImg: {
    height: 100,
    width: 100,
    resizeMode: 'cover',
    alignSelf: 'flex-start',
    borderRadius: 6,
  },
  flatlistEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const RenderItem = ({ item, navigation, isAdmin }) => {
  const dispatch = useDispatch();

  return (
    <View style={{ marginTop: 10, padding: 10 }}>
      <TouchableOpacity
        style={styles.recipeItem}
        onPress={() => navigation.navigate('Recipe', { recipeItem: item })}
      >
        <Image
          source={{ uri: item.image.image_url }}
          style={styles.previewImg}
        />
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              fontSize: 15,
              color: colours.lightBlue,
              marginVertical: 3,
            }}
          >
            {item.rTitle.toUpperCase()}
          </Text>
          <Text style={styles.recipeDescription}>{item.rTime}</Text>
        </View>

        {isAdmin && (
          <TouchableOpacity
            onPress={() =>
              dispatch(
                deleteRecipe(item.rUid, item.rType, item.image.image_name)
              )
            }
          >
            <Ionicons name="ios-trash" size={25} color="red" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

RenderItem.propTypes = {
  item: PropTypes.object.isRequired,
};

function DinnerRecipes({ navigation }) {
  const dispatch = useDispatch();

  const { isAdmin, dinnerRecipes, isLoading } = useSelector((state) => ({
    isAdmin: state.userReducer.isAdmin,
    dinnerRecipes: state.recipeReducer.dinnerRecipes,
    isLoading: state.recipeReducer.isLoading,
  }));

  useFocusEffect(
    useCallback(() => {
      dispatch(getDinnerRecipes());
      return () => {
        dispatch(getDinnerRecipes());
      };
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <AppBar />

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={dinnerRecipes}
          ListHeaderComponent={() => (
            <View style={{ padding: 10 }}>
              <Text style={{ fontSize: 18 }}>Dinner Recipes</Text>

              <View style={styles.divider} />
            </View>
          )}
          renderItem={({ item, index }) => (
            <RenderItem
              key={index}
              item={item}
              navigation={navigation}
              isAdmin={isAdmin}
            />
          )}
          ListEmptyComponent={
            <View style={styles.flatlistEmptyContainer}>
              <Text>No recipes yet :(</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

export default DinnerRecipes;
