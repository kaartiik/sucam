/* eslint-disable no-alert */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable camelcase */
/* eslint-disable no-console */
import {
  call,
  put,
  take,
  select,
  takeLatest,
  all,
  fork,
} from 'redux-saga/effects';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import rsf, { database } from '../../providers/config';
import {
  actions,
  putRecipes,
  putBreakfastRecipes,
  putLunchRecipes,
  putDinnerRecipes,
  putLoadingStatus,
  getBreakfastRecipes,
} from '../actions/Recipes';

dayjs.extend(customParseFormat);

const fetchNewPostKey = () => database.ref('recipes').push().key;

const fetchRefreshedPosts = () =>
  database
    .ref('posts')
    .once('value')
    .then((snapshot) => ({ postsData: snapshot.val() || {} }));

const formatPost = async (data) => {
  const {
    recipe_title,
    recipe_ingredients,
    recipe_description,
    recipe_uid,
    recipe_type,
    recipe_video_url,
    created_at,
    is_image,
    image,
    ingr_images,
  } = data;

  const ingrImgsArr =
    ingr_images !== null && ingr_images !== undefined
      ? Object.values(ingr_images)
      : [];

  const ingrFormattedImgs = ingrImgsArr.map((img) => ({
    imgId: img.image_name,
    imgUri: img.image_url,
  }));

  const ingrPromise = await Promise.all(ingrFormattedImgs);
  console.log(ingrPromise);

  return {
    image,
    rImages: ingrPromise,
    rTitle: recipe_title,
    rIngr: recipe_ingredients,
    rDescr: recipe_description,
    rUid: recipe_uid,
    rType: recipe_type,
    rURL: recipe_video_url,
    rTime: dayjs(created_at).format('DD MMMM YYYY'),
    rImage: is_image,
  };
};

function* getRecipesSaga() {
  yield put(putLoadingStatus(true));
  try {
    const data = yield call(rsf.database.read, 'recipes');
    const exists = data !== null && data !== undefined;
    if (exists) {
      const recipesUnformattedArr = Object.values(data);

      const recipesArr = yield all(
        recipesUnformattedArr.map(function* (item) {
          const recipeObject = yield call(formatPost, item);
          return recipeObject;
        })
      );
      yield put(putRecipes(recipesArr));
      yield put(putLoadingStatus(false));
    }
    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error retrieving recipes. ${error}`);
  }
}

function* getBreakfastRecipesSaga() {
  yield put(putLoadingStatus(true));
  try {
    const data = yield call(rsf.database.read, 'breakfast_recipes');
    const exists = data !== null && data !== undefined;
    if (exists) {
      const recipesUnformattedArr = Object.values(data);

      const recipesArr = yield all(
        recipesUnformattedArr.map(function* (item) {
          const recipeObject = yield call(formatPost, item);
          return recipeObject;
        })
      );
      yield put(putBreakfastRecipes(recipesArr));
      yield put(putLoadingStatus(false));
    }
    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error retrieving recipes. ${error}`);
  }
}

function* getLunchRecipesSaga() {
  yield put(putLoadingStatus(true));
  try {
    const data = yield call(rsf.database.read, 'lunch_recipes');
    const exists = data !== null && data !== undefined;
    if (exists) {
      const recipesUnformattedArr = Object.values(data);

      const recipesArr = yield all(
        recipesUnformattedArr.map(function* (item) {
          const recipeObject = yield call(formatPost, item);
          return recipeObject;
        })
      );
      yield put(putLunchRecipes(recipesArr));
      yield put(putLoadingStatus(false));
    }
    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error retrieving recipes. ${error}`);
  }
}

function* getDinnerRecipesSaga() {
  yield put(putLoadingStatus(true));
  try {
    const data = yield call(rsf.database.read, 'dinner_recipes');
    const exists = data !== null && data !== undefined;
    if (exists) {
      const recipesUnformattedArr = Object.values(data);

      const recipesArr = yield all(
        recipesUnformattedArr.map(function* (item) {
          const recipeObject = yield call(formatPost, item);
          return recipeObject;
        })
      );
      yield put(putDinnerRecipes(recipesArr));
      yield put(putLoadingStatus(false));
    }
    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error retrieving recipes. ${error}`);
  }
}

