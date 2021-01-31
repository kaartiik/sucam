export const actions = {
  GET: {
    RECIPES: 'GET_RECIPES',
    REFRESHED_RECIPES: 'REFRESHED_RECIPES',
    BREAKFAST_RECIPES: 'GET_BREAKFAST_RECIPES',
    LUNCH_RECIPES: 'GET_LUNCH_RECIPES',
    DINNER_RECIPES: 'GET_DINNER_RECIPES',
  },
  PUT: {
    RECIPES: 'PUT_RECIPES',
    BREAKFAST_RECIPES: 'PUT_BREAKFAST_RECIPES',
    LUNCH_RECIPES: 'PUT_LUNCH_RECIPES',
    DINNER_RECIPES: 'PUT_DINNER_RECIPES',
    RECIPE_PHOTOS: 'PUT_RECIPE_PHOTOS',
    LOADING_STATUS: 'PUT_LOADING_STATUS',
  },
  UPLOAD: {
    RECIPES_IMAGES: 'UPLOAD_RECIPES_WITH_IMAGES',
    EDITED_RECIPES_IMAGES: 'UPLOAD_EDITED_RECIPES_WITH_IMAGES',
  },
  DELETE: {
    RECIPES: 'DELETE_RECIPES',
    SINGLE_RECIPES_IMAGE: 'SINGLE_RECIPES_IMAGE',
    IMAGE: 'DELETE_IMAGE',
  },
};

export const deleteEditedImage = (recipeUuid, recipeType, imageName) => ({
  type: actions.DELETE.IMAGE,
  payload: { recipeUuid, recipeType, imageName },
});

export const putRecipePhotos = (photos) => ({
  type: actions.PUT.RECIPE_PHOTOS,
  payload: photos,
});

export const getRecipes = () => ({
  type: actions.GET.RECIPES,
});

export const getBreakfastRecipes = () => ({
  type: actions.GET.BREAKFAST_RECIPES,
});

export const getLunchRecipes = () => ({
  type: actions.GET.LUNCH_RECIPES,
});

export const getDinnerRecipes = () => ({
  type: actions.GET.DINNER_RECIPES,
});

export const getRefreshedRecipes = () => ({
  type: actions.GET.REFRESHED_RECIPES,
});

export const putRecipes = (recipes) => ({
  type: actions.PUT.RECIPES,
  payload: recipes,
});

export const putBreakfastRecipes = (recipes) => ({
  type: actions.PUT.BREAKFAST_RECIPES,
  payload: recipes,
});

export const putLunchRecipes = (recipes) => ({
  type: actions.PUT.LUNCH_RECIPES,
  payload: recipes,
});

export const putDinnerRecipes = (recipes) => ({
  type: actions.PUT.DINNER_RECIPES,
  payload: recipes,
});

export const uploadRecipeWithImages = (
  recipeType,
  title,
  ingredients,
  description,
  videoURL,
  postImages,
  ingrImages
) => ({
  type: actions.UPLOAD.RECIPES_IMAGES,
  payload: {
    recipeType,
    title,
    description,
    ingredients,
    videoURL,
    postImages,
    ingrImages,
  },
});

export const uploadEditedRecipeWithImages = (
  recipeUuid,
  recipeType,
  title,
  ingredients,
  description,
  videoURL,
  postImages,
  ingrImages,
  onSuccess
) => ({
  type: actions.UPLOAD.EDITED_RECIPES_IMAGES,
  payload: {
    recipeUuid,
    recipeType,
    title,
    description,
    ingredients,
    videoURL,
    postImages,
    ingrImages,
    onSuccess,
  },
});

export const deleteRecipe = (recipeUuid, recipeType, imageName) => ({
  type: actions.DELETE.RECIPES,
  payload: { recipeUuid, recipeType, imageName },
});

export const putLoadingStatus = (isLoading) => ({
  type: actions.PUT.LOADING_STATUS,
  isLoading,
});
