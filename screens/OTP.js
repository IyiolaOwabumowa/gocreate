import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import axios from "axios";

import { authActions } from "../src/actions/auth.actions";
import {
  StyleSheet,
  StatusBar,
  Platform,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
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

const OTP = ({ route, navigation }, props) => {
  const dispatch = useDispatch();
  const buttonLoader = useSelector((state) => state.authReducer.buttonLoader);
  const message = useSelector((state) => state.authReducer.toastMessage);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [checked, setChecked] = useState(false);
  const [otp, setOtp] = useState(null);
  const { phone } = route.params;

  useEffect(() => {
    resendOtp();
  }, []);

  useEffect(() => {
    if (numDigits(otp) == 6) {
      setCreating(true);
      sendOtp(otp);
    }
  }, [otp]);

  const navigateBvnScreen = () => {
    props.navigation.navigate("BvnVerification");
    setCreating(false);
  };
  function numDigits(x) {
    return Math.max(Math.floor(Math.log10(Math.abs(x))), 0) + 1;
  }
  const sendOtp = () => {
    setCreating(true);
    return axios
      .post(
        `https://web.gocreateafrica.app/api/v1/accounts/otp/verify/`,
        { phone, otp }
      )
      .then((res) => {
        console.log(res.status);

        Alert.alert(
          "Verification Successful",
          "Your phone number has been verified",
          [
            {
              text: "Return to Dashboard",
              onPress: () => {
                
                navigation.navigate("Dashboard");
              },
            },
          ],
          { cancelable: false }
        );

        setCreating(false);
      })
      .catch((err) => {
        console.log(err.response.data);
        Alert.alert("Incorrect OTP code");
        setCreating(false);
      });
  };
  const resendOtp = () => {
    setCreating(true);
    return axios
      .post(
        `https://web.gocreateafrica.app/api/v1/accounts/otp/resend/`,
        { phone, otp: "000000" }
      )
      .then((res) => {
        console.log(res.status);

        Alert.alert(
          "We've sent an otp to your registered phone number",
          "Click OK to continue",
          [
            {
              text: "OK",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );

        setCreating(false);
      })
      .catch((err) => {
        console.log(err.response.data);
        Alert.alert("Incorrect OTP code");
        setCreating(false);
      });
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
          style={{ backgroundColor: "#010114", margin: 20, borderRadius: 5 }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ padding: 40, color: "white", textAlign: "center" }}>
              Enter the OTP we sent to{" "}
              <Text style={{ fontWeight: "700" }}>{phone}</Text>
            </Text>

            <TouchableOpacity onPress={resendOtp} activeOpacity={0.8}>
              <Text
                style={{
                  paddingLeft: 40,
                  paddingRight: 40,
                  color: "white",
                  textAlign: "center",
                }}
              >
                Didn't receive an OTP?{"\n"}
                <Text style={{ fontWeight: "700", color: "#1A5C79" }}>
                  Click to resend
                </Text>
              </Text>
            </TouchableOpacity>
            <OTPInputView
              style={{ width: "80%", height: 200, padding: 20 }}
              pinCount={6}
              // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
              onCodeChanged={(code) => {
                setOtp(code);
                // if (numDigits(code) == 6) {
                //   setCreating(true);
                //   sendOtp(code);
                // }
              }}
              // autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={(code) => {
                console.log("code filled");
              }}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Button
              onPress={sendOtp}
              style={styles.loginButton}
              activeOpacity={0.95}
              block
            >
              {creating ? (
                <>
                  <Spinner color="#fff" size="small" />
                </>
              ) : (
                <>
                  <Text style={styles.buttonText}>Continue</Text>
                </>
              )}
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default OTP;

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
    backgroundColor: "#1A5C79",
    height: 55,

    paddingLeft: 30,
    paddingRight: 30,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 30,
  },
  disabledButton: {
    backgroundColor: "#cdcdcd",
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

  borderStyleBase: {
    width: 30,
    height: 45,
    borderColor: "#000",
  },

  borderStyleHighLighted: {
    borderColor: "#fff",
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: "white",
    borderColor: "#fff",
  },

  underlineStyleHighLighted: {
    borderColor: "white",
  },
});
