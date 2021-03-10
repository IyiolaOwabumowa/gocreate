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
  Platform,
  ImageBackground,
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

const ResetPassword = (props) => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.authReducer.toastMessage);
 
  const [oldPassword, setOldPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState(null)
  const [newPasswordError, setNewPasswordError] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const [passwordError, setPasswordError] = useState(null);

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

    if (oldPassword == "" && newPassword == "" ) {
      dispatch(authActions.clearErrors());
    }
  }, [ message]);

  const handleSubmit = () => {
    console.log(password);
    if (oldPasswordError == null && newPasswordError == null) {
      if (oldPassword == "" && newPassword == "") {
        setOldPasswordError(
          validateInput({
            type: "password",
            value: oldPassword,
          })
        );
        setNewPasswordError(
          validateInput({
            type: "password",
            value: newPassword,
          })
        );
        setCreating(false);
      } else {
        console.log(oldPassword, newPassword)
          console.log("button clicked");
          dispatch(authActions.resetPassword(oldPassword, newPassword))
          setCreating(false);
      
      }
    }
    setCreating(false);
    Keyboard.dismiss();
  };

  return (
    <ImageBackground source={imageBg} style={styles.container}>
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
        <StatusBar barStyle="dark-content" />

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
          Change the password for your GoCreate account
          </Text>
        </View>
        <Item style={[styles.itemStyle, { marginTop: 20 }]}>
          <Input
            style={styles.textInput}
            placeholder="Enter your old password"
            placeholderTextColor="#fff"
            keyboardAppearance={"dark"}
            spellCheck={false}
            autoCapitalize="none"
            secureTextEntry={true}
            value={oldPassword}
            onChangeText={(text) => {
              setOldPassword(text);
              setOldPasswordError(
                validateInput({ type: "password", value: text })
              );
              dispatch(authActions.clearErrors());
            }}
          />
        </Item>
        <View>
          {oldPasswordError ? (
            <Text style={styles.errorMessage}>{oldPasswordError}</Text>
          ) : null}
        </View>

        <Item style={[styles.itemStyle, { marginTop: 20 }]}>
          <Input
            style={styles.textInput}
            placeholder="Enter your new password"
            placeholderTextColor="#fff"
            keyboardAppearance={"dark"}
            spellCheck={false}
            autoCapitalize="none"
            secureTextEntry={true}
            value={newPassword}
            onChangeText={(text) => {
              setOldPassword(text);
              setNewPasswordError(
                validateInput({ type: "password", value: text })
              );
              dispatch(authActions.clearErrors());
            }}
          />
        </Item>
        <View>
          {newPasswordError ? (
            <Text style={styles.errorMessage}>{newPasswordError}</Text>
          ) : null}
        </View>
        <View style={{ marginTop: 20 }}>
          <Button
            onPress={() => {
              setCreating(true);
              handleSubmit();
            }}
            activeOpacity={0.95}
            style={styles.loginButton}
            block
          >
            {creating ? (
              <>
                <Spinner color="#fff" size="small" />
              </>
            ) : (
              <>
                <Text style={styles.buttonText}>Change Password</Text>
              </>
            )}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,

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
    height: 55,

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
