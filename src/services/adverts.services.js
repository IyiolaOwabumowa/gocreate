import axios from "axios";
import { AsyncStorage } from "react-native";

export const advertsService = {
  getAdverts
};



function getAdverts() {
  return axios

    .get(`https://web.gocreateafrica.app/api/v1/adverts/publish/`)
    .then((response) => {
      const successObject = { status: response.status, data: response.data };
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;

      return successObject;
    })
    .catch((error) => {
      console.log(error.response);

      if (error.response) {
        // Request made and server responded
        const values = Object.values(error.response.data);
        const errorObject = { status: error.response.status, error: values[0] };
        // for (const value of values) {
        //   console.log(value[0])
        // }

        return errorObject;
      }

      Promise.reject(error);
    });
}
