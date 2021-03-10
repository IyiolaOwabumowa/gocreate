import React, { useState, useEffect, useLayoutEffect } from "react";
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
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Item } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTv,
  faPodcast,
  faStream,
  faPlay,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

const width = Dimensions.get("window").width;
const songSelected = null;

function Label(props) {
  return (
    <KeyboardAwareScrollView
    style={{ backgroundColor: "#101820FF" }}
    contentContainerStyle={styles.container}
    behavior="padding"
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}
    keyboardShouldPersistTaps="always"
    extraScrollHeight={50}
    enabled
    enableOnAndroid={true}
  >
      <View
        style={{
          backgroundColor: "#010114",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "grey",
            width: 100,
            height: 100,
            borderRadius: 5,
            marginTop: 30,
 
            marginBottom: 30,
          }}
        ></View>

        <View style={{  alignItems: "center" }}>
          {/* <Text
            style={{
              textAlign: "center",
              color: "white",
              fontFamily: "Trebuchet",
              fontSize: 13,
              marginBottom: 20,
              alignItems: "center",
            }}
          >
            You have not selected any song
          </Text> */}
          <Button
            //onPress={()=>{props.navigation.navigate("SearchSong")}}
            style={{
              paddingLeft: 10,
              paddingRight: 10,
              width: 150,
              backgroundColor: "#ffffff10",
              height: 30,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}

            
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontFamily: "Trebuchet",
                fontSize: 13,
              }}
            >
             Select a cover picture
            </Text>
          </Button>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#010114",
          width: "90%",
          marginLeft: 20,
          marginRight: 20,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 5,
          marginTop: 30,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="library-music" size={24} color="white" />
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontFamily: "Trebuchet",
              fontSize: 15,
              padding: 20,
            }}
          >
            Song Details
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 20,
        }}
      >
        <Text style={{ fontFamily: "Trebuchet", color: "white", fontSize: 16 }}>
          Song Title
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "white",
            width: 200,
          }}
        >
          <TextInput style={styles.textInput} placeholderTextColor="white" />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 20,
        }}
      >
        <Text style={{ fontFamily: "Trebuchet", color: "white", fontSize: 16 }}>
          Artist Name
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "white",
            width: 200,
          }}
        >
          <TextInput style={styles.textInput} placeholderTextColor="white" />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 20,
        }}
      >
        <Text style={{ fontFamily: "Trebuchet", color: "white", fontSize: 16 }}>
          Record Label
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "white",
            width: 200,
          }}
        >
          <TextInput style={styles.textInput} placeholderTextColor="white" />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 20,
        }}
      >
        <Text style={{ fontFamily: "Trebuchet", color: "white", fontSize: 16 }}>
          Year of Release
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "white",
            width: 200,
          }}
        >
          <TextInput style={styles.textInput} placeholderTextColor="white" />
        </View>
      </View>
      <Button
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          width: width - 40,
          backgroundColor: "#ffffff10",
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          margin: 20,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontFamily: "Trebuchet",
            fontSize: 13,
          }}
        >
          Publish Song
        </Text>
      </Button>
  </KeyboardAwareScrollView>
  );
}

export default Label;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#101820FF",
  },
  textInput: {
    color: "white",
    fontFamily: "Trebuchet",
    fontSize: 16,
  },
  containerNoRoyalty: {
    flex: 1,
    backgroundColor: "#101820FF",
    justifyContent: "center",

    alignItems: "center",
  },
  kContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
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
    fontFamily: "Trebuchet",
  },
  errorMessage: {
    color: "#F46270",
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
  },
  loginInfo: {
    color: "#575757",
    fontFamily: "Trebuchet",
    marginLeft: 20,
    marginTop: 20,
  },
});
