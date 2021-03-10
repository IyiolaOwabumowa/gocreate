import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spinner, Toast } from "native-base";
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
import { Button, Input, Item } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import validateInput from "../assets/utils/validation";
import { TextInputMask } from "react-native-masked-text";
import IntlPhoneInput from "react-native-intl-phone-input";

const width = Dimensions.get("window").width;
const iosBg = require("../assets/bg-app.png");
const androidBg = { uri: "asset:/images/bg-app.png" };
const iosLogo = require("../assets/logo.png");
const androidLogo = { uri: "asset:/images/logo.png" };

let imageBg = Platform.OS === "ios" ? iosBg : androidBg;
let logo = Platform.OS === "ios" ? iosLogo : androidLogo;

const PersonalInformation = (props) => {
  const dispatch = useDispatch();
  const buttonLoader = useSelector((state) => state.authReducer.buttonLoader);
  const message = useSelector((state) => state.authReducer.toastMessage);
  const errorMessage = useSelector((state) => state.authReducer.errorMessage);
  const registered = useSelector((state) => state.authReducer.registered);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    // if (registered) {
    //   props.navigation.navigate("OTP", { phone });
    // }
    
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

    if (
      email == null &&
      firstName == null &&
      lastName == null &&
      phone == null
    ) {
      dispatch(authActions.clearErrors());
    }
  }, [email, firstName, lastName, phone, message, registered]);

  const handleSubmit = () => {
    const validateEmail = validateInput({ type: "email", value: email });
    const validateFirstName = validateInput({
      type: "name",
      value: firstName,
    });
    const validateLastName = validateInput({
      type: "name",
      value: lastName,
    });

    const validatePhone = validateInput({
      type: "name",
      value: phone,
    });

    setEmailError(validateEmail);
    setFirstNameError(validateFirstName);
    setLastNameError(validateLastName);
    setPhoneError(validatePhone);

    if (
      emailError == null &&
      firstNameError == null &&
      (lastNameError == null) & (phoneError == null)
    ) {
      const signUp = async () => {
        console.log(email, firstName, lastName, phone)
        dispatch(authActions.signup(email, firstName, lastName, phone));
      };
      signUp();
      // setTimeout(()=>{
      //   setCreating(false)
      //

      // }, 3000)
    }
    Keyboard.dismiss();
  };

  const onChangeText = ({
    dialCode,
    unmaskedPhoneNumber,
    phoneNumber,
    isVerified,
  }) => {
    setPhone(dialCode + "" + unmaskedPhoneNumber);
      setPhoneError(validateInput({ type: "name", value: unmaskedPhoneNumber }));
    dispatch(authActions.clearErrors());
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
        extraScrollHeight={50}
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

        <View style={{ marginTop: 20 }}>
          <Text style={{...styles.loginInfo, lineHeight: 30}}>Sign up with your details below {"\n"} Click on the flag to change your country code</Text>
        </View>
        <Item style={[styles.itemStyle, { marginTop: 40 }]}>
          <Input
            style={styles.textInput}
            placeholder="First Name"
            placeholderTextColor="#fff"
            keyboardAppearance={"dark"}
            spellCheck={false}
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              setFirstNameError(validateInput({ type: "name", value: text }));
              dispatch(authActions.clearErrors());
            }}
          />
        </Item>
        <View>
          {firstNameError ? (
            <Text style={styles.errorMessage}>{firstNameError}</Text>
          ) : null}
        </View>

        <Item style={[styles.itemStyle, { marginTop: 20 }]}>
          <Input
            style={styles.textInput}
            placeholder="Last Name"
            placeholderTextColor="#fff"
            keyboardAppearance={"dark"}
            spellCheck={false}
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              setLastNameError(validateInput({ type: "name", value: text }));
              dispatch(authActions.clearErrors());
            }}
          />
        </Item>
        <View>
          {lastNameError ? (
            <Text style={styles.errorMessage}>{lastNameError}</Text>
          ) : null}
        </View>
       
     <View style={{marginLeft: 20}}>
            <IntlPhoneInput
              containerStyle={{ backgroundColor: "#101820FF", color: "white" }}
              phoneInputStyle={{ color: "white" }}
              dialCodeTextStyle={{ color: "white", marginLeft: 10 }}
              onChangeText={onChangeText}
              defaultCountry="NG"
            />
            </View>
     
  
        <View>
          {phoneError ? (
            <Text style={styles.errorMessage}>{phoneError}</Text>
          ) : null}
        </View>

        <Item style={[styles.itemStyle, { marginTop:  0}]}>
          <Input
            style={styles.textInput}
            placeholder="Email Address"
            placeholderTextColor="#fff"
            keyboardType="email-address"
            keyboardAppearance={"dark"}
            spellCheck={false}
            autoCapitalize="none"
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

        <View>
          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}
        </View>

        <View>
          <Button
            onPress={() => {
              setCreating(true);
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
                <Text style={styles.buttonText}>Continue</Text>
              </>
            )}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default PersonalInformation;

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

    height: 40,
    width: width - 40,
    marginTop: 15,
    paddingLeft: 30,
    justifyContent: "space-between",
    paddingRight: 30,
  },
  loginButton: {
    backgroundColor: "#1A5C79",
    height: 50,
    marginTop: 15,
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
    marginTop: 20,
    textAlign: "center",
  },
});
