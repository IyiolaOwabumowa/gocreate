import React, { useState, useEffect } from "react";
import { Asset } from "expo-asset";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  Platform,
  Dimensions,
  Keyboard,
} from "react-native";
import { Button, Input, Item, Spinner } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Splash from "./Splash";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

const width = Dimensions.get("window").width;

const SplashOptions = (props) => {
  const [LogoImage, setLogoImage] = useState(null);
  const [ready, setReady] = useState(false);
  const mode = useSelector((state) => state.userReducer.mode);

  const iosBg = require("../assets/bg-app.png");
  const androidBg = { uri: "asset:/images/bg-app.png" };
  const iosLogo = require("../assets/logo.png");
  const androidLogo = { uri: "asset:/images/logo.png" };

  let imageBg = Platform.OS === "ios" ? iosBg : androidBg;
  let logo = Platform.OS === "ios" ? iosLogo : androidLogo;

  // useEffect(() => {
  //   // const loadImages = async () => {
  //   //   await Asset.loadAsync(logo);
  //   //   setReady(true);
  //   // };

  //   // loadImages();

  //   return () => {
  //     setReady(false);
  //   };
  // }, []);

  // if (!ready) {
  //   return <Splash />;
  // }

  return (
    <View style={styles[`container${mode}`]}>
      <StatusBar
        barStyle={mode == "light" ? "dark-content" : "light-content"}
      />
      {/* <Image source={logo} style={styles.LogoTop} /> */}

      {Platform.OS === "ios" ? (
        <Image
          source={require("../assets/logo.png")}
          style={{ width: "40%", height: "30%", resizeMode: "contain" }}
        />
      ) : (
        <Image
          source={{ uri: "asset:/images/logo.png" }}
          style={{ width: "40%", height: "30%", resizeMode: "contain" }}
        />
      )}

      <View>
        {/* <Text style={styles[`subtext${mode}`]}>
          Access your GoCreate Account
        </Text> */}

        <Button
          onPress={() => {
            props.navigation.navigate("Login");
          }}
          activeOpacity={0.9}
          style={styles.loginButton}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </Button>
        <Button
          onPress={() => {
            props.navigation.navigate("PersonalInfo");
          }}
          activeOpacity={0.9}
          style={styles.registerButton}
        >
          <Text style={styles.buttonText}>Create an account</Text>
        </Button>
      </View>

      {/* {Platform.OS === "ios" ? (
          <Image
            source={require("../assets/ad-1.jpeg")}
            style={{ width: width, height: 100, marginTop:40, resizeMode: "contain" }}
          />
        ) : (
          <Image
            source={{ uri: "asset:/images/ad-1.jpeg" }}
            style={{ width: width, height: 100,  marginTop:40,  resizeMode: "contain" }}
          />
        )} */}
      <View style={{ position: "absolute", bottom: 80 }}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("ForgotPassword");
          }}
          activeOpacity={0.7}
        >
          <Text style={styles[`subtext${mode}`]}>
            Forgot Your Password? Click Here!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SplashOptions;

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
    fontWeight: "500",
    color: "black",
    marginBottom: 20,
  },

  subtextdark: {
    textAlign: "center",
    fontWeight: "500",
    color: "white",
    marginBottom: 20,
  },

  LogoTop: {
    width: "50%",
    resizeMode: "contain",
  },
  registerButton: {
    backgroundColor: "#111",
    height: 50,
    width: width - 60,
    marginTop: 15,
    paddingLeft: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 30,
  },
  registerButtondark: {
    backgroundColor: "#ffffff",
    height: 50,
    width: width - 60,
    marginTop: 15,
    paddingLeft: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 30,
  },
  loginButton: {
    backgroundColor: "#9DC828",
    height: 50,
    marginTop: 15,
    width: width - 60,
    paddingLeft: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 30,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
  },
});
