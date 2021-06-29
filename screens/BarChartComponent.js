import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { authActions } from "../src/actions/auth.actions";
import { useHeaderHeight } from "@react-navigation/stack";

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
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import { Button, Input, Item } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import validateInput from "../assets/utils/validation";
import FileDisplayItem from "./FileDisplayItem";
import { ScrollView } from "react-native-gesture-handler";

const width = Dimensions.get("window").width;
const iosBg = require("../assets/bg-app.png");
const androidBg = { uri: "asset:/images/bg-app.png" };
const iosLogo = require("../assets/logo.png");
const androidLogo = { uri: "asset:/images/logo.png" };
const windowWidth = Dimensions.get("window").width;

let imageBg = Platform.OS === "ios" ? iosBg : androidBg;
let logo = Platform.OS === "ios" ? iosLogo : androidLogo;

function BarChartComponent(props) {
 
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <BarChart
        // style={graphStyle}
        data={{
          labels: ["Youtube", "Instagram", "Facebook"],
          datasets: [
            {
              data: [20, 45, 28],
            },
          ],
        }}
        width={width -20}
        height={220}
        chartConfig={{
          backgroundColor: '#1A5C79',
          backgroundGradientFrom: '#1A5C79',
          backgroundGradientTo: '#1A5C79',
          decimalPlaces: 0,
          color: (opacity = 1) => `#9DC828`,
          labelColor: (opacity = 1) => `#fff`,

          style: {
            borderRadius: 10,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 6,
        }}
        
      />
 
    </View>
  );
}

export default BarChartComponent;

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
