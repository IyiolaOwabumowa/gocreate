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
  Platform,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard

} from "react-native";
import { Button, Input, Item, Toast } from "native-base";
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


const ForgotPassword = ({props, navigation}) => {
  const dispatch = useDispatch();
  const buttonLoader = useSelector((state) => state.authReducer.buttonLoader);
  const message = useSelector((state) => state.authReducer.toastMessage);

  const loginError = useSelector(
    (state) => state.authReducer.loginErrorMessage
  );

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (message != null || message != undefined) {
      Toast.show({
        text: message,
        textStyle: {
          fontSize: 14,
          paddingLeft: 10,
        },
        duration: 10000,
        style: {
          backgroundColor: "#9DC828",
        },
        onClose: () => {
          dispatch(authActions.clearToastMessage());
        },
      });
    }

    if (email == "") {
      dispatch(authActions.clearErrors());
    }
  }, [email, message]);

  const handleSubmit = () => {
    const validateEmail = validateInput({ type: "email", value: email });
    setEmailError(validateEmail);

    if (emailError == null) {
      dispatch(authActions.sendResetLink(email));
    }
    Keyboard.dismiss()
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

        <View style={{ alignItems: "center" }}>
          {Platform.OS === "ios" ? (
            <Image
              source={require("../assets/logo.png")}
              style={{ width: "40%", height: 70, resizeMode: "contain" }}
            />
          ) : (
            <Image
              source={{ uri: "asset:/images/logo.png" }}
              style={{ width: "40%", height: 70, resizeMode: "contain" }}
            />
          )}
        </View>

        <View style={{ marginTop: 30 }}>
          <Text style={styles.loginInfo}>
            We'll send you a link to reset your password
          </Text>
        </View>
        <Item style={[styles.itemStyle, { marginTop: 20 }]}>
          <Input
            style={styles.textInput}
            placeholder="Email"
            placeholderTextColor="#fff"
            keyboardAppearance={"dark"}
            spellCheck={false}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(validateInput({ type: "email", value: text }));
              dispatch(authActions.clearErrors());
            }}
          />
        </Item>
        <View>
          {emailError ? (
            <Text style={styles.errorMessage}>{emailError}</Text>
          ) : null}
        </View>

        <Text style={styles.errorMessage}>{loginError}</Text>

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
                <Text style={styles.buttonText}>SEND RESET LINK</Text>
              </>
            )}
          </Button>
          {/* {Platform.OS === "ios" ? (
            <Image
              source={require("../assets/ad-3.jpeg")}
              style={{
                width: width,
                height: 100,
                marginTop: 20,
                resizeMode: "contain",
              }}
            />
          ) : (
            <Image
              source={{ uri: "asset:/images/ad-3.jpeg" }}
              style={{
                width: width,
                height: 100,
                marginTop: 20,
                resizeMode: "contain",
              }}
            />
          )} */}
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#101820FF",
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
    backgroundColor: "#1A5C79",
    height: 50,

    width: width - 40,
    paddingLeft: 30,
    paddingRight: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  buttonText: {
    color: "white",
    fontFamily: "Trebuchet",
  },
  errorMessage: {
    color: "#fff",
    paddingLeft: 25,
    paddingRight: 20,
    marginTop: 10,
  },
  loginInfo: {
    color: "#fff",
    fontFamily: "Trebuchet",
    fontSize: 15,
    marginTop: 10,
    marginBottom:20,
    textAlign: "center",
  },
});
