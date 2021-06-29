import { userConstants } from "../constants/userConstants";
import { userService } from "../services/user.services";
import { AsyncStorage } from "react-native";

export const userActions = {
  saveArtist,
  getArtist,
  deleteArtist,
  updateProfile,
  clearToastMessage,
  updateDp,
  setAppearance,
};

function updateProfile(
  email,
  firstName,
  lastName,
  phone,
  image,
  dp_id,
  id,
  token,

  address,
  dob,
  lga,
  sor
) {
  return (dispatch) => {
    dispatch(request());

    userService
      .updateProfile(
        email,
        firstName,
        lastName,
        phone,
        image,
        dp_id,
        id,
        token,
        address,
        dob,
        lga,
        sor
      )
      .then((res) => {
        if (res.status == 200) {
          dispatch(success(`Your profile was updated successfully`));
        } else {
          dispatch(failure(res.error));
        }
      });
  };

  function request() {
    return { type: userConstants.UPDATE_PROFILE_REQUEST, loading: true };
  }
  function success(msg) {
    return { type: userConstants.UPDATE_PROFILE_SUCCESS, toastMessage: msg };
  }
  function failure(error) {
    return { type: userConstants.UPDATE_PROFILE_FAILURE, error: error };
  }
}

function updateDp(file, id) {
  return (dispatch) => {
    dispatch(request());

    userService.updateDp(file, id).then((res) => {
      if (res.status == 200) {
        dispatch(success());
      } else {
        dispatch(failure(res.error));
      }
    });
  };

  function request() {
    return { type: userConstants.UPDATE_DP_REQUEST };
  }
  function success() {
    return { type: userConstants.UPDATE_DP_SUCCESS };
  }
  function failure(error) {
    return { type: userConstants.UPDATE_DP_FAILURE, error };
  }
}

function saveArtist(artist) {
  return (dispatch) => {
    userService.saveItem("artist", artist).then((artist) => {
      dispatch(saveArtist(artist));
    });
  };

  function saveArtist(artist) {
    return { type: userConstants.SAVE_ARTIST, artist };
  }
}

function deleteArtist() {
  return (dispatch) => {
    userService.deleteItem("artist").then((value) => {
      dispatch(removeArtist());
    });
  };

  function removeArtist() {
    return { type: userConstants.DELETE_ARTIST };
  }
}

function getArtist(token) {
  return (dispatch) => {
    userService
      .getArtist(token)

      .then((value) => {
        dispatch(getArtist(value));
      })
      .catch((err) => {
        if (err.status == 401) {
          dispatch(getArtistFailed(false));
        }
      });
  };

  function getArtist(artist) {
    return { type: userConstants.GET_ARTIST, artist };
  }

  function getArtistFailed(authorized) {
    return { type: userConstants.GET_ARTIST_FAILURE, authorized };
  }
}

function clearToastMessage() {
  return {
    type: userConstants.CLEAR_TOAST,
  };
}

function setAppearance(mode) {
  return {
    type: userConstants.SET_APPEARANCE,
    mode: mode,
  };
}
