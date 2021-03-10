import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { authActions } from "../src/actions/auth.actions";
import { useHeaderHeight } from "@react-navigation/stack";

import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Platform,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { Button, Input, Item } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import validateInput from "../assets/utils/validation";
import FileDisplayItem from "./FileDisplayItem";
import { ScrollView } from "react-native-gesture-handler";

const width = Dimensions.get("window").width;
const iosBg = require("../assets/bg-app.png");
const androidBg = { uri: "asset:/images/bg-app.png" };
const iosLogo = require("../assets/logo.png");
const androidLogo = { uri: "asset:/images/logo.png" };
const windowWidth = Dimensions.get("window").width;

let imageBg = Platform.OS === "ios" ? iosBg : androidBg;
let logo = Platform.OS === "ios" ? iosLogo : androidLogo;

const MonitorUploads = (props) => {
  const dispatch = useDispatch();
  const headerHeight = useHeaderHeight();

  const loggingIn = useSelector((state) => state.authReducer.loggingIn);
  const loginError = useSelector((state) => state.authReducer.errorMessage);
  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [header, setHeaderHeight] = useState(headerHeight);

  const buttonLoader = useSelector((state) => state.authReducer.buttonLoader);

  const handleSubmit = () => {
    dispatch(authActions.deleteUserToken());
  };

  const upload=()=>{
    props.navigation.navigate("UploadSong")
  }

  return (
    <ImageBackground source={imageBg} style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView>
        <View>
          <View style={{ padding: 15, backgroundColor: "#ffffff" }}>
            <Text
              style={{
                textAlign: "center",
                color: "#000",
                fontFamily: "Trebuchet",
              }}
            >
              Creative Content Upload
            </Text>
          </View>
          <TouchableOpacity onPress={upload} activeOpacity={0.6}>
            <View style={{ alignItems: "center", padding: 25 }}>
              <FontAwesomeIcon
                icon={faCloudUploadAlt}
                color="#9DC828"
                size={80}
              />
            </View>
          </TouchableOpacity>
          <Text
            style={{
              textAlign: "center",
              color: "#000",
              fontFamily: "Trebuchet",
              marginBottom: 50,
            }}
          >
            Select a document to upload
          </Text>
        </View>

        <View>
          <View style={{ paddingTop: 15, backgroundColor: "#ffffff50" }}>
            <Text
              style={{
                textAlign: "center",
                color: "#000",
                fontFamily: "Trebuchet",
                paddingBottom: 15,
              }}
            >
              Uploaded Files with ISCWC
            </Text>
          </View>

          <ScrollView>
            <FileDisplayItem />
            <FileDisplayItem />
            <FileDisplayItem />
            <FileDisplayItem />
            <FileDisplayItem />
            <FileDisplayItem />
          </ScrollView>
        </View>

        {Platform.OS === "ios" ? (
          <Image
            source={require("../assets/ad-1.jpeg")}
            style={{ width: windowWidth, height: 220, resizeMode: "contain" }}
          />
        ) : (
          <Image
            source={{ uri: "asset:/images/ad-1.jpeg" }}
            style={{ width: windowWidth, height: 220, resizeMode: "contain" }}
          />
        )}
        <View>
          <Button
            onPress={() => {
              handleSubmit();
            }}
            activeOpacity={0.95}
            style={styles.loginButton}
            block
          >
            {buttonLoader ? (
              <>
                <Spinner color="#fff" size="small" />
              </>
            ) : (
              <>
                <Text style={styles.buttonText}>LOGOUT</Text>
              </>
            )}
          </Button>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default MonitorUploads;

const styles = StyleSheet.create({
  container: {},

  textInput: {
    color: "#ffffff",
    fontSize: 14,
    paddingLeft: 25,
  },
  itemStyle: {
    borderColor: "#ffffff00",
    backgroundColor: "#1c1c1c30",
    marginLeft: 20,
    marginRight: 20,

    borderRadius: 5,
  },
  tinyText: {
    fontSize: 12,
    marginTop: 17,
  },

  registerButton: {
    backgroundColor: "#000",

    height: 60,
    width: width - 40,
    marginTop: 15,
    paddingLeft: 30,
    justifyContent: "space-between",
    paddingRight: 30,
  },
  loginButton: {
    backgroundColor: "#1A5C79",
    height: 60,
    width: width - 40,
    paddingLeft: 30,
    paddingRight: 30,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 25,
    marginBottom: 25,
  },
  buttonText: {
    color: "white",
    fontFamily: "Trebuchet",
  },
  errorMessage: {
    color: "#000",
    fontFamily:"Trebuchet",
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
  },
  loginInfo: {
    color: "#575757",
    fontFamily: "Trebuchet",
    marginTop: 30,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 15,
  },
});
