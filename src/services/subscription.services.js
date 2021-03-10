import { AsyncStorage } from "react-native";
import axios from "axios";
import FormData from "form-data";

export const subscriptionService = {
  getAvailableSubscriptions, getArtistSubscriptions
};

function getAvailableSubscriptions(token) {
  return axios
    .get("https://web.gocreateafrica.app/api/v1/subscriptions/package/", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
   
      const successObject = { data: response.data };
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;
      // console.log(successObject);
      return successObject;
    })
    .catch((error) => {
      //console.log(error.response.status);
      if (error.response) {
        // Request made and server responded
        const values = Object.values(error.response.data);
        const errorObject = {
          status: error.response.status,
          error: error.response.data.message,
        };
        // for (const value of values) {
        //   console.log(value[0])
        // }

        return errorObject;
      }

      Promise.reject(error);
    });
}

function getArtistSubscriptions(token) {
  return axios
    .get("https://web.gocreateafrica.app/api/v1/subscriptions/artist/", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const successObject = { data: response.data };
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;
      // console.log(successObject);
    
      return successObject;
    })
    .catch((error) => {
      //console.log(error.response.status);
      if (error.response) {
        // Request made and server responded
        const values = Object.values(error.response.data);
        const errorObject = {
          status: error.response.status,
          error: error.response.data.message,
        };
        // for (const value of values) {
        //   console.log(value[0])
        // }

        return errorObject;
      }

      Promise.reject(error);
    });
}


