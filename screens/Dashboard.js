import React, { useState, useEffect, useLayoutEffect } from "react";
//import * as Linking from "expo-linking";
//import * as WebBrowser from "expo-web-browser";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { authActions } from "../src/actions/auth.actions";
import { userActions } from "../src/actions/user.actions";
import { useHeaderHeight } from "@react-navigation/stack";
import AwesomeAlert from "react-native-awesome-alerts";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  Modal,
  Platform,
  Linking
} from "react-native";
import { Button, Input, Item } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTv,
  faPodcast,
  faStream,
  faPlay,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import validateInput from "../assets/utils/validation";
import FileDisplayItem from "./FileDisplayItem";
import { ScrollView } from "react-native-gesture-handler";
import LineGraph from "./LineGraph";
import BarChartComponent from "./BarChartComponent";
import { useIsFocused } from "@react-navigation/native";
import DashboardRectangles from "./DashboardRectangles";
import { AntDesign } from "@expo/vector-icons";
import { songActions } from "../src/actions/song.actions";
import { advertsActions } from "../src/actions/adverts.actions";

import axios from "axios";
import advertsReducer from "../src/reducers/adverts.reducers";

const width = Dimensions.get("window").width;
const iosBg = require("../assets/bg-app.png");
const androidBg = { uri: "asset:/images/bg-app.png" };
const iosLogo = require("../assets/logo.png");
const androidLogo = { uri: "asset:/images/logo.png" };
const windowWidth = Dimensions.get("window").width;

let imageBg = Platform.OS === "ios" ? iosBg : androidBg;
let logo = Platform.OS === "ios" ? iosLogo : androidLogo;

