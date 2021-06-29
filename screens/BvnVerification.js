import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "native-base";
import axios from "axios";

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
  Alert,
} from "react-native";
import { Button, Input, Item, Toast } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import validateInput from "../assets/utils/validation";
import DropDownPicker from "react-native-dropdown-picker";
import { ScrollView } from "react-native-gesture-handler";
import Banks from "../src/utils/bank";
import bank from "../src/utils/bank";
import { userActions } from "../src/actions/user.actions";

const width = Dimensions.get("window").width;
const iosBg = require("../assets/bg-app.png");
const androidBg = { uri: "asset:/images/bg-app.png" };
const iosLogo = require("../assets/logo.png");
const androidLogo = { uri: "asset:/images/logo.png" };

let imageBg = Platform.OS === "ios" ? iosBg : androidBg;
let logo = Platform.OS === "ios" ? iosLogo : androidLogo;

const BvnVerification = (props) => {
  const dispatch = useDispatch();
  const buttonLoader = useSelector((state) => state.authReducer.buttonLoader);
  const message = useSelector((state) => state.authReducer.toastMessage);
  const mode = useSelector((state) => state.userReducer.mode);

  const token = useSelector((state) => state.authReducer.token);

  const [creating, setCreating] = useState(false);
  const [bvn, setBvn] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [bankName, setBankName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [middleNameError, setMiddleNameError] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [bvnError, setBvnError] = useState("");
  const [accountNumberError, setAccountNumberError] = useState("");
  const [bankCodeError, setBankCodeError] = useState("");
  const [screenError, setScreenError] = useState(null);

  useEffect(() => {
    // if (password != "" && confirmPassword != "") {
    //   setPasswordError(
    //     validateInput({
    //       type: "password",
    //       value: password,
    //     })
    //   );
    //   setConfirmPasswordError(
    //     validateInput({
    //       type: "password",
    //       value: confirmPassword,
    //     })
    //   );
    // }
    // console.log(token)
  }, []);

  const navigateDashboard = () => {
    props.navigation.goBack();
  };

  const verifyBvn = (bank_code, account_number) => {
    console.log(account_number.length);
    if (bankCode.length == 0 || accountNumber.length == 0) {
      setCreating(false);
      Toast.show({
        text: "Please recheck all fields",
        textStyle: {
          fontSize: 14,
          paddingLeft: 10,
        },
        duration: 10000,
        style: {
          backgroundColor: "red",
        },
        onClose: () => {
          dispatch(authActions.clearToastMessage());
        },
      });
    } else if (account_number.length < 10) {
      setCreating(false);
      Toast.show({
        text: "Your account number should be 10 digits",
        textStyle: {
          fontSize: 14,
          paddingLeft: 10,
        },
        duration: 10000,
        style: {
          backgroundColor: "red",
        },
        onClose: () => {
          dispatch(authActions.clearToastMessage());
        },
      });
    } else {
      return axios
        .post(
          "https://web.gocreateafrica.app/api/v1/accounts/verify/bvn/",
          {
            bank_code,
            account_number,
            bank_name: bankName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          // const successObject = { status: response.status, data: response.data };
          if (response.status == 200) {
            // Alert.alert(
            //   "Confirmation Successful",
            //   "Your account has been updated successfully",
            //   [
            //     {
            //       text: "Go to my dashboard",
            //       onPress: () => {
            //         navigateDashboard();
            //       },
            //     },
            //   ],
            //   { cancelable: false }
            // );
            Toast.show({
              text: "We've updated your bank details successfully",
              textStyle: {
                fontSize: 14,
                paddingLeft: 10,
              },
              duration: 3000,
              style: {
                backgroundColor: "#9DC828",
              },
              onClose: () => {
                dispatch(authActions.clearToastMessage());
                props.navigation.goBack();
              },
            });

            setCreating(false);
          }
          if (response.status == 400) {
            setScreenError(response.data.message);
            setCreating(false);
          }
        })
        .catch(function (error) {
          if (error.response.status == 400) {
            setScreenError(error.response.data.message);
            setCreating(false);
          }
          if (error.response) {
            // Request made and server responded
            const values = Object.values(error.response.data);
            const errorObject = {
              status: error.response.status,
              error: values[0],
            };
            // for (const value of values) {
            //   console.log(value[0])
            // }
            //console.log(error.response.data.message);
            setCreating(false);

            setScreenError(error.response.data.message);

            return errorObject;
          }
        });
    }
  };
  return (
    <ImageBackground style={styles[`container${mode}`]}>
      <StatusBar
        barStyle={mode == "light" ? "dark-content" : "light-content"}
      />

      {/* <View >
          <Text style={[styles.loginInfo, {marginTop:30}]}>Enter your account details</Text>
        </View> */}

      <View>
        {screenError ? (
          <Text
            style={[
              styles.errorMessage,
              { color: "white", textAlign: "center", marginBottom: 30 },
            ]}
          >
            {screenError}
          </Text>
        ) : null}
      </View>
      {/* <Item regular style={[styles.itemStyle]}>
          <Input
            style={styles.textInput}
            placeholder="First Name"
            placeholderTextColor="#ffffff"
            spellCheck={false}
            autoCapitalize="words"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              setFirstNameError(validateInput({ type: "name", value: text }));
              dispatch(authActions.clearErrors());
            }}
          />
        </Item>
        <Item regular style={[styles.itemStyle, { marginTop: 20 }]}>
          <Input
            style={styles.textInput}
            placeholder="Last Name"
            placeholderTextColor="#ffffff"
            spellCheck={false}
            autoCapitalize="words"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              setLastNameError(validateInput({ type: "name", value: text }));
              dispatch(authActions.clearErrors());
            }}
          />
        </Item>
        <Item regular style={[styles.itemStyle, { marginTop: 20 }]}>
          <Input
            style={styles.textInput}
            placeholder="Middle Name"
            placeholderTextColor="#ffffff"
            spellCheck={false}
            autoCapitalize="words"
            value={middleName}
            onChangeText={(text) => {
              setMiddleName(text);
              setMiddleNameError(validateInput({ type: "name", value: text }));
              dispatch(authActions.clearErrors());
            }}
          />
        </Item> */}

      <View>
        {bvnError ? <Text style={styles.errorMessage}>{bvnError}</Text> : null}
      </View>
      <DropDownPicker
        items={Banks}
        defaultValue={bankCode}
        containerStyle={{
          height: 52,
          marginTop: 20,
        }}
        style={{
          backgroundColor: mode == "light" ? "#00000030" : "#ffffff30",
          borderColor: "#00000000",
        }}
        itemStyle={{
          justifyContent: "flex-start",
        }}
        dropDownStyle={{
          backgroundColor: mode == "light" ? "#cdcdcd" : "#000",
          borderColor: "#00000000",
        }}
        placeholder="Select your bank"
        placeholderStyle={{
          color: mode == "light" ? "black" : "#fff",
        }}
        labelStyle={{
          textAlign: "left",
          color: mode == "light" ? "black" : "#fff",
        }}
        searchable={true}
        searchableStyle={{ color: mode == "light" ? "black" : "#fff" }}
        searchablePlaceholder="Search for your bank"
        searchablePlaceholderTextColor={mode == "light" ? "#00000080" : "white"}
        searchableError={() => <Text style={{color: mode == "light" ? "black" : "#fff"}}>Bank not found</Text>}
        onChangeItem={(item) => {
          setBankCode(item.value);
          setBankName(item.label);
          setBankCodeError(validateInput({ type: "name", value: item.value }));
        }}
      />
      <View>
        {bankCodeError ? (
          <Text style={styles.errorMessage}>{bankCodeError}</Text>
        ) : null}
      </View>
      <Item regular style={[styles[`itemStyle${mode}`], { marginTop: 20 }]}>
        <Input
          style={styles[`textInput${mode}`]}
          placeholder="Account Number"
          placeholderTextColor={mode == "light" ? "#000" : "#fff"}
          spellCheck={false}
          autoCapitalize="words"
          value={accountNumber}
          keyboardType="numeric"
          maxLength={10}
          onChangeText={(text) => {
            setAccountNumber(text);
            setAccountNumberError(validateInput({ type: "name", value: text }));
            dispatch(authActions.clearErrors());
          }}
        />
      </Item>
      <View>
        {accountNumberError ? (
          <Text style={styles[`errorMessage${mode}`]}>
            {accountNumberError}
          </Text>
        ) : null}
      </View>

      <View style={{ marginTop: 20 }}>
        <Button
          onPress={() => {
            setCreating(true);
            verifyBvn(bankCode, accountNumber);
          }}
          activeOpacity={0.95}
          style={styles[`button${mode}`]}
          block
        >
          {creating ? (
            <>
              <Spinner color="#fff" size="small" />
            </>
          ) : (
            <>
              <Text style={styles.buttonText}>Update Details</Text>
            </>
          )}
        </Button>
      </View>
    </ImageBackground>
  );
};

export default BvnVerification;

const styles = StyleSheet.create({
  containerlight: {
    flex: 1,
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
  },
  containerdark: {
    flex: 1,
    backgroundColor: "#000000",
    paddingLeft: 10,
    paddingRight: 10,
  },
  kContainer: {
    flex: 1,
  },

  textInputdark: {
    color: "#ffffff",
    fontSize: 14,
    paddingLeft: 10,
  },
  textInputlight: {
    color: "#000",
    fontSize: 14,
    paddingLeft: 10,
  },
  itemStyledark: {
    borderColor: "#cdcdcd00",
    backgroundColor: "#ffffff30",

    borderRadius: 5,
  },
  itemStylelight: {
    borderColor: "#cdcdcd00",
    backgroundColor: "#00000030",

    borderRadius: 5,
  },
  tinyText: {
    fontSize: 12,
    marginTop: 17,
  },

  registerButton: {
    backgroundColor: "#111111",

    height: 60,
    width: width - 40,
    marginTop: 15,
    paddingLeft: 30,
    justifyContent: "space-between",
    paddingRight: 30,
  },
  buttonlight: {
    backgroundColor: "#11111190",
    height: 55,

    paddingLeft: 30,
    paddingRight: 30,
  },
  buttondark: {
    backgroundColor: "#111",
    height: 55,

    paddingLeft: 30,
    paddingRight: 30,
  },
  buttonText: {
    color: "white",
  },
  errorMessagedark: {
    color: "#fff",
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
  },
  errorMessagelight: {
    color: "#000",
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
  },
  loginInfo: {
    color: "#000",

    fontSize: 15,
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
});
