import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { authActions } from "../src/actions/auth.actions";
import { useHeaderHeight } from "@react-navigation/stack";

import {
  StyleSheet,
  StatusBar,
  Text,
  Platform,
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

function LineGraph(props) {
  const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // const newMonthArray = [];
  const [newMonthArray, setNewMonthArray] = useState([])
  useEffect(() => {
    for (var i = 0; i < props.monthData.length; i++) {
      newMonthArray.push(monthArr[parseInt(props.monthData[i]) - 1]);
    }
  }, [JSON.stringify(props.monthData), JSON.stringify(props.chartData)]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#010114",
        marginBottom: 30,
      }}
    >
      <View
        style={{
          flex: 1,
          width: Dimensions.get("window").width,
          flexDirection: "row",
          padding: 20,
          backgroundColor: "#010114",
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: -10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            
            textAlign: "left",
            marginBottom: 10,
            marginLeft: 20,
            fontSize: 17,
          }}
        >
          {props.chartName}
        </Text>
      </View>

      <LineChart
        data={{
          labels:  newMonthArray.length > 1 ? newMonthArray : monthArr,
          datasets: [
            {
              data:
                props.chartData.length == 0
                  ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                  :  props.chartData,
            },
          ],
        }}
        width={Dimensions.get("window").width - 40} // from react-native
        height={200}
        // yAxisLabel="$"
        // yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        withInnerLines={false}
        chartConfig={{
          backgroundColor: "#010114",
          backgroundGradientFrom: "#010114",
          backgroundGradientTo: "#010114",
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `#fff`,
          labelColor: (opacity = 1) => `#fff`,
          style: {
            borderRadius: 10,
          },
          propsForDots: {
            r: "",
            strokeWidth: "2",
            stroke: "#9DC828",
          },
        }}
        style={{
          marginVertical: 8,

          marginBottom: 30,

          borderRadius: 6,
        }}
      />
    </View>
  );
}

export default LineGraph;

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
