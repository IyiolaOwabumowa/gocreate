import { subscriptionConstants } from "../constants/subscriptionConstants";
import { subscriptionService } from "../services/subscription.services";
import { AsyncStorage } from "react-native";

export const subscriptionActions = {
  getAvailableSubscriptions, getArtistSubscriptions
};

 


function getAvailableSubscriptions(token) {
  return (dispatch) => {
    dispatch(request())
    subscriptionService
      .getAvailableSubscriptions(token)

      .then((value) => {
        dispatch(success(value));
      })
      .catch((res) => {
        console.log(res);
        dispatch(failure(res.error));
      });
  };
  function request() {
    return { type: subscriptionConstants.GET_AVAILABLE_SUB_REQUEST };
  }
  function success(subscriptions) {
    return { type: subscriptionConstants.GET_AVAILABLE_SUB_SUCCESS, subscriptions };
  }
  function failure(error) {
    return { type: subscriptionConstants.GET_AVAILABLE_SUB_FAILURE, error };
  }
 
}

function getArtistSubscriptions(token) {
  return (dispatch) => {
    dispatch(request())
    subscriptionService
      .getArtistSubscriptions(token)

      .then((value) => {
        dispatch(success(value));
      })
      .catch((res) => {
        console.log(res);
        dispatch(failure(res.error));
      });
  };
  function request() {
    return { type: subscriptionConstants.GET_ARTIST_SUB_REQUEST };
  }
  function success(artist_subscriptions) {
    return { type: subscriptionConstants.GET_ARTIST_SUB_SUCCESS, artist_subscriptions };
  }
  function failure(error) {
    return { type: subscriptionConstants.GET_ARTIST_SUB_FAILURE, error };
  }
 
}



function clearToastMessage() {
  return {
    type: userConstants.CLEAR_TOAST,
  };
}
