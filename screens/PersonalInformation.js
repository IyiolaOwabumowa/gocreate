import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spinner, Toast } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { authActions } from "../src/actions/auth.actions";
import CountryPicker, {
  DARK_THEME,
  FlagButton,
} from "react-native-country-picker-modal";
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
  Alert,
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
  const mode = useSelector((state) => state.userReducer.mode);
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
  const [countryError, setCountryError] = useState("");

  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [countryCode, setCountryCode] = useState(null);
  const [country, setCountry] = useState(null);
  const [countryPhone, setCountryPhone] = useState(null);
  const [callingCode, setCallingCode] = useState("");
  const [visible, setVisible] = useState(false);
  const [visiblePhone, setVisiblePhone] = useState(false);
  const [countryCodePhone, setCountryCodePhone] = useState(null);

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
    console.log(email, firstName, lastName, phone, country);

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
      value: `+${callingCode}${phone}`,
    });

    const validateCountry = validateInput({
      type: "name",
      value: `${country}`,
    });

    setEmailError(validateEmail);
    setFirstNameError(validateFirstName);
    setLastNameError(validateLastName);
    setPhoneError(validatePhone);
    setCountryError(validateCountry);
    if (
      emailError == null &&
      firstNameError == null &&
      lastNameError == null &&
      phoneError == null &&
      countryError == null
    ) {
      const signUp = async () => {
        console.log(email, firstName, lastName, phone, country);
        dispatch(
          authActions.signup(
            email,
            firstName,
            lastName,
            `+${callingCode}${phone}`,
            `${country}`
          )
        );
      };
      signUp();
    } else {
      setError("Kindly fill all fields and try again");
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
        extraScrollHeight={50}
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

        <View style={{ marginTop: 20 }}>
          <Text style={styles[`subtext${mode}`]}>
            Sign up with your details below
          </Text>
          {error ? (
            <Text
              style={[styles[`errorMessage${mode}`], { textAlign: "center" }]}
            >
              {error}
            </Text>
          ) : null}
        </View>
        <Item style={[styles[`itemStyle${mode}`], { marginTop: 20 }]}>
          <Input
            style={styles[`textInput${mode}`]}
            placeholder="First Name"
            placeholderTextColor={mode == "dark" ? "#fff" : "#000"}
            keyboardAppearance={mode}
            spellCheck={false}
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              setFirstNameError(validateInput({ type: "name", value: text }));
              dispatch(authActions.clearErrors());
            }}
          />
        </Item>

        <Item style={[styles[`itemStyle${mode}`], { marginTop: 20 }]}>
          <Input
            style={styles[`textInput${mode}`]}
            placeholder="Last Name"
            placeholderTextColor={mode == "dark" ? "#fff" : "#000"}
            keyboardAppearance={mode}
            spellCheck={false}
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              setLastNameError(validateInput({ type: "name", value: text }));
              dispatch(authActions.clearErrors());
            }}
          />
        </Item>

        <View
          style={[
            styles[`itemStyle${mode}`],
            {
              padding: 17,
              paddingLeft: 25,
              marginTop: 20,

              justifyContent: "center",
            },
          ]}
        >
          {visible ? (
            <CountryPicker
              theme={DARK_THEME}
              countryCode={countryCode}
              withFilter={true}
              withFlag={true}
              withCountryNameButton={true}
              withCallingCode={false}
              withEmoji={false}
              onSelect={(country) => {
                setCountry(country.name);
                setCountryCode(country.cca2);
                setVisible(false);
              }}
              visible={visible}
            />
          ) : null}

          {country !== null ? (
            <TouchableOpacity
              activeOpacity={0.89}
              onPress={() => {
                setVisible(true);
              }}
              style={{
                flex: 1,

                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FlagButton withEmoji={false} countryCode={countryCode} />
              <Text style={styles[`selectText${mode}`]}>{country}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.89}
              onPress={() => {
                setVisible(true);
              }}
            >
              <Text style={styles[`selectText${mode}`]}>
                Select your country
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View
          style={[
            styles[`itemStyle${mode}`],
            {
              padding: callingCode ? 1.5 : 17,
              paddingLeft: 25,
              marginTop: 20,

              justifyContent: "center",
            },
          ]}
        >
          {visiblePhone ? (
            <CountryPicker
              theme={DARK_THEME}
              countryCode={countryCodePhone}
              withFilter={true}
              withFlag={true}
              withCountryNameButton={true}
              withCallingCode={true}
              withEmoji={false}
              onSelect={(country) => {
                setCountryPhone(country.name);
                setCallingCode(country.callingCode);
                setCountryCodePhone(country.cca2);
                setVisiblePhone(false);
              }}
              visible={visiblePhone}
            />
          ) : null}

          {countryPhone !== null ? (
            <TouchableOpacity
              activeOpacity={0.89}
              onPress={() => {
                setVisiblePhone(true);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FlagButton
                withEmoji={false}
                countryCode={countryCodePhone}
                onOpen={() => {
                  setVisiblePhone(true);
                }}
              />
              <Text style={styles[`selectText${mode}`]}>+{callingCode}</Text>
              <Input
                keyboardType="number-pad"
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                }}
                style={[
                  styles[`selectText${mode}`],
                  { fontSize: 15, paddingBottom: 1 },
                ]}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.89}
              onPress={() => {
                setVisiblePhone(true);
              }}
            >
              <Text style={styles[`selectText${mode}`]}>
                Select your country code
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Item
          style={[
            styles[`itemStyle${mode}`],
            { marginTop: 20, marginBottom: 10 },
          ]}
        >
          <Input
            style={styles[`textInput${mode}`]}
            placeholder="Email Address"
            placeholderTextColor={mode == "dark" ? "#fff" : "#000"}
            keyboardType="email-address"
            keyboardAppearance={mode}
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
          {errorMessage ? (
            <Text style={styles[`errorMessage${mode}`]}>{errorMessage}</Text>
          ) : null}
        </View>

        <View>
          <Button
            onPress={() => {
              setCreating(true);
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
                <Text style={styles.buttonText}>Sign Up</Text>
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
  containerlight: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  containerdark: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },

  subtextlight: {
    textAlign: "center",

    color: "black",
    marginBottom: 20,
  },

  subtextdark: {
    textAlign: "center",

    color: "white",
    marginBottom: 20,
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

  kContainer: {
    flex: 1,
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
    backgroundColor: "#111111",
    height: 50,
    marginTop: 15,
    width: width - 40,
    paddingLeft: 30,
    paddingRight: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  loginButton: {
    backgroundColor: "#00000080",
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
  },
  errorMessagelight: {
    color: "#00000090",

    paddingLeft: 20,
    paddingRight: 20,
  },
  errorMessagedark: {
    color: "#ffffff70",

    paddingLeft: 20,
    paddingRight: 20,
  },
  loginInfo: {
    color: "#fff",

    marginTop: 20,
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
  selectTextlight: { color: "black", fontSize: 14 },
  selectTextdark: { color: "white", fontSize: 14 },
});
