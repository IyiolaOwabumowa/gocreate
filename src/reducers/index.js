import { combineReducers } from 'redux'
import authReducer from "./auth.reducers.js"
import userReducer from "./user.reducers.js"
import songReducer from "./song.reducers.js"
import subscriptionReducer from "./subscription.reducers.js"
import advertsReducer from "./adverts.reducers.js"

export default combineReducers({
   authReducer, userReducer, songReducer,
   subscriptionReducer, advertsReducer
  })