import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { authActions } from "../src/actions/auth.actions";
import {
  StyleSheet,
  StatusBar,
  Text,
  Platform,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { Button, Input, Item } from "native-base";
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

const Login = (props) => {
  const dispatch = useDispatch();
  const loggingIn = useSelector((state) => state.authReducer.loggingIn);
  const loginError = useSelector((state) => state.authReducer.errorMessage);
  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (email == null && password == null) {
      dispatch(authActions.clearErrors());
    }
  }, [email, password]);

  const handleSubmit = () => {
    const validateEmail = validateInput({ type: "email", value: email });
    const validatePassword = validateInput({
      type: "password",
      value: password,
    });

    setEmailError(validateEmail);
    setPasswordError(validatePassword);

    if (emailError == null && passwordError == null) {
      dispatch(authActions.login(email, password));
    }

    Keyboard.dismiss();
  };

  return (
    <ImageBackground  style={styles.container}>
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

        <View>
          <Text style={styles.loginInfo}>Enter your login details</Text>
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
        <Item style={[styles.itemStyle, { marginTop: 15 }]}>
          <Input
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor="#fff"
            secureTextEntry={true}
            keyboardAppearance={"dark"}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(
                validateInput({ type: "password", value: text })
              );

              dispatch(authActions.clearErrors());
            }}
          />
        </Item>
        <View>
          {passwordError ? (
            <Text style={styles.errorMessage}>{passwordError}</Text>
          ) : null}
        </View>

        {loginError ? (
          <Text style={styles.errorMessage}>{loginError}</Text>
        ) : null}

        <View style={{ marginTop: 10 }}>
          <Button
            onPress={() => {
              handleSubmit();
            }}
            activeOpacity={0.95}
            style={styles.loginButton}
            block
          >
            {loggingIn ? (
              <>
                <Spinner color="#fff" size="small" />
              </>
            ) : (
              <>
                <Text style={styles.buttonText}>SIGN IN</Text>
              </>
            )}
          </Button>
          {/* {Platform.OS === "ios" ? (
            <Image
              source={require("../assets/ad-2.jpeg")}
              style={{
                width: width,
                height: 100,
                marginTop: 20,
                resizeMode: "contain",
              }}
            />
          ) : (
            <Image
              source={{ uri: "asset:/images/ad-2.jpeg" }}
              style={{
                width: width,
                height: 100,
                marginTop: 20,
                resizeMode: "contain",
              }}
            />
          )} */}

          <View style={{ marginTop: 50 }}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("PersonalInfo");
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tinyText,
                  { textAlign: "center", color: "white", fontSize: 14 },
                ]}
              >
                Don't have an account? Sign Up
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("ForgotPassword");
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tinyText,
                  {
                    fontSize: 14,
                    textAlign: "center",
                    color: "white",
                    marginTop: 30,
                  },
                ]}
              >
                Forgot Password? Click Here!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default Login;

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
    color: "#ffffff",
    fontSize: 14,
    paddingLeft: 25,
  },
  itemStyle: {
    borderColor: "#ffffff00",
    backgroundColor: "#ffffff10",
    marginLeft: 20,
    marginRight: 20,

    borderRadius: 5,
  },
  tinyText: {
    fontFamily: "Trebuchet",
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
    marginTop:20,
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
    fontFamily: "Trebuchet",
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
  },
  loginInfo: {
    color: "white",
    fontFamily: "Trebuchet",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 15,
  },
});
