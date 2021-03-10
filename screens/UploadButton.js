import React, { useEffect, useState } from "react";
import { Platform } from "react-native";

import {
  FontAwesome5,
  Ionicons,
  AntDesign,
  Fontisto,
  Octicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
const UploadButton = (props) => {

  // if (Platform.OS === "ios") {
  //   return null;
  // } else {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("UploadSong");
        }}
        style={{ paddingLeft: 20, paddingRight: 20 }}
      >
        <Ionicons name="ios-add" size={30} color="white" />
      </TouchableOpacity>
    );
  // }
};

export default UploadButton;
