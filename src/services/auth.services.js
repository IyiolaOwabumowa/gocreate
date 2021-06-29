import axios from "axios";
import { AsyncStorage } from "react-native";

export const authService = {
  login,
  getItem,
  saveItem,
  deleteItem,
  sendResetLink,
  createPassword,
  resetPassword,
  signup,
};

function signup(email, first_name, last_name, phone, country) {
  const signupDetails = {
    email,
    first_name,
    last_name,
    phone,
    country,
  };
  return axios

    .post(
      "https://web.gocreateafrica.app/api/v1/accounts/register/",
      signupDetails
    )
    .then((response) => {
      console.log(response);
      const successObject = { status: response.status, data: response.data };
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;
      return successObject;
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded
        const values = Object.values(error.response.data);
        const errorObject = { status: error.response.status, error: values[0] };
        // for (const value of values) {
        //   console.log(value[0])
        // }

        return errorObject;
      }
    });
}

function createPassword(uid, token, password) {
  const userDetails = {
    uid,
    token,
    password,
  };
  console.log(userDetails);

  return axios
    .post(
      "https://web.gocreateafrica.app/api/v1/accounts/verify/",
      userDetails,
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then((response) => {
      const successObject = { status: response.status, data: response.data };
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;

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

function resetPassword(uid, token, password) {
  const userDetails = {
    uid,
    token,
    password,
  };
  console.log(userDetails);

  return axios
    .post(
      "https://web.gocreateafrica.app/api/v1/accounts/verify/",
      userDetails,
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then((response) => {
      const successObject = { status: response.status, data: response.data };
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;

      return successObject;
    })
    .catch((error) => {
      console.log(error.response.data.message);
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

function getUser(uid) {
  return axios

    .get(`https://web.gocreateafrica.app/api/v1/accounts/artist/${uid}/`)
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

function login(username, password) {
  const loginDetails = {
    username: username,
    password: password,
  };

  return axios
    .post("https://web.gocreateafrica.app/api/v1/accounts/login/", loginDetails)
    .then((response) => {
      const successObject = { status: response.status, data: response.data };
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;
      return successObject;
    })
    .catch(function (error) {
      console.log(error);
      if (error.response) {
        // Request made and server responded
        const values = Object.values(error.response.data);
        const errorObject = { status: error.response.status, error: values[0] };
        // for (const value of values) {
        //   console.log(value[0])
        // }

        return errorObject;
      }
    });
}

function sendResetLink(email) {
  const emailDetails = { email };
  return axios
    .post(
      `https://web.gocreateafrica.app/api/v1/accounts/reset/password/`,
      emailDetails
    )
    .then((response) => {
      const successObject = { status: response.status };
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;
      return successObject;
    })
    .catch(function (error) {
      console.log(error);
      if (error.response) {
        // Request made and server responded
        const values = Object.values(error.response.data);
        const errorObject = { status: error.response.status, error: values[0] };
        // for (const value of values) {
        //   console.log(value[0])
        // }
        return errorObject;
      }
    });
}

function getItem(itemName) {
  return AsyncStorage.getItem(itemName)
    .then((value) => {
      return value;
    })
    .catch((err) => {
      return err;
    });
}

function saveItem(itemName, itemValue) {
  return AsyncStorage.setItem(itemName, itemValue)
    .then((value) => {
      return value;
    })
    .catch((err) => {
      return err;
    });
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

// function logout() {
//   deleteData("@user");
// }

// const storeData = async data => {

//     await AsyncStorage.setItem("@user", data)

// };

// const deleteData= async data => {
//   try {
//     await AsyncStorage.removeItem(data);
//   } catch (error) {
//     // Error retrieving data
//     console.log(error.message);
//   }
// };
