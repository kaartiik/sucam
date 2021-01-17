import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import AppBar from '../../components/AppBar';
import LoadingIndicator from '../../components/LoadingIndicator';

import colours from '../../providers/constants/colours';

import { getAllComments } from '../../providers/actions/User';

const styles = StyleSheet.create({
  divider: {
    marginHorizontal: 16,
    height: 0.5,
    width: '100%',
    backgroundColor: colours.borderGrey,
    alignSelf: 'center',
  },
  commentsTxt: {
    marginVertical: 3,
    width: 220,
  },
  commentItem: {
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 6,
  },
  flatlistEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const RenderItem = ({ item }) => {
  return (
    <View style={styles.commentItem}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          style={{
            fontSize: 15,
          }}
        >
          {item.name.toUpperCase()}
        </Text>
        <Text>{item.created_at}</Text>
      </View>
      <Text style={styles.commentsTxt}>{item.email}</Text>
      <Text style={styles.commentsTxt}>{item.comments}</Text>
    </View>
  );
};

RenderItem.propTypes = {
  item: PropTypes.object.isRequired,
};

function AllComments({ navigation }) {
  const dispatch = useDispatch();

  const { allComments, isLoading } = useSelector((state) => ({
    allComments: state.userReducer.allComments,
    isLoading: state.userReducer.isLoading,
  }));

  useFocusEffect(
    useCallback(() => {
      dispatch(getAllComments());
      return () => {
        dispatch(getAllComments());
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
          data={allComments}
          ListHeaderComponent={() => (
            <View style={{ padding: 10 }}>
              <Text style={{ fontSize: 18 }}>Comments</Text>

              <View style={styles.divider} />
            </View>
          )}
          renderItem={({ item, index }) => (
            <RenderItem key={index} item={item} />
          )}
          ListEmptyComponent={
            <View style={styles.flatlistEmptyContainer}>
              <Text>No comments yet :(</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

export default AllComments;
