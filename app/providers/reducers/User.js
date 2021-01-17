import { actions } from '../actions/User';

const initialState = {
  name: '',
  email: '',
  uuid: '',
  role: '',
  isAdmin: false,
  isSuccess: false,
  allComments: [],
  isLoading: false,
};

export default function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.PUT.USER_PROFILE: {
      const { uuid, name, email, role } = action.profile;
      return {
        ...state,
        name,
        email,
        uuid,
        role,
        isAdmin: role === 'admin' ? true : false,
      };
    }

    case actions.PUT.ALL_COMMENTS:
      return {
        ...state,
        allComments: action.payload,
      };

    case actions.PUT.LOADING_STATUS:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    default:
      return state;
  }
}
