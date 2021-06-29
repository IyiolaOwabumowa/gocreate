import React from 'react'
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
  } from "react-native";

  const width = Dimensions.get("window").width;

function Blank(){
    return(
      <View style={styles.container}>

      </View>
    )
}

export default Blank;



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    kContainer: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "#000",
    },
  
    textInput: {
      color: "#575757",
      fontSize: 14,
      paddingLeft: 25,
    },
    itemStyle: {
      borderColor: "#101010",
      backgroundColor: "#101010",
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
      backgroundColor: "#1a1a1a",
      height: 60,
      marginTop: 15,
      width: width - 40,
      paddingLeft: 30,
      justifyContent: "space-between",
      paddingRight: 30,
      marginLeft: 20,
      marginRight: 20,
    },
    buttonText: {
      color: "white",
      
    },
    errorMessage: {
      color: "#F46270",
      paddingLeft: 20,
      paddingRight: 20,
      marginTop: 10,
    },
    loginInfo: {
      color: "#575757",
      
      marginLeft: 20,
      marginTop: 20,
    },
  });
  