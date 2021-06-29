import { authConstants } from "../constants/authConstants";
import { authService } from "../services/auth.services";
import { userActions } from "../actions/user.actions";
import { AsyncStorage } from "react-native";

export const authActions = {
  login,
  sendResetLink,
  createPassword,
  resetPassword,
  signup,
  getUserToken,
  saveUserToken,
  getPasswordStatus,
  savePasswordStatus,
  deleteUserToken,
  clearErrors,
  clearToastMessage,
  clearState,
};

function signup(email, first_name, last_name, phone, country) {
  return (dispatch) => {
    dispatch(request());

    authService.signup(email, first_name, last_name, phone, country).then((res) => {
      console.log(res)
      if (res.status == 200) {
        dispatch(
          success(
            res.data.status === "success" ? true : false,
            `A confirmation link has been sent to ${email}`
          )
        );
      } else {
        dispatch(failure(res.error, false));
      }
      // userActions.saveUserId(auth.id)
    });
  };

  function request() {
    return { type: authConstants.REGISTER_REQUEST };
  }
  function success(registered, msg) {
    return {
      type: authConstants.REGISTER_SUCCESS,
      registered,
      toastMessage: msg
    };
  }
  function failure(error, registered) {
    return { type: authConstants.REGISTER_FAILURE, error: error, registered };
  }
}

function createPassword(uid, token, password) {
  return (dispatch) => {
    dispatch(request());

    authService.createPassword(uid, token, password).then((res) => {
      console.log(res.status)
      if (res.status == 200) {
        dispatch(success(`Password created successfully`));
      } else {
        dispatch(failure(res.error));
      }
    });
  };

  function request() {
    return { type: authConstants.CREATE_PASS_REQUEST, isPassword:false };
  }
  function success(msg) {
    return { type: authConstants.CREATE_PASS_SUCCESS, toastMessage: msg, isPassword:true };
  }
  function failure(error) {
    return { type: authConstants.CREATE_PASS_FAILURE, error: error, isPassword:false };
  }
}

function login(username, password) {
  return (dispatch) => {
    dispatch(request(username));

    authService.login(username, password).then((res) => {
      if (res.status == 200) {
        dispatch(success(res.data.token, res.data.artist.first_name));
        dispatch(userActions.saveArtist(res.data.artist));
        dispatch(saveUserToken(res.data.token));
      } else {
        console.log(res)
        dispatch(failure(res.error));
      }
      // userActions.saveUserId(auth.id)
    });
  };

  function request(user) {
    return { type: authConstants.LOGIN_REQUEST };
  }
  function success(token, username) {
    return { type: authConstants.LOGIN_SUCCESS, token, username };
  }
  function failure(error) {
    return { type: authConstants.LOGIN_FAILURE, error };
  }
  function saveToken() {
    return { type: authConstants.SAVE_TOKEN };
  }
}

function sendResetLink(email) {
  return (dispatch) => {
    dispatch(request(email));

    authService.sendResetLink(email).then((res) => {
      console.log(res);
      if (res.status && res.status == 200) {
        dispatch(success(`Your reset link has been sent to ${email}`));
      } else {
        console.log(res);
        dispatch(failure(res.error));
      }
      // userActions.saveUserId(auth.id)
    });
  };

  function request() {
    return { type: authConstants.RESET_LINK_REQUEST };
  }
  function success(msg) {
    return { type: authConstants.RESET_LINK_SUCCESS, toastMessage: msg };
  }
  function failure(error) {
    return { type: authConstants.RESET_LINK_FAILURE, error };
  }
}

function resetPassword(uid, token, password) {
  return (dispatch) => {
    dispatch(request());

    authService.resetPassword(uid, token, password).then((res) => {
      if (res.status && res.status == 200) {
        dispatch(success(`Your password has been reset successfully`));
      } else {
        console.log(res);
        dispatch(failure(res.error));
      }
      // userActions.saveUserId(auth.id)
    });
  };

  function request() {
    return { type: authConstants.RESET_PASS_REQUEST };
  }
  function success(msg) {
    return { type: authConstants.RESET_PASS_SUCCESS, toastMessage: msg };
  }
  function failure(error) {
    return { type: authConstants.RESET_PASS_FAILURE, error };
  }
}

function savePasswordStatus(status) {
  return (dispatch) => {
    authService.saveItem("status", status).then((status) => {
      dispatch(saveStatus(status));
    });
  };

  function saveStatus(status) {
    return { type: authConstants.SAVE_PASSWORD_STATUS, status };
  }
}

function getPasswordStatus() {
  return (dispatch) => {
    authService
      .getItem("status")
      .then((value) => {
        dispatch(getStatus(value));
      })
      .catch((err) => {});
  };

  function getStatus(status) {
    return { type: authConstants.GET_PASSWORD_STATUS, status };
  }
}


function getUserToken() {
  return (dispatch) => {
    authService
      .getItem("token")
      .then((value) => {
        dispatch(getToken(value));
      })
      .catch((err) => {});
  };

  function getToken(token) {
    return { type: authConstants.GET_TOKEN, token };
  }
}

function saveUserToken(token) {
  return (dispatch) => {
    authService.saveItem("token", token).then((token) => {
      dispatch(saveToken(token));
    });
  };

  function saveToken(token) {
    return { type: authConstants.SAVE_TOKEN, token };
  }
}

function deleteUserToken() {
  return (dispatch) => {
    authService.deleteItem("token").then((value) => {
      dispatch(deleteToken());
    });
  };

  function deleteToken() {
    return { type: authConstants.DELETE_TOKEN };
  }
}

function clearErrors() {
  return {
    type: authConstants.CLEAR_ERRORS,
  };
}

function clearState() {
  return {
    type: authConstants.CLEAR_STATE,
  };
}

function clearToastMessage() {
  return {
    type: authConstants.CLEAR_TOAST,
  };
}
