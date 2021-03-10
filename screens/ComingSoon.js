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
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, Input, Item } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import validateInput from "../assets/utils/validation";

const width = Dimensions.get("window").width;

function ComingSoon() {
  const dispatch = useDispatch();
  const buttonLoader = useSelector((state) => state.authReducer.buttonLoader);


  const handleSubmit = ()=>{
    dispatch(authActions.deleteUserToken())
  }

  return (
    <View style={styles.container}>
  
        {Platform.OS === "ios" ? (
          <Image
            source={require("../assets/logo.png")}
            style={{ width: "40%", height: 90, resizeMode: "contain" }}
          />
        ) : (
          <Image
            source={{ uri: "asset:/images/logo.png" }}
            style={{ width: "40%", height: "30%", resizeMode: "contain" }}
          />
        )}
        <Text style={{paddingLeft:40, paddingRight:40, marginTop:50, marginBottom:50, fontSize:20, textAlign:"center", fontFamily:"Trebuchet", color:"#9DC828" , lineHeight:40}}>
          Thank you for having an account with us.
         {"\n"} <Text style={{ fontSize:17, textAlign:"center", color:"#1B5671"}}> We'll notify you when we launch!</Text>
        </Text>
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
                <Text style={styles.buttonText}>LOGOUT</Text>
              </>
            )}
          </Button>
        </View>
    
    </View>
  );
}

export default ComingSoon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  kContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
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
    height: 60,
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
    color: "#000",
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
  },
  loginInfo: {
    color: "#575757",
    fontFamily: "Trebuchet",
    marginTop: 20,
    textAlign: "center",
  },
});
