import { advertsConstants } from "../constants/advertsConstants";
import { advertsService } from "../services/adverts.services";

import { AsyncStorage } from "react-native";

export const advertsActions = {
  getAdverts,
};

function getAdverts() {
  return (dispatch) => {
    dispatch(request());
    advertsService
      .getAdverts()

      .then((value) => {
        dispatch(success(value));
      })
      .catch((err) => {
        dispatch(failure());
        console.log(err);
      });
  };

  function success(adverts) {
    return { type: advertsConstants.GET_ADVERT_SUCCESS, adverts };
  }
  function failure() {
    return { type: advertsConstants.GET_ADVERT_FAILURE };
  }
  function request() {
    return { type: advertsConstants.GET_ADVERT_REQUEST };
  }
}
