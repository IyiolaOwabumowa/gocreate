import { AsyncStorage } from "react-native";
import axios from "axios";
import FormData from "form-data";

export const songService = {
  getSongs,
  addRoyalty,
  updateRoyalty,
  deleteRoyalty,
};

function getSongs(token) {
  return axios
    .get("https://web.gocreateafrica.app/api/v1/songs/all/", {
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

function updateRoyalty(
  id,
  token,
  share,
  email,
  phone,
  fullname,
  song,
  description
) {
  const shareValue = {
    id: id,
    share: parseInt(share),
    email,
    phone,
    fullname,
    song,
    description,
  };

  //console.log(shareValue);

  return axios
    .patch(
      `https://web.gocreateafrica.app/api/v1/songs/royalty/details/${id}/`,
      shareValue,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      }
    )
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
      console.log(error.response.data);
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

function addRoyalty(token, share, email, phone, fullname, song, description) {
  const details = {
    share: parseInt(share),
    email,
    phone,
    fullname,
    song,
    description
  };

  return axios
    .post(`https://web.gocreateafrica.app/api/v1/songs/royalty/add/`, details, {
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
      //console.log(error.response.data);
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

function deleteRoyalty(id, token) {
  return axios
    .delete(
      `https://web.gocreateafrica.app/api/v1/songs/royalty/details/${id}/`,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
   
      const successObject = { data: "Delete Successful" };
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;
      // console.log(successObject);
      return successObject;
    })
    .catch((error) => {
      //console.log(error.response);
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
