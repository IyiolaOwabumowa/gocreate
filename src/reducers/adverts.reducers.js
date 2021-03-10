import { advertsConstants } from "../constants/advertsConstants";
import { advertsActions } from "../actions/adverts.actions";

const initialState = {
  loading:false,
  adverts:null
};

export default function advertsReducer(state = initialState, action) {
  switch (action.type) {
  
    case advertsConstants.GET_ADVERT_REQUEST:
      return {
        loading: true
      };
    case advertsConstants.GET_ADVERT_SUCCESS:
      return {
       loading:false,
       adverts: action.adverts
       
      };
    case advertsConstants.GET_ADVERT_FAILURE:
      return {
       loading: false
      };
  
    default:
      return state;
  }
}
