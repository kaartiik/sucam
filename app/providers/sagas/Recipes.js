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

const formatPost = (data) => {
  const {
    recipe_title,
    recipe_ingredients,
    recipe_description,
    recipe_uid,
    recipe_type,
    created_at,
    is_image,
    image,
  } = data;
  return {
    image,
    rTitle: recipe_title,
    rIngr: recipe_ingredients,
    rDescr: recipe_description,
    rUid: recipe_uid,
    rType: recipe_type,
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
      const recipesUnformattedArr = Object.values(postsData);

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
      const recipesUnformattedArr = Object.values(postsData);

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

function* uploadRecipeWithImagesSaga({ payload }) {
  const { recipeType, title, description, ingredients, postImages } = payload;
  yield put(putLoadingStatus(true));

  const postKey = yield call(fetchNewPostKey);
  let image = {};

  console.log(`post saga`);

  try {
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
      console.log(`${pct}%`);
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
    created_at: Date.now(),
    is_image: true,
    recipe_description: description,
    recipe_title: title,
    recipe_ingredients: ingredients,
    recipe_uid: postKey,
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
    postImages,
    onSuccess,
  } = payload;
  yield put(putLoadingStatus(true));

  let image = {};

  try {
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
    created_at: Date.now(),
    is_image: true,
    recipe_description: description,
    recipe_title: title,
    recipe_ingredients: ingredients,
    recipe_uid: recipeUuid,
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

function* deleteRecipeSaga({ payload }) {
  const { recipeUuid, recipeType, imageName } = payload;
  yield put(putLoadingStatus(true));
  if (imageName !== undefined) {
    try {
      yield call(rsf.storage.deleteFile, `Recipes/${recipeUuid}/${imageName}`);
    } catch (error) {
      yield put(putLoadingStatus(false));
      alert(`Error deleting post image. ${error}`);
      return;
    }
  }

  try {
    yield call(rsf.database.delete, `recipes/${recipeUuid}`);
    yield call(rsf.database.delete, `${recipeType}/${recipeUuid}`);

    if (recipeType === 'breakfast_recipes') {
      yield call(getBreakfastRecipes);
    } else if (recipeType === 'lunch_recipes') {
      yield call(getLunchRecipesSaga);
    } else {
      yield call(getDinnerRecipesSaga);
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
    // takeLatest(actions.UPLOAD.POST_IMAGES, deletePostSaga),
    //   takeEvery(actions.PROFILE.UPDATE, updateProfileSaga),
  ]);
}
