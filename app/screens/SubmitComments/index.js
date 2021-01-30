import React, { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  TouchableOpacity,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import AppBar from '../../components/AppBar';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import LoadingIndicator from '../../components/LoadingIndicator';
import { uploadComments } from '../../providers/actions/User';
import colours from '../../providers/constants/colours';

const styles = StyleSheet.create({
  imagePreviewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 180,
    width: 240,
    margin: 5,
    backgroundColor: 'lightgrey',
    borderRadius: 4,
  },
  textboxContainer: {
    backgroundColor: colours.veryLightPink,
    borderRadius: 3,
    padding: 5,
  },
  imagePreview: {
    margin: 5,
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  componentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtn: {
    margin: 10,
    width: 170,
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 10,
  },
  regBtn: {
    margin: 10,
    width: 170,
    backgroundColor: colours.themeSecondary,
    borderRadius: 20,
    padding: 10,
  },
  postBtn: {
    margin: 10,
    width: 170,
    backgroundColor: colours.themePrimary,
    borderRadius: 20,
    padding: 10,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
  },
});

export default function SubmitComments({ route, navigation }) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  const fieldRefName = useRef();
  const fieldRefEmail = useRef();
  const fieldRefComment = useRef();

  const { isLoading } = useSelector((state) => ({
    isLoading: state.userReducer.isLoading,
  }));

  const clearText = () => {
    fieldRefName.current.clear();
    fieldRefEmail.current.clear();
    fieldRefComment.current.clear();
    setName('');
    setEmail('');
    setComment('');
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        clearText();
      };
    }, [])
  );

  const validatePost = async () => {
    if (name !== '' && email !== '' && comment !== '') {
      dispatch(uploadComments(name, email, comment));
    } else {
      alert(`All fields are required.`);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <AppBar />
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ScrollView>
          <View style={{ margin: 20 }}>
            <Text>Name</Text>
            <View style={styles.textboxContainer}>
              <TextInput
                ref={fieldRefName}
                value={name}
                onChangeText={(text) => setName(text)}
              />
            </View>

            <Text>Email</Text>
            <View style={styles.textboxContainer}>
              <TextInput
                caretHidden={true}
                ref={fieldRefEmail}
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>

            <Text>Comments</Text>
            <View style={styles.textboxContainer}>
              <TextInput
                ref={fieldRefComment}
                multiline
                value={comment}
                onChangeText={(text) => setComment(text)}
              />
            </View>
          </View>

          <View>
            <View style={styles.componentContainer}>
              <TouchableOpacity
                onPress={() => validatePost()}
                style={styles.postBtn}
              >
                <Text style={styles.btnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

SubmitComments.propTypes = {
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};
