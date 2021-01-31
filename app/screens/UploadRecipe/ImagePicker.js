/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Header, Left, Body } from 'native-base';
import { useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import { ImageBrowser } from 'expo-image-picker-multiple';
import LoadingIndicator from '../../components/LoadingIndicator';

import { putRecipePhotos } from '../../providers/actions/Recipes';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    paddingTop: 25,
    position: 'relative',
  },
  emptyStay: {
    textAlign: 'center',
  },
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: 'absolute',
    right: 3,
    bottom: 3,
    justifyContent: 'center',
    backgroundColor: '#0580FF',
  },
  countBadgeText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 'auto',
    color: '#ffffff',
  },
});

const ImagePicker = ({ route, navigation }) => {
  const dispatch = useDispatch();

  const [camera, setCamera] = useState(null);
  const [cameraRoll, setCameraRoll] = useState(null);
  const [imageCount, setImageCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Permissions.getAsync(
        Permissions.CAMERA
      );
      const { status: cameraRollStatus } = await Permissions.getAsync(
        Permissions.MEDIA_LIBRARY
      );

      console.log(cameraStatus, cameraRollStatus);

      if (cameraStatus !== 'granted') {
        const { status: reStatus } = await Permissions.askAsync(
          Permissions.CAMERA
        );
        setCamera(reStatus);
      } else {
        setCamera(cameraStatus);
      }

      if (cameraRollStatus !== 'granted') {
        const { status: reStatus } = await Permissions.askAsync(
          Permissions.MEDIA_LIBRARY
        );
        setCameraRoll(reStatus);
      } else {
        setCameraRoll(cameraRollStatus);
      }
    })();
  }, []);

  // const processImageAsync = async (uri) => {
  //   const file = await ImageManipulator.manipulateAsync(
  //     uri,
  //     [{ resize: { width: 1000 } }],
  //     { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG },
  //   );
  //   return file;
  // };

  const imagesCallback = (callback) => {
    callback
      .then((photos) => {
        dispatch(putRecipePhotos(photos));
        // console.log(photos);
      })
      .catch((e) => alert(`Error. Please try again.`))
      .finally(() => console.log('finally'));
  };

  const updateHandler = (count, onSubmit) => {
    setImageCount(count);
  };

  const renderSelectedComponent = (number) => (
    <View style={styles.countBadge}>
      <Text style={styles.countBadgeText}>{number}</Text>
    </View>
  );

  const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>;
  const noCameraPermissionComponent = (
    <Text style={styles.emptyStay}>No access to camera</Text>
  );

  return (
    <View style={[styles.flex, styles.container]}>
      <Header transparent>
        <Left>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
        </Left>
        <Body>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            Selected {imageCount} image(s)
          </Text>
        </Body>
      </Header>

      <ImageBrowser
        max={5} // Maximum number of pickable image. default is None
        headerCloseText={'キャンセル'} // Close button text on header. default is 'Close'.
        headerDoneText={'　　完了'} // Done button text on header. default is 'Done'.
        headerButtonColor={'#E31676'} // Button color on header.
        headerSelectText={'枚の画像を選択中'} // Word when picking.  default is 'n selected'.
        mediaSubtype={'screenshot'} // Only iOS, Filter by MediaSubtype. default is display all.
        badgeColor={'#E31676'} // Badge color when picking.
        emptyText={'選択できる画像がありません'} // Empty Text
        callback={imagesCallback}
      />

      {/* <ImageBrowser
          max={4}
          onChange={updateHandler}
          callback={imagesCallback}
          renderSelectedComponent={renderSelectedComponent}
          emptyStayComponent={emptyStayComponent}
          noCameraPermissionComponent={noCameraPermissionComponent}
        /> */}
    </View>
  );
};

export default ImagePicker;
