import { authConstants } from "../constants/authConstants";
import { authActions } from "../actions/auth.actions";

const initialState = {
  token: null,
  toastMessage: null,
  isPassword: false,
  registered: false,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case authConstants.LOGIN_REQUEST:
      return {
        token: null,
        loggingIn: true,
      };
    case authConstants.REGISTER_REQUEST:
      return {
        buttonLoader: true,
        registered: false,
      };
    case authConstants.REGISTER_SUCCESS:
      return {
        ...state,
        buttonLoader: false,
        registered: action.registered,
        toastMessage: action.toastMessage,
      };
    case authConstants.REGISTER_FAILURE:
      return {
        buttonLoader: false,
        errorMessage: action.error,
        registered: action.registered,
      };
    case authConstants.LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        token: action.token,
        username: action.username,
      };

    case authConstants.LOGIN_FAILURE:
      return {
        loggingIn: false,
        errorMessage: action.error,
        token: null,
      };
    case authConstants.CREATE_PASS_FAILURE:
      return {
        creating: false,
        errorMessage: action.error,
        token: null,
        isPassword: false,
      };
    case authConstants.CREATE_PASS_REQUEST:
      return {
        creating: true,
        token: null,
      };
    case authConstants.CREATE_PASS_SUCCESS:
      return {
        creating: false,
        token: null,
        isPassword: action.isPassword,
        toastMessage: action.toastMessage,
      };

    case authConstants.RESET_LINK_REQUEST:
      return {
        ...state,
        buttonLoader: true,
      };
    case authConstants.RESET_LINK_SUCCESS:
      return {
        ...state,
        buttonLoader: false,
        toastMessage: action.toastMessage,
      };
    case authConstants.RESET_LINK_FAILURE:
      return {
        ...state,
        buttonLoader: false,
        errorMessage: action.error,
      };

    case authConstants.RESET_PASS_FAILURE:
      return {
        creating: false,
        errorMessage: action.error,
        token: null,
      };
    case authConstants.RESET_PASS_REQUEST:
      return {
        creating: true,
        token: null,
      };
    case authConstants.RESET_PASS_SUCCESS:
      return {
        reset: true,
        confirmed: true,
        token: null,
      };

    case authConstants.GET_PASSWORD_STATUS:
      return {
        status: action.status,
      };
    case authConstants.SAVE_PASSWORD_STATUS:
      return {
        status: action.status,
      };

    case authConstants.CLEAR_ERRORS:
      return {
        ...state,
        errorMessage: null,
      };

    case authConstants.CLEAR_TOAST:
      return {
        ...state,
        toastMessage: null,
      };
    case authConstants.GET_TOKEN:
      return {
        ...state,
        token: action.token,
      };

    case authConstants.SAVE_TOKEN:
      return {
        ...state,
      };

    case authConstants.DELETE_TOKEN:
      return {
        token: null,
      };
    case authConstants.LOGOUT:
      return {
        loginErrorMessage: "",
        token: null,
      };

    case authConstants.CLEAR_STATE:
      return {};

    default:
      return state;
  }
}