function* getRefreshedPostsSaga() {
  yield put(putLoadingStatus(true));
  try {
    const { postsData } = yield call(fetchRefreshedPosts);
    const exists = postsData !== null;
    if (exists) {
      const postsUnformattedArr = Object.values(postsData);

      const postsArr = yield all(
        postsUnformattedArr.map(function* (data) {
          const {
            userData: { name, avatar },
          } = yield call(getPostUserDetails, data.user_uid);
          const postObject = yield call(formatPost, { data, name, avatar });
          return postObject;
        })
      );
      yield put(putPosts(postsArr));
      yield put(putLoadingStatus(false));
    }
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error retrieving new posts! ${error}`);
  }
}

function* postImagesFunc(postKey, postImages) {
  let image = {};
  try {
    const urls = yield all(
      postImages.map(function* (postImg) {
        const re = /(?:\.([^.]+))?$/;
        const ext = re.exec(postImg.imgUri)[1];
        const currentFileType = ext;
        const response = yield fetch(postImg.imgUri);
        const blob = yield response.blob();
        const fileName = postImg.imgId;
        const fileNameWithExt = `${fileName}.${currentFileType}`;
        const filePath = `Recipes/${postKey}/${fileNameWithExt}`;

        const task = rsf.storage.uploadFile(filePath, blob);

        task.on('state_changed', (snapshot) => {
          const pct = (snapshot.bytesTransferred * 100) / snapshot.totalBytes;
        });

        // Wait for upload to complete
        yield task;

        const imageUrl = yield call(rsf.storage.getDownloadURL, filePath);

        image = {
          ...image,
          [`${fileName}`]: {
            image_name: fileNameWithExt,
            image_url: imageUrl,
          },
        };

        return imageUrl;
      })
    );

    if (urls.length > 0) {
      return image;
    }
  } catch (error) {
    yield put(putLoadingStatus(false));
    return error;
  }
}

function* uploadRecipeWithImagesSaga({ payload }) {
  const {
    recipeType,
    title,
    description,
    ingredients,
    videoURL,
    postImages,
    ingrImages,
  } = payload;
  yield put(putLoadingStatus(true));
  let image = {};
  let ingrImgs = {};

  const postKey = yield call(fetchNewPostKey);

  try {
    ingrImgs = yield call(postImagesFunc, postKey, ingrImages);

    const re = /(?:\.([^.]+))?$/;
    const ext = re.exec(postImages.imgUri)[1];
    const currentFileType = ext;
    const response = yield fetch(postImages.imgUri);
    const blob = yield response.blob();
    const fileName = postImages.imgId;
    const fileNameWithExt = `${fileName}.${currentFileType}`;
    const filePath = `Recipes/${postKey}/${fileNameWithExt}`;

    const task = rsf.storage.uploadFile(filePath, blob);

    task.on('state_changed', (snapshot) => {
      const pct = (snapshot.bytesTransferred * 100) / snapshot.totalBytes;
    });

    // Wait for upload to complete
    yield task;

    const imageUrl = yield call(rsf.storage.getDownloadURL, filePath);

    image = {
      image_name: fileNameWithExt,
      image_url: imageUrl,
    };
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error uploading post images! ${error}`);
    return;
  }

  const postObject = {
    image,
    ingr_images: ingrImgs,
    created_at: Date.now(),
    is_image: true,
    recipe_type: recipeType,
    recipe_description: description,
    recipe_title: title,
    recipe_ingredients: ingredients,
    recipe_uid: postKey,
    recipe_video_url: videoURL,
  };

  try {
    yield call(rsf.database.update, `recipes/${postKey}`, postObject);

    yield call(rsf.database.update, `${recipeType}/${postKey}`, postObject);
    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error uploading post! ${error}`);
  }
}

function* uploadEditedPostWithImagesSaga({ payload }) {
  const {
    recipeUuid,
    recipeType,
    title,
    description,
    ingredients,
    videoURL,
    postImages,
    ingrImages,
    onSuccess,
  } = payload;
  yield put(putLoadingStatus(true));

  let image = {};
  let ingrImgs = {};

  try {
    const toUploadIngrImages = ingrImages.filter((img) => {
      const encodedStr = img.imgId;
      const isHttps = encodedStr.indexOf('https');
      if (isHttps === -1) {
        return img;
      } else {
        const imgNameWithoutExt = img.imgId.split('.')[0];
        ingrImgs = {
          ...ingrImgs,
          [`${imgNameWithoutExt}`]: {
            image_name: img.imgId,
            image_url: img.imgUri,
          },
        };
      }
    });

    console.log(toUploadIngrImages);

    const newIngrImages = yield call(
      postImagesFunc,
      recipeUuid,
      toUploadIngrImages
    );

    ingrImgs = { ...ingrImgs, ...newIngrImages };

    const encodedStr = postImages.imgUri;
    const isHttps = encodedStr.indexOf('https');

    if (isHttps === -1) {
      const re = /(?:\.([^.]+))?$/;
      const ext = re.exec(postImages.imgUri)[1];
      const currentFileType = ext;
      const response = yield fetch(postImages.imgUri);
      const blob = yield response.blob();
      const fileName = postImages.imgId;
      const fileNameWithExt = `${fileName}.${currentFileType}`;
      const filePath = `Recipes/${recipeUuid}/${fileNameWithExt}`;

      const task = rsf.storage.uploadFile(filePath, blob);

      task.on('state_changed', (snapshot) => {
        const pct = (snapshot.bytesTransferred * 100) / snapshot.totalBytes;
      });

      // Wait for upload to complete
      yield task;

      const imageUrl = yield call(rsf.storage.getDownloadURL, filePath);

      image = {
        image_name: fileNameWithExt,
        image_url: imageUrl,
      };
    } else {
      image = {
        image_name: postImages.imgId,
        image_url: postImages.imgUri,
      };
    }
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error saving image. ${error}`);
    return;
  }

  const postObject = {
    image,
    ingr_images: ingrImgs,
    created_at: Date.now(),
    is_image: true,
    recipe_type: recipeType,
    recipe_description: description,
    recipe_title: title,
    recipe_ingredients: ingredients,
    recipe_uid: recipeUuid,
    recipe_video_url: videoURL,
  };

  try {
    yield call(rsf.database.update, `recipes/${recipeUuid}`, postObject);

    yield call(rsf.database.update, `${recipeType}/${recipeUuid}`, postObject);
    yield put(putLoadingStatus(false));
    onSuccess();
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error uploading post. ${error}`);
  }
}

function* deleteEditedImageSaga({ payload }) {
  const { recipeUuid, recipeType, imageName } = payload;
  const imgNameWithoutExt = imageName.split('.')[0];

  try {
    yield call(rsf.storage.deleteFile, `Recipes/${recipeUuid}/${imageName}`);
    yield call(
      rsf.database.delete,
      `recipes/${recipeUuid}/ingr_images/${imgNameWithoutExt}`
    );
    yield call(
      rsf.database.delete,
      `${recipeType}/${recipeUuid}/ingr_images/${imgNameWithoutExt}`
    );
    alert('Deleted image.');
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error deleting post image. ${error}`);
    return;
  }
}

