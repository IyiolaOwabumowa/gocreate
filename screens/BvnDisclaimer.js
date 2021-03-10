import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { authActions } from "../src/actions/auth.actions";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Linking,
} from "react-native";
import { Button, Input, Item, Toast, CheckBox } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import validateInput from "../assets/utils/validation";

const width = Dimensions.get("window").width;
const iosBg = require("../assets/bg-app.png");
const androidBg = { uri: "asset:/images/bg-app.png" };
const iosLogo = require("../assets/logo.png");
const androidLogo = { uri: "asset:/images/logo.png" };

let imageBg = Platform.OS === "ios" ? iosBg : androidBg;
let logo = Platform.OS === "ios" ? iosLogo : androidLogo;

const BvnDisclaimer = (props) => {
  const dispatch = useDispatch();
  const buttonLoader = useSelector((state) => state.authReducer.buttonLoader);
  const message = useSelector((state) => state.authReducer.toastMessage);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [checked, setChecked] = useState(false);

  // useEffect(() => {
  //   if (password != "" && confirmPassword != "") {
  //     setPasswordError(
  //       validateInput({
  //         type: "password",
  //         value: password,
  //       })
  //     );
  //     setConfirmPasswordError(
  //       validateInput({
  //         type: "password",
  //         value: confirmPassword,
  //       })
  //     );
  //   }
  // }, [password, confirmPassword]);

  const navigateBvnScreen = () => {
    props.navigation.navigate("BvnVerification");
    setCreating(false);
  };

  const openTC = () => {
    Linking.openURL("http://gocreateafrica.app/Terms_And_Conditions.html");
  };

  const openPrivacy = () => {
    Linking.openURL("http://gocreateafrica.app/privacy.html");
  };
  return (
    <ImageBackground style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.kContainer}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        behavior="padding"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        enabled
        enableOnAndroid={true}
      >
        <StatusBar barStyle="light-content" />

        <View
          style={{
            padding: 30,
            flexDirection: "row",
            flexWrap: "wrap",
            margin: 20,
            borderRadius: 5,
            backgroundColor: "#ffffff20",
          }}
        >
          <Text style={{ lineHeight: 20, color: "#fff" }}>
            Read the GoCreate{" "}
          </Text>
          <TouchableOpacity
            onPress={() => {
              openTC();
            }}
          >
            <Text style={{ lineHeight: 20, color: "#9DC828" }}>
              Terms and Conditions
            </Text>
          </TouchableOpacity>

          <Text style={{ lineHeight: 20, color: "#fff" }}>as well as</Text>
          <TouchableOpacity
            onPress={() => {
              openPrivacy();
            }}
          >
            <Text style={{ lineHeight: 20, color: "#9DC828" }}>
              {" "}
              privacy policy.
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* {Platform.OS === "ios" ? (
              <Image
                source={require("../assets/mscn.jpeg")}
                style={{
                  marginTop: 20,
                  width: "30%",
                  height: 30,
                  resizeMode: "contain",
                }}
              />
            ) : (
              <Image
                source={{ uri: "asset:/images/mscn.jpeg" }}
                style={{
                  marginTop: 20,
                  width: "40%",
                  height: 30,
                  resizeMode: "contain",
                }}
              />
            )}

            {Platform.OS === "ios" ? (
              <Image
                source={require("../assets/paystack.png")}
                style={{
                  marginTop: 20,
                  marginLeft: 20,
                  width: "30%",
                  height: 30,
                  resizeMode: "contain",
                }}
              />
            ) : (
              <Image
                source={{ uri: "asset:/images/paystack.png" }}
                style={{
                  marginTop: 20,
                  width: "40%",
                  height: 30,
                  resizeMode: "contain",
                }}
              />
            )} */}
          </View>
        </View>

        <View
          style={{ flexDirection: "row", alignItems: "center", padding: 30 }}
        >
          <Item
            style={{
              borderColor: "#ffffff00",
              marginRight: 20,
              marginLeft: 10,
              borderRadius: 5,
            }}
          >
            <CheckBox
              checked={checked}
              onPress={() => {
                setChecked(!checked);
              }}
              style={
                checked
                  ? { backgroundColor: "#010114", borderColor: "#010114" }
                  : { backgroundColor: "#ffffff00", borderColor: "#010114" }
              }
            />
          </Item>
          <View
            style={{
              flexDirection:"row",
            justifyContent:"center"
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              style={{}}
              onPress={() => {
                setChecked(!checked);
              }}
            >
              <Text style={{ color: "white", textAlign:"center" }}>
                {" "}
                Click to agree with the above mentioned
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Button
            onPress={() => {
              setCreating(true);
              navigateBvnScreen();
            }}
            activeOpacity={0.95}
            style={checked ? styles.loginButton : styles.disabledButton}
            block
            disabled={checked ? false : true}
          >
            {creating ? (
              <>
                <Spinner color="#fff" size="small" />
              </>
            ) : (
              <>
                <Text style={styles.buttonText}>Continue to BVN</Text>
              </>
            )}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default BvnDisclaimer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101820FF",

    justifyContent: "center",
  },
  kContainer: {
    flex: 1,
  },

  textInput: {
    color: "#fff",
    fontSize: 14,
    paddingLeft: 25,
  },
  itemStyle: {
    borderColor: "#ffffff00",
    backgroundColor: "#00000030",
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
    backgroundColor: "#010114",
    height: 55,

    width: width - 40,
    paddingLeft: 30,
    paddingRight: 30,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 30,
  },
  disabledButton: {
    backgroundColor: "#ffffff20",
    height: 55,

    width: width - 40,
    paddingLeft: 30,
    paddingRight: 30,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: "white",
    fontFamily: "Trebuchet",
  },
  errorMessage: {
    color: "#000",
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
  },
  loginInfo: {
    color: "#000",
    fontFamily: "Trebuchet",
    fontSize: 15,
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
});
