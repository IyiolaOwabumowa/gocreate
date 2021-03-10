import React from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  
  Platform,
} from "react-native";
import { Spinner } from "native-base";
import CachedImage from 'react-native-expo-cached-image';


const Splash = (props) => {
  const iosBg = require("../assets/bg-app-splash.png");
  const androidBg = { uri: "asset:/images/bg-app-splash.png" };

  let imageBg = Platform.OS === "ios" ? iosBg : androidBg;

  return (   
    <ImageBackground source={imageBg} style={styles.container}>

      <View
        style={{ flex: 1, justifyContent: "flex-end", alignItems:"flex-end", marginRight: 40 }}
      >
        {Platform.OS === "ios" ? (
          <Image  
            source={require("../assets/logo.png")}
            style={{
              width: "40%",
              height: "40%",
              resizeMode: "contain",
              marginRight: 10,
            }}
          />
        ) : (
          <Image
            source={{ uri: "asset:/images/logo.png" }}
            style={{ width: "40%", height: "40%", resizeMode: "contain" }}
          />
        )}
      </View>
      {props.loader ? <Spinner color="#fff" size="small" /> : null}
    </ImageBackground>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
