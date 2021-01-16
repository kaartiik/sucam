import React, { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  Platform,
  StyleSheet,
} from 'react-native';
import { Picker, Header, Left, Body, Right } from 'native-base';
import PropTypes from 'prop-types';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import AppBar from '../../components/AppBar';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import LoadingIndicator from '../../components/LoadingIndicator';
import { uploadEditedRecipeWithImages } from '../../providers/actions/Recipes';
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

export default function EditRecipe({ route, navigation }) {
  const recipeItem = route.params;
  const dispatch = useDispatch();
  const [recipeUuid] = useState(recipeItem ? recipeItem.rUid : '');
  const [imageSelected, setImageSelected] = useState(
    recipeItem ? recipeItem.rImage : false
  );
  const [recipeType, setRecipeType] = useState(
    recipeItem ? recipeItem.rType : 'breakfast_recipes'
  );
  const [title, setTitle] = useState(recipeItem ? recipeItem.rTitle : '');
  const [ingredients, setIngredients] = useState(
    recipeItem ? recipeItem.rIngr : ''
  );
  const [description, setDescription] = useState(
    recipeItem ? recipeItem.rDescr : ''
  );
  const [progress, setProgress] = useState(0);
  const [camera, setCamera] = useState('');
  const [cameraRoll, setCameraRoll] = useState('');
  const [imgUriArr, setImgUriArr] = useState(
    recipeItem
      ? {
          imgId: recipeItem.image.image_name,
          imgUri: recipeItem.image.image_url,
        }
      : null
  );
  const [videoURL, setVideoURL] = useState(recipeItem ? recipeItem.rURL : '');

  const fieldRefTitle = useRef();
  const fieldRefIngr = useRef();
  const fieldRefDescr = useRef();
  const fieldRefURL = useRef();

  const { isLoading } = useSelector((state) => ({
    isLoading: state.recipeReducer.isLoading,
  }));

  const clearText = () => {
    fieldRefTitle.current.clear();
    fieldRefIngr.current.clear();
    fieldRefDescr.current.clear();
    fieldRefURL.current.clear();
    setTitle('');
    setIngredients('');
    setDescription('');
    setVideoURL('');
    setImgUriArr(null);
    setImageSelected(false);
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        clearText();
      };
    }, [])
  );

  const checkPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setCamera(status);

    const { status: statusRoll } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    setCameraRoll(statusRoll);
  };

  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  const uniqueId = () => {
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}-${s4()}-${s4()}`;
  };

  const findNewImage = async () => {
    checkPermissions().then(async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
        quality: 1,
      });

      if (!result.cancelled) {
        setImgUriArr({
          imgUri: result.uri,
          imgId: uniqueId(),
        });
        setImageSelected(true);
      }
    });
  };

  const validatePost = async () => {
    if (
      imageSelected &&
      title !== '' &&
      ingredients !== '' &&
      description !== ''
    ) {
      dispatch(
        uploadEditedRecipeWithImages(
          recipeUuid,
          recipeType,
          title,
          ingredients,
          description,
          videoURL,
          imgUriArr,
          () => navigation.goBack()
        )
      );
    } else {
      alert(`all fields are required.`);
    }
  };

  const RenderImg = () => {
    return (
      <View style={styles.imagePreviewContainer}>
        <Image source={{ uri: imgUriArr.imgUri }} style={styles.imagePreview} />
        <TouchableOpacity style={{ position: 'absolute', bottom: 0, right: 0 }}>
          <Ionicons
            style={{ padding: 10 }}
            name="ios-trash"
            size={22}
            color="red"
            onPress={() => {
              setImageSelected(false);
              setImgUriArr(null);
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
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
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="ios-arrow-back" size={20} color="white" />
        </TouchableOpacity>

        <Body style={{ marginLeft: 15 }}>
          <Text style={{ fontSize: 20, color: 'white' }}>Edit Recipe</Text>
        </Body>
      </Header>
      {isLoading ? (
        <LoadingIndicator progress={progress} />
      ) : (
        <ScrollView>
          {imageSelected && <RenderImg />}

          <Picker
            style={{ width: '50%', alignSelf: 'center' }}
            selectedValue={recipeType}
            onValueChange={(value) => setRecipeType(value)}
          >
            <Picker.Item label="Breakfast" value="breakfast_recipes" />
            <Picker.Item label="Lunch" value="lunch_recipes" />
            <Picker.Item label="Dinner" value="dinner_recipes" />
          </Picker>

          <View style={{ margin: 20 }}>
            <Text>Title</Text>
            <View
              style={{
                backgroundColor: colours.veryLightPink,
                borderRadius: 3,
                padding: 5,
              }}
            >
              <TextInput
                ref={fieldRefTitle}
                value={title}
                onChangeText={(text) => setTitle(text)}
              />
            </View>

            <Text>Ingredients</Text>
            <View
              style={{
                backgroundColor: colours.veryLightPink,
                borderRadius: 3,
                padding: 5,
              }}
            >
              <TextInput
                ref={fieldRefIngr}
                multiline
                value={ingredients}
                onChangeText={(text) => setIngredients(text)}
              />
            </View>

            <Text>Description</Text>
            <View
              style={{
                backgroundColor: colours.veryLightPink,
                borderRadius: 3,
                padding: 5,
              }}
            >
              <TextInput
                ref={fieldRefDescr}
                multiline
                value={description}
                onChangeText={(text) => setDescription(text)}
              />
            </View>

            <Text>Video URL</Text>
            <View style={styles.textboxContainer}>
              <TextInput
                ref={fieldRefURL}
                value={videoURL}
                onChangeText={(text) => setVideoURL(text)}
              />
            </View>
          </View>

          <View>
            <View style={styles.componentContainer}>
              <TouchableOpacity
                onPress={() => findNewImage()}
                style={styles.regBtn}
              >
                <Text style={styles.btnText}>
                  {imageSelected ? `Change Image` : `Add Image`}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={
                  imageSelected &&
                  title !== '' &&
                  ingredients !== '' &&
                  description !== ''
                    ? false
                    : true
                }
                onPress={() => validatePost()}
                style={styles.postBtn}
              >
                <Text style={styles.btnText}>Update Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

EditRecipe.propTypes = {
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};
