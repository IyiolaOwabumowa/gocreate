import React, { useState } from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  Platform,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "native-base";

const width = Dimensions.get("window").width;

function FileDisplayItem() {
  const [refreshing, setrefreshing] = useState(false);
  const onRefreshPress = () => {
    setrefreshing(true);
    setTimeout(()=>{
      setrefreshing(false)
    }, 4000)
    
  
  };
  return (
    <>
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "#cdcdcd",

            borderRadius:7,
            width: 50,
            height: 50,
            margin: 20,
          }}
        ></View>
        <View>
          <Text
            style={{
              fontFamily: "Trebuchet",
              fontSize: 17,
              color: "#000",
            }}
          >
            Rema x DJ BIG N
          </Text>
          <Text
            style={{
              fontFamily: "Trebuchet",
              fontSize: 13,
              color: "#1A5C79",
            }}
          >
            Mavin Records: 20%
          </Text>
        </View>

        <View style={{ flex: 1, alignItems: "flex-end", margin: 20 }}>
          {refreshing ? (
            <>
              <Spinner color="#000" size="small" style={{ padding: 20 }}/>
            </>
          ) : (
            <TouchableOpacity onPress={onRefreshPress} style={{ padding: 20 }}>
              <FontAwesomeIcon icon={faRedoAlt} size={20} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}

export default FileDisplayItem;

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
