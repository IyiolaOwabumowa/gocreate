import { songConstants } from "../constants/songConstants";

const initialState = { songs: null, loading: true };

export default function songReducer(state = initialState, action) {
  switch (action.type) {
    case songConstants.GET_SONG_REQUEST:
      return {
        ...state, 
      };

    case songConstants.GET_SONG_SUCCESS:
      return {
        loading: false,
        songs: action.songs,
      };

    case songConstants.GET_SONG_FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false,
      };

    case songConstants.UPDATE_ROYALTY_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case songConstants.UPDATE_ROYALTY_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.message,
      };

    case songConstants.UPDATE_ROYALTY_FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false,
      };

    case songConstants.ADD_ROYALTY_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case songConstants.ADD_ROYALTY_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.message,
      };

    case songConstants.ADD_ROYALTY_FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false,
      };

    case songConstants.DELETE_ROYALTY_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case songConstants.DELETE_ROYALTY_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.message
      };

    case songConstants.DELETE_ROYALTY_FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false,
      };

    default:
      return state;
  }
}