const Dashboard = (props) => {
  const dispatch = useDispatch();
  const headerHeight = useHeaderHeight();

  const loggingIn = useSelector((state) => state.authReducer.loggingIn);
  const loginError = useSelector((state) => state.authReducer.errorMessage);
  const bvn = useSelector((state) =>
    state.userReducer.artist ? state.userReducer.artist.bvn_verified : true
  );
  const songs = useSelector((state) =>
    state.songReducer.songs ? state.songReducer.songs : null
  );

  const adverts = useSelector((state) =>
    state.advertsReducer.adverts ? state.advertsReducer.adverts : null
  );

  const phone = useSelector((state) =>
    state.userReducer.artist ? state.userReducer.artist.phone : null
  );
  const phone_verified = useSelector((state) =>
    state.userReducer.artist ? state.userReducer.artist.phone_verified : null
  );
  const token = useSelector((state) => state.authReducer.token);
  const buttonLoader = useSelector((state) => state.authReducer.buttonLoader);
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [header, setHeaderHeight] = useState(headerHeight);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertTest, setShowAlertTest] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [payouts, setPayouts] = useState(null);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(currentYear);
  const [chartData, setChartData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [adsNo, setAdsNo] = useState([]);
  const [adPosition, setAdPosition] = useState(0);
  const isFocused = useIsFocused();

  function separators(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }

  const getPayouts = (month, year) => {
    return axios
      .get(
        `https://web.gocreateafrica.app/api/v1/payouts/artist/${year}/`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status == 200) {
          const successObject = {
            status: response.status,
            data: response.data,
          };
          setPayouts(successObject);
        }
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          const values = Object.values(error.response.data);
          const errorObject = {
            status: error.response.status,
            error: values[0],
          };

          //console.log(error.response.data);
          return errorObject;
        }
      });
  };

  const loadPlayCount = (month, year) => {
    return axios
      .get(
        `https://web.gocreateafrica.app/api/v1/payouts/annual/songsales/2020/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        if (response.status == 200) {
          const successObject = {
            status: response.status,
            data: response.data,
          };
          var chartArr = [];
          var monthArr = [];
          for (var i = 0; i < successObject.data.results.length; i++) {
            monthArr.push(
              successObject.data.results[i].pay_due.substring(5, 7)
            );
            chartArr.push(successObject.data.results[i].played_count);
          }
          setChartData(chartArr);
          setMonthData(monthArr);
        }
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          const values = Object.values(error.response.data);
          const errorObject = {
            status: error.response.status,
            error: values[0],
          };

          //(error.response.data);
          return errorObject;
          11;
        }
      });
  };

  const logout = () => {
    setShowAlert(false);
    setTimeout(() => {
      dispatch(authActions.deleteUserToken());
    }, 1000);
  };

  const updateBvn = () => {
    setShowAlert(false);
    setTimeout(() => {
      props.navigation.navigate("BvnDisclaimer");
    }, 1000);
  };

  const upload = () => {
    props.navigation.navigate("MonitorUploads");
  };

  const bvnprompt = () => {
    setShowAlertTest(true);
  };

  useEffect(() => {
    dispatch(userActions.getArtist(token));
    if (isFocused) {
      if (phone_verified == true) {
        setModalVisible(false);
      } else {
        setModalVisible(true);
      }
    }
  }, [phone_verified, isFocused]);

  useEffect(() => {
    loadPlayCount();
    dispatch(advertsActions.getAdverts());
  }, []);



  useEffect(() => {
    var count = adverts?.data.results.length - 1

    const adInterval = setInterval(()=>{

      if( count == 0 ){
        count = adverts?.data.results.length - 1 
        setAdPosition(count);
      }

      if(count < adverts?.data.results.length){
        count -= 1
        setAdPosition(count);
      } 

     }, 8000)

      return ()=>{
        clearInterval(adInterval)
      }

  }, []);




  useEffect(() => {
    if (isFocused) {
      getPayouts("", "2020");
      dispatch(songActions.getSongs(token));

    }
  }, [isFocused]);



  const green = "#006B38FF";
  const blue = "#020650";
  const pink = "#82013d";

  const royaltyCount = (songs) => {
    const arr = songs && songs.data.results;
    var count = 0;
    for (var i = 0; i < arr.length; i++) {
      count = arr[i].royalties.length + count;
    }
    return separators(count);
  };

  const payoutCount = (payouts) => {
    const arr = payouts && payouts.data.results;
    var count = 0;
    if (arr == null) {
      return 0;
    }
    for (var i = 0; i < arr.length; i++) {
      count = arr[i].net_profit + count;
    }
    return separators(count);
  };

  return (
    <ImageBackground style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <AntDesign name={"message1"} size={50} color="#9DC828" />

            <Text style={styles.modalText}>Phone Verification Required</Text>
            <Text style={{ textAlign: "center" }}>
              To continue using our app, kindly verify your registered phone
              number.
            </Text>
            <Button
              onPress={() => {
                props.navigation.navigate("OTP", { phone: phone });
                setModalVisible(false);
              }}
              style={{
                backgroundColor: "#010114",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 50,
              }}
            >
              <Text
                style={{ color: "white", paddingLeft: 30, paddingRight: 30 }}
              >
                Proceed to Verification
              </Text>
            </Button>

            <Button
              onPress={() => {
                dispatch(authActions.deleteUserToken());
              }}
              style={{
                backgroundColor: "#010114",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 50,
              }}
            >
              <Text
                style={{ color: "white", paddingLeft: 30, paddingRight: 30 }}
              >
                Logout
              </Text>
            </Button>
          </View>
        </View>
      </Modal>
      <ScrollView showsVerticalScrollIndicator={false}>
        <DashboardRectangles
          // heading={payouts.data.results == null ? 0 :  payoutCount(payouts)}
          heading={
            payouts && payouts.data.results.length == 0
              ? 0
              : payoutCount(payouts)
          }
          sub="Worth of Recent Payouts"
          color={"#010114"}
          icon="credit-card"
        />
        <DashboardRectangles
          heading={
            songs == null || songs.status == 401 ? null : royaltyCount(songs)
          }
          sub={
            songs != null && songs.status != 401 && royaltyCount(songs) == 1
              ? `Royalty in Total`
              : `Royalties in Total`
          }
          color={"#010114"}
          icon="coins"
        />
        <DashboardRectangles
          heading={songs == null || songs.status == 401 ? 0 :   separators(songs.data.count)}
          sub={
            songs != null && songs.status != 401 && songs.data.count == 1
              ? "Song Uploaded"
              : "Songs Uploaded"
          }
          color={"#010114"}
          icon="music"
        />
        <View style={{ marginBottom: 30 }}></View>

        <LineGraph
          chartName={"Yearly Play Count"}
          chartData={chartData && chartData}
          monthData={monthData && monthData}
        />

        {adverts && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              Linking.openURL(adverts.data.results[adPosition].link)     
            }}
          >
            <Image
              source={{ uri: adverts.data.results[adPosition].file }}
              style={{ height: 200, width: "100%", borderRadius: 5 }}
            />
          </TouchableOpacity>
        )}
        {/* 
        {adverts &&
          adverts.data.results.map((item) => {
            return (
              <Image
                source={{ uri: item.file }}
                style={{ height: 200, width: "100%", borderRadius: 5 }}
              />
            );
          })} */}

        <View style={{ marginBottom: 30 }}></View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101820FF",
    paddingLeft: 10,
    paddingRight: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    height: "105%",
    padding: 35,
    paddingTop: 100,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Trebuchet",
    fontSize: 18,
    marginTop: 30,
  },

  textInput: {
    color: "#ffffff",
    fontSize: 14,
    paddingLeft: 25,
  },
  itemStyle: {
    borderColor: "#ffffff00",
    backgroundColor: "#1c1c1c30",
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
    width: width - 40,
    paddingLeft: 30,
    paddingRight: 30,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 25,
    marginBottom: 25,
  },

  actionButton: {
    backgroundColor: "#9DC828",
    height: 45,
    paddingLeft: 30,
    paddingRight: 30,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 25,
    marginBottom: 25,
  },
  buttonText: {
    color: "black",
    fontFamily: "Trebuchet",
  },
  errorMessage: {
    color: "#000",
    fontFamily: "Trebuchet",
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
  },
  loginInfo: {
    color: "#575757",
    fontFamily: "Trebuchet",
    marginTop: 30,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 15,
  },
});