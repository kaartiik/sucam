export const actions = {
  LOGIN: {
    REQUEST: 'LOGIN_REQUEST',
    ANON_REQUEST: 'LOGIN_ANON_REQUEST',
  },
  LOGOUT: {
    REQUEST: 'LOGOUT_REQUEST',
  },
  SYNC_USER: 'SYNC_USER',
  PUT: {
    USER: 'PUT_USER',
    USER_NAME: 'USER_NAME',
    USER_PHONE: 'USER_PHONE',
    USER_PROFILE: 'PUT_USER_PROFILE',
    LOADING_STATUS: 'PUT_LOADING_STATUS',
    ALL_COMMENTS: 'PUT_ALL_COMMENTS',
    LOGOUT_REQUEST: 'PUT_LOGOUT_REQUEST',
  },
  UPDATE: {
    USER_PROFILE: 'UPDATE_USER_PROFILE',
  },
  UPLOAD_COMMENTS: 'UPLOAD_COMMENTS',
  GET_ALL_COMMENTS: 'GET_ALL_COMMENTS',
};

export const syncUser = () => ({
  type: actions.SYNC_USER,
});

export const login = ({ email, password }) => ({
  type: actions.LOGIN.REQUEST,
  email,
  password,
});

export const loginAnon = () => ({
  type: actions.LOGIN.ANON_REQUEST,
});

export const logout = () => ({
  type: actions.LOGOUT.REQUEST,
});

export const putLogout = () => ({
  type: actions.PUT.LOGOUT_REQUEST,
});

export const putUserProfile = (profile) => ({
  type: actions.PUT.USER_PROFILE,
  profile,
});

export const updateUserProfile = (uuid, name, phone, units) => ({
  type: actions.UPDATE.USER_PROFILE,
  payload: { uuid, name, phone, units },
});

export const putUser = (user) => ({
  type: actions.PUT.USER,
  user,
});

export const putUserName = (name) => ({
  type: actions.PUT.USER_NAME,
  payload: name,
});

export const putUserPhone = (phone) => ({
  type: actions.PUT.USER_PHONE,
  payload: phone,
});

export const uploadComments = (name, email, comments) => ({
  type: actions.UPLOAD_COMMENTS,
  payload: { name, email, comments },
});

export const getAllComments = () => ({
  type: actions.GET_ALL_COMMENTS,
});

export const putAllComments = (comments) => ({
  type: actions.PUT.ALL_COMMENTS,
  payload: comments,
});

export const putLoadingStatus = (isLoading) => ({
  type: actions.PUT.LOADING_STATUS,
  isLoading,
});
