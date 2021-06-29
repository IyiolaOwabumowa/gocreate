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
  Keyboard,
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

const ForgotPassword = ({ props, navigation }) => {
  const dispatch = useDispatch();
  const buttonLoader = useSelector((state) => state.authReducer.buttonLoader);
  const message = useSelector((state) => state.authReducer.toastMessage);
  const mode = useSelector((state) => state.userReducer.mode);

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
    Keyboard.dismiss();
  };

  return (
    <ImageBackground style={styles[`container${mode}`]}>
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
        <StatusBar
          barStyle={mode == "light" ? "dark-content" : "light-content"}
        />

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
          <Text style={styles[`subtext${mode}`]}>
            We'll send you a link to reset your password
          </Text>
        </View>
        <Item style={[styles[`itemStyle${mode}`], { marginTop: 20 }]}>
          <Input
            style={styles[`textInput${mode}`]}
            placeholder="Email"
            placeholderTextColor={mode == "dark" ? "#fff" : "#000"}
            keyboardAppearance={mode}
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
            <Text style={styles[`errorMessage${mode}`]}>{emailError}</Text>
          ) : null}
        </View>

        <Text style={styles.errorMessage}>{loginError}</Text>

        <View>
          <Button
            onPress={() => {
              handleSubmit();
            }}
            activeOpacity={0.95}
            style={styles.registerButton}
            block
          >
            {buttonLoader ? (
              <>
                <Spinner color="#fff" size="small" />
              </>
            ) : (
              <>
                <Text style={styles.buttonText}>Send my reset link</Text>
              </>
            )}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  containerlight: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerdark: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  kContainer: {
    flex: 1,
  },
  itemStyledark: {
    borderColor: "#ffffff00",
    backgroundColor: "#ffffff10",
    marginLeft: 20,
    marginRight: 20,

    borderRadius: 5,
  },
  itemStylelight: {
    borderColor: "#ffffff00",
    backgroundColor: "#00000020",
    marginLeft: 20,
    marginRight: 20,

    borderRadius: 5,
  },
  tinyText: {
    fontSize: 12,
    marginTop: 17,
  },

  registerButton: {
    backgroundColor: "#111111",
    height: 50,

    width: width - 40,
    paddingLeft: 30,
    paddingRight: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  loginButton: {
    backgroundColor: "#111111",
    height: 50,

    width: width - 40,
    paddingLeft: 30,
    paddingRight: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  buttonText: {
    color: "white",
  },
  subtextlight: {
    textAlign: "center",
    color: "black",
    marginTop: 20,
    marginBottom: 20,
  },

  subtextdark: {
    textAlign: "center",
    color: "white",
    marginTop: 20,
    marginBottom: 20,
  },
  errorMessagelight: {
    color: "#00000090",

    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
  },
  errorMessagedark: {
    color: "#ffffff70",

    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
  },
  loginInfo: {
    color: "#fff",

    fontSize: 15,
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  textInputlight: {
    color: "#000",
    fontSize: 14,
    paddingLeft: 25,
  },
  textInputdark: {
    color: "#ffffff",
    fontSize: 14,
    paddingLeft: 25,
  },
});
