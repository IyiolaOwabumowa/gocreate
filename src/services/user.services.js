import { AsyncStorage } from "react-native";
import axios from "axios";
import FormData from "form-data";

export const userService = {
  getArtist,
  getItem,
  saveItem,
  deleteItem,
  updateProfile,
  updateDp,
};

function getUser(id) {
  const user = {
    id: id,
    username: "iyiola",
  };

  return user;
}

async function updateProfile(
  email,
  first_name,
  last_name,
  phone,
  file,
  dp_id,
  id,
  token,

  address,
  dob,
  lga,
  sor
) {
  const userDetails = {
    email,
    first_name,
    last_name,
    phone,

    address,
    dob,
    lga,
    sor,
  };

  try {
    const response = await axios.patch(
      `https://web.gocreateafrica.app/api/v1/accounts/artist/${id}/`,
      userDetails,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const successObject = { status: response.status, data: response.data };

    //  const token = res.data.token;
    //  const id = 1;
    //  const auth = {id, token}
    //  return auth;
    await updateDp(file, dp_id, token);
    return successObject;
  } catch (error) {
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
  }
}

function getArtist(token) {
  return axios
    .get(
      "https://web.gocreateafrica.app/api/v1/accounts/user/",
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

function updateDp(file, id, token) {
  const data = new FormData();

  const uri = file;
  let uriParts = uri.split(".");

  let fileType = uriParts[uriParts.length - 1];

  data.append("image", {
    uri,
    type: `image/${fileType}`,
    name: `image.${fileType}`,
  });

  // console.log(data)
  //console.log(data._parts[0])

  return axios
    .put(
      `https://web.gocreateafrica.app/api/v1/accounts/user/dp/${id}/`,
      data,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      const successObject = { status: response.status, data: response.data };
      // console.log(successObject);
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;
      //console.log(successObject);
      return successObject;
    })
    .catch((error) => {
      // console.log(error.response);
      if (error.response) {
        // Request made and server responded
        const values = Object.values(error.response.data);
        const errorObject = {
          status: error.response.status,
          error: error.response.data.image[0],
        };
        // for (const value of values) {
        //   console.log(value[0])
        // }

        return errorObject;
      }

      Promise.reject(error);
    });
}

async function getItem(itemName) {
  try {
    const retrievedItem = await AsyncStorage.getItem(itemName);

    const item = JSON.parse(retrievedItem);
    return item;
  } catch (error) {
    // console.log(error.message);
  }
}

async function saveItem(itemName, itemValue) {
  try {
    //we want to wait for the Promise returned by AsyncStorage.setItem()
    //to be resolved to the actual value before returning the value
    var jsonOfItem = await AsyncStorage.setItem(
      itemName,
      JSON.stringify(itemValue)
    );
    return jsonOfItem;
  } catch (error) {
    // console.log(error.message);
  }
}

function deleteItem(itemName) {
  return AsyncStorage.removeItem(itemName)
    .then(() => {
      const success = "Delete Successful";
      return success;
    })
    .catch((err) => {
      return err;
    });
}
