import React, { useState, useEffect, useLayoutEffect } from "react";
import moment from "moment";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Input, Item, Toast } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import axios from "axios";
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
  Feather,
} from "@expo/vector-icons";
import {
  ScrollView,
  TextInput,
  TouchableHighlight,
} from "react-native-gesture-handler";
import { authActions } from "../src/actions/auth.actions";
import { userActions } from "../src/actions/user.actions";

const width = Dimensions.get("window").width;
const noOfPayouts = 0;
function Payouts(props) {
  const dispatch = useDispatch();
  const [payouts, setPayouts] = useState(null);
  const [payoutsError, setPayoutsError] = useState(null);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("2020");
  const [loading, setLoading] = useState(false);
  const bvn = useSelector((state) =>
    state.userReducer.artist ? state.userReducer.artist.bvn_verified : true
  );

  const token = useSelector((state) => state.authReducer.token);

  useEffect(() => {
    dispatch(userActions.getArtist(token));
  }, [JSON.stringify(payouts)]);

  useEffect(() => {
    getPayouts("", year);
  }, []);

  function separators(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }

  const getPayouts = (month, year) => {
    if (!year) {
      Toast.show({
        text: "Please check the entered year",
        textStyle: {
          fontSize: 14,
          paddingLeft: 10,
        },
        duration: 2000,
        style: {
          backgroundColor: "#010114",
        },
        onClose: () => {
          dispatch(authActions.clearToastMessage());
        },
      });
    }

    return axios
      .get(
        `https://web.gocreateafrica.app/api/v1/payouts/artist/${
          year && year + "/"
        }${month && month + "/"}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        if (response.status == 200) {
          const successObject = {
            status: response.status,
            data: response.data,
          };
          setLoading(false);
          setPayouts(successObject.data.results);
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

          setLoading(false);
          setPayouts(errorObject);
          console.log(payouts);
          return errorObject;
        }
      });
  };

  return (
    <React.Fragment>
      <View
        style={{
          width: "100%",
          backgroundColor: "#101820FF",
        }}
      >
        {bvn != true ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              props.navigation.navigate("BvnDisclaimer");
            }}
          >
            <View
              style={{
                backgroundColor: "#010114",

                height: 80,
              }}
            >
              <Text
                style={{
                  fontFamily: "Trebuchet",
                  color: "white",
                  padding: 20,
                  textAlign: "center",
                }}
              >
                Without updating your BVN, payouts cannot be made into your
                account.{" "}
                <Text style={{ textDecorationLine: "underline" }}>
                  Click here to update
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
      <View
        style={{
          backgroundColor: "#01011499",
          height: 50,
          alignItems: "center",

          flexDirection: "row",
          paddingLeft: 30,
          borderBottomColor: "#00000070",
          borderBottomWidth: 0.3,
        }}
      >
        <TextInput
          placeholder="Month"
          placeholderTextColor="#000"
          style={{
            flex: 1,
            fontFamily: "Trebuchet",
            fontSize: 15,
            color: "#000",
          }}
          keyboardType="number-pad"
          maxLength={2}
          value={month}
          onChangeText={(text) => {
            setMonth(text);
          }}
        />
      </View>

      <View
        style={{
          backgroundColor: "#01011499",
          height: 50,
          justifyContent: "center",
          paddingLeft: 30,
          borderBottomWidth: 0.3,
        }}
      >
        <TextInput
          placeholder="Year"
          placeholderTextColor="#000"
          style={{ fontFamily: "Trebuchet", fontSize: 15, color: "#000" }}
          keyboardType="number-pad"
          maxLength={4}
          value={year}
          onChangeText={(text) => {
            setYear(text);
          }}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.98}
        style={{
          backgroundColor: "#010114",
          height: 50,
          alignItems: "center",
          justifyContent: "center",

          width: "100%",
          // borderRadius:3
        }}
        onPress={() => {
          setLoading(true);
          getPayouts(month, year);
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {loading ? (
            <Spinner color="#fff" size="small" />
          ) : (
            <>
              <Feather name="search" size={18} color="white" />
              <Text
                style={{
                  marginLeft: 10,
                  fontFamily: "Trebuchet",
                  fontSize: 14,
                  color: "white",
                }}
              >
                Filter Payouts
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      {(payouts && payouts.length == 0) ||
      (payouts && payouts.status == 404) ? (
        <ScrollView
          style={{ backgroundColor: "#101820FF" }}
          contentContainerStyle={styles.containerNoPayouts}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome5 name={"money-check"} size={20} color="white" />
            <Text
              style={{ fontFamily: "Trebuchet", color: "white", padding: 20 }}
            >
              No payouts available
            </Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          style={{ backgroundColor: "#101820FF" }}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={true}
        >
          {payouts &&
            payouts.map((item) => {
              return (
                <React.Fragment key={item.id}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",

                      marginBottom: 20,
                      paddingTop: 20,
                      paddingBottom: 20,
                      paddingRight: 20,
                      paddingLeft: 20,
                      borderRadius: 3,
                      backgroundColor: "#ffffff10",
                      height: 200,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Trebuchet",
                          fontSize: 14,
                          color: "white",
                        }}
                      >
                        Net Profit: {"\n"}
                        {separators(item.net_profit)}
                      </Text>

                      <Text
                        style={{
                          fontFamily: "Trebuchet",
                          fontSize: 14,
                          color: "white",
                        }}
                      >
                        Gross Profit: {"\n"}
                        {separators(item.gross_profit)}
                      </Text>
                      <View
                        style={{
                          backgroundColor: item.paid ? "green" : "red",
                          borderRadius: 2,
                          padding: 3,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Trebuchet",
                            fontSize: 12,
                            color: "white",
                          }}
                        >
                          {item.paid ? "Payment Successful" : "Payment Failed"}
                        </Text>
                      </View>
                    </View>

                    <View style={{ justifyContent: "space-between" }}>
                      <Text
                        style={{
                          fontFamily: "Trebuchet",
                          fontSize: 14,
                          color: "white",
                        }}
                      >
                        Total Deduction: {separators(item.total_deduction)}
                      </Text>

                      <Text
                        style={{
                          fontFamily: "Trebuchet",
                          fontSize: 14,
                          color: "white",
                        }}
                      >
                        Royalty Cut: {separators(item.royalty_cut)}
                      </Text>

                      <Text
                        style={{
                          fontFamily: "Trebuchet",
                          fontSize: 14,
                          color: "white",
                        }}
                      >
                        Time:{" "}
                        {moment(item.timestamp).format("MMMM Do YYYY, h:mm a")}
                      </Text>
                    </View>
                  </View>
                </React.Fragment>
              );
            })}
        </ScrollView>
      )}
    </React.Fragment>
  );
}

export default Payouts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101820FF",
  },
  containerNoPayouts: {
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
