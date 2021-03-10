import { songConstants } from "../constants/songConstants";
import { songService } from "../services/song.services";
import { AsyncStorage } from "react-native";

export const songActions = {
   
  getSongs,
  addRoyalty,
  updateRoyalty,
  deleteRoyalty
};

 


function getSongs(token) {
  return (dispatch) => {
    dispatch(request())
    songService
      .getSongs(token)

      .then((value) => {
        dispatch(success(value));
      })
      .catch((res) => {
        console.log(res);
        dispatch(failure(res.error));
      });
  };
  function request() {
    return { type: songConstants.GET_SONG_REQUEST };
  }
  function success(songs) {
    return { type: songConstants.GET_SONG_SUCCESS, songs };
  }
  function failure(error) {
    return { type: songConstants.GET_SONG_FAILURE, error };
  }
 
}



function updateRoyalty(id, token, share,  email, phone, fullname, song, description) {
  return (dispatch) => {
    dispatch(request())
    songService
      .updateRoyalty(id, token, share, email, phone, fullname, song, description)

      .then((value) => {
        dispatch(success());
      })
      .catch((res) => {
        console.log(res);
        dispatch(failure(res.error));
      });
  };
  function request() {
    return { type: songConstants.UPDATE_ROYALTY_REQUEST };
  }
  function success() {
    return { type: songConstants.UPDATE_ROYALTY_SUCCESS, message: "Splitting successful" };
  }
  function failure(error) {
    return { type: songConstants.UPDATE_ROYALTY_FAILURE, error };
  }
 
}

function addRoyalty(token, share,  email, phone, fullname, song, description) {
  return (dispatch) => {
    dispatch(request())
    songService
      .addRoyalty(token, share,  email, phone, fullname, song, description)

      .then((value) => {
        dispatch(success());
      })
      .catch((res) => {
        console.log(res);
        dispatch(failure(res.error));
      });
  };
  function request() {
    return { type: songConstants.ADD_ROYALTY_REQUEST };
  }
  function success() {
    return { type: songConstants.ADD_ROYALTY_SUCCESS, message: "Royalty added successfully" };
  }
  function failure(error) {
    return { type: songConstants.ADD_ROYALTY_FAILURE, error };
  }
 
}

function deleteRoyalty(id, token) {
 
  return (dispatch) => {
    dispatch(request())
    songService
      .deleteRoyalty(id, token).then((value) => {
        dispatch(success('Deletion Successful'));
      })
      .catch((res) => {
        console.log(res);
        dispatch(failure(res.error));
      });
  };
  function request() {
    return { type: songConstants.DELETE_ROYALTY_REQUEST };
  }
  function success(message) {
    return { type: songConstants.DELETE_ROYALTY_SUCCESS, message };
  }
  function failure(error) {
    return { type: songConstants.DELETE_ROYALTY_FAILURE, error };
  }
 
}

function clearToastMessage() {
  return {
    type: userConstants.CLEAR_TOAST,
  };
}
