import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";

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
      <Ionicons
        name="ios-add"
        size={30}
        color={props.mode == "light" ? "black" : "white"}
      />
    </TouchableOpacity>
  );
  // }
};

export default UploadButton;