function* deleteRecipeSaga({ payload }) {
  const { recipeUuid, recipeType, imageName } = payload;
  yield put(putLoadingStatus(true));
  // if (imageName !== undefined) {
  //   try {
  //     yield call(rsf.storage.deleteFile, `Recipes/${recipeUuid}/${imageName}`);
  //   } catch (error) {
  //     yield put(putLoadingStatus(false));
  //     alert(`Error deleting post image. ${error}`);
  //     return;
  //   }
  // }

  try {
    yield call(rsf.database.delete, `recipes/${recipeUuid}`);
    yield call(rsf.database.delete, `${recipeType}/${recipeUuid}`);

    if (recipeType === 'breakfast_recipes') {
      yield call(getBreakfastRecipes);
    } else if (recipeType === 'lunch_recipes') {
      yield call(getLunchRecipesSaga);
    } else if (recipeType === 'dinner_recipes') {
      yield call(getDinnerRecipesSaga);
    } else {
      yield call(getRecipesSaga);
    }

    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error deleting post! ${error}`);
  }
}

export default function* Recipes() {
  yield all([
    takeLatest(actions.GET.RECIPES, getRecipesSaga),
    takeLatest(actions.GET.BREAKFAST_RECIPES, getBreakfastRecipesSaga),
    takeLatest(actions.GET.LUNCH_RECIPES, getLunchRecipesSaga),
    takeLatest(actions.GET.DINNER_RECIPES, getDinnerRecipesSaga),
    takeLatest(actions.GET.REFRESHED_RECIPES, getRefreshedPostsSaga),
    takeLatest(actions.DELETE.RECIPES, deleteRecipeSaga),
    takeLatest(actions.UPLOAD.RECIPES_IMAGES, uploadRecipeWithImagesSaga),
    takeLatest(
      actions.UPLOAD.EDITED_RECIPES_IMAGES,
      uploadEditedPostWithImagesSaga
    ),
    takeLatest(actions.DELETE.IMAGE, deleteEditedImageSaga),
    // takeLatest(actions.UPLOAD.POST_IMAGES, deletePostSaga),
    //   takeEvery(actions.PROFILE.UPDATE, updateProfileSaga),
  ]);
}
