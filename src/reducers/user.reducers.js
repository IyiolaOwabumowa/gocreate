import { userConstants } from "../constants/userConstants";

const initialState = {
  artist: {
    bvn_verified: null,
    phone_verified: null,
    dp: { id: null, image: null },
    first_name: null,
    loading: true,
  },
  mode: "light",
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case userConstants.SET_APPEARANCE:
      return {
        ...state,
        mode: action.mode,
      };

    case userConstants.GET_ARTIST:
      return {
        ...state,
        artist: action.artist.data,
        loading: false,
      };

    case userConstants.GET_ARTIST_FAILURE:
      return {
        ...state,
        authorized: action.authorized,
        loading: false,
      };
    case userConstants.DELETE_ARTIST:
      return {
        ...state,
        token: null,
      };
    case userConstants.SAVE_ARTIST:
      return {
        ...state,
        artist: action.artist,
      };

    case userConstants.UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case userConstants.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        toastMessage: action.toastMessage,
        loading: false,
      };
    case userConstants.UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false,
      };

    case userConstants.UPDATE_DP_REQUEST:
      return {
        ...state,
      };

    case userConstants.UPDATE_DP_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case userConstants.UPDATE_DP_SUCCESS:
      return {
        ...state,
      };

    case userConstants.CLEAR_TOAST:
      return {
        ...state,
        toastMessage: null,
      };
    default:
      return state;
  }
}
