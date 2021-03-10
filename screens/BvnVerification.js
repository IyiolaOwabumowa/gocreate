import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spinner  } from "native-base";
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

  const token = useSelector((state) => state.authReducer.token);

  const [creating, setCreating] = useState(false);
  const [bvn, setBvn] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [bankName, setBankName] = useState("")
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
    props.navigation.navigate("Dashboard");
  };

  const verifyBvn = (bvn, bank_code, account_number) => {
   console.log( bvn, bank_code, account_number )
    if (bvn.length == 0 || bankCode.length == 0  || accountNumber.length == 0 ) {
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
    } else if(bvn.length < 11){
      setCreating(false);
      Toast.show({
        text: "Your BVN should be 11 characters",
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
    }
    else if(account_number < 10){
      setCreating(false);
      Toast.show({
        text: "Your account number should be 10 characters",
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
    }else {

      return axios
        .post(
          "https://web.gocreateafrica.app/api/v1/accounts/verify/bvn/",
          {
            bvn,
            bank_code,
            account_number,
            bank_name: bankName
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response)
          // const successObject = { status: response.status, data: response.data };
          if (response.status == 200) {
            Alert.alert(
              "Confirmation Successful",
              "Your BVN has been confirmed successfully",
              [
                {
                  text: "Go to my dashboard",
                  onPress: () => {
                    navigateDashboard();
                  },
                },
              ],
              { cancelable: false }
            );
            setCreating(false);
          }
          if (response.status == 400) {
            setScreenError(response.data.message);
            setCreating(false);
          }
        })
        .catch(function (error) {
          console.log(error.response.data )
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

        {/* <View >
          <Text style={[styles.loginInfo, {marginTop:30}]}>Enter your account details</Text>
        </View> */}
        <View
          style={{
            backgroundColor: "#010114",
            borderRadius: 5,
            margin: 20,
            padding: 20,
            paddingBottom: 20,
          }}
        >
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

          <Item regular style={[styles.itemStyle, { marginTop: 20 }]}>
            <Input
              style={styles.textInput}
              placeholder="Bank Verification Number (BVN)"
              placeholderTextColor="#fff"
              spellCheck={false}
              keyboardType="numeric"
              autoCapitalize="words"
              maxLength={11}
              value={bvn}
              onChangeText={(text) => {
                setBvn(text);
                setBvnError(validateInput({ type: "name", value: text }));
                dispatch(authActions.clearErrors());
              }}
            />
          </Item>
          <View>
            {bvnError ? (
              <Text style={styles.errorMessage}>{bvnError}</Text>
            ) : null}
          </View>
          <DropDownPicker
            items={Banks}
            defaultValue={bankCode}
            containerStyle={{
              height: 52,
              marginTop: 20,
              marginRight: 20,
              marginLeft: 20,
            }}
            style={{ backgroundColor: "#ffffff30", borderColor: "#00000000" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{
              backgroundColor: "#cdcdcd",
              borderColor: "#00000000",
            }}
            placeholder="Select your bank"
            placeholderStyle={{
              fontFamily: "Trebuchet",
              color: "#fff",
            }}
            labelStyle={{
              fontFamily: "Trebuchet",
              textAlign: "left",
              color: "#fff",
            }}
            searchable={true}
            searchablePlaceholder="Search for your bank"
            searchablePlaceholderTextColor="white"
            searchableError={() => <Text>Bank not found</Text>}
            onChangeItem={(item) => {
              setBankCode(item.value);
              setBankName(item.label)
              setBankCodeError(
                validateInput({ type: "name", value: item.value })
              );
            }}
          />
          <View>
            {bankCodeError ? (
              <Text style={styles.errorMessage}>{bankCodeError}</Text>
            ) : null}
          </View>
          <Item regular style={[styles.itemStyle, { marginTop: 20 }]}>
            <Input
              style={styles.textInput}
              placeholder="Account Number"
              placeholderTextColor="#fff"
              spellCheck={false}
              autoCapitalize="words"
              value={accountNumber}
              keyboardType="numeric"
              maxLength= {10}
              onChangeText={(text) => {
                setAccountNumber(text);
                setAccountNumberError(
                  validateInput({ type: "name", value: text })
                );
                dispatch(authActions.clearErrors());
              }}
            />
          </Item>
          <View>
            {accountNumberError ? (
              <Text style={styles.errorMessage}>{accountNumberError}</Text>
            ) : null}
          </View>

          <View style={{ marginTop: 20 }}>
            <Button
              onPress={() => {
                setCreating(true);
                verifyBvn(bvn, bankCode, accountNumber);
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
                  <Text style={styles.buttonText}>Verify</Text>
                </>
              )}
            </Button>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {Platform.OS === "ios" ? (
                <Image
                  source={require("../assets/paystack.png")}
                  style={{
                    marginTop: 30,

                    width: "30%",
                    height: 40,
                    resizeMode: "contain",
                  }}
                />
              ) : (
                <Image
                  source={{ uri: "asset:/images/paystack.png" }}
                  style={{
                    marginTop: 20,
                    width: "30%",
                    height: 40,
                    resizeMode: "contain",
                  }}
                />
              )}
             
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default BvnVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101820FF",
  },
  kContainer: {
    flex: 1,
  },

  textInput: {
    fontFamily: "Trebuchet",
    color: "#ffffff",
    fontSize: 14,
    paddingLeft: 10,
  },
  itemStyle: {
    borderColor: "#cdcdcd00",
    backgroundColor: "#ffffff30",
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
  },
  buttonText: {
    color: "white",
    fontFamily: "Trebuchet",
  },
  errorMessage: {
    fontFamily: "Trebuchet",
    color: "#fff",
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
