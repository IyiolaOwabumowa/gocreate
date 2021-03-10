import { AsyncStorage } from "react-native";

const getData = async data => {
  const value = await AsyncStorage.getItem(data);
  return JSON.parse(value);
};


export function authHeader() {
  const user = getData("@user");

  if (user && user.token)
    return {
      Authorization: "Bearer " + user.token
    };
  else {
    return {};
  }
}
