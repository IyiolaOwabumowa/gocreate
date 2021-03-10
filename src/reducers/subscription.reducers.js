import { subscriptionConstants } from "../constants/subscriptionConstants.js"
const initialState = {};

export default function subscriptionReducer(state = initialState, action) {
  switch (action.type) {
    case subscriptionConstants.GET_AVAILABLE_SUB_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case subscriptionConstants.GET_AVAILABLE_SUB_SUCCESS:
      return {
        ...state,
        loading: false,
        subscriptions: action.subscriptions,
      };
    case subscriptionConstants.GET_AVAILABLE_SUB_FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false,
      };

      case subscriptionConstants.GET_ARTIST_SUB_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case subscriptionConstants.GET_ARTIST_SUB_SUCCESS:
        return {
          ...state,
          loading: false,
          artist_subscriptions: action.artist_subscriptions,
        };
      case subscriptionConstants.GET_ARTIST_SUB_FAILURE:
        return {
          ...state,
          error: action.error,
          loading: false,
        };
  
    default:
      return state;
  }
}
