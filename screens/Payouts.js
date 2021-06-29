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
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";

import {
  ScrollView,
  TextInput,
  TouchableHighlight,
} from "react-native-gesture-handler";
import { authActions } from "../src/actions/auth.actions";
import { userActions } from "../src/actions/user.actions";

const width = Dimensions.get("window").width;

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
  const mode = useSelector((state) => state.userReducer.mode);
  const token = useSelector((state) => state.authReducer.token);

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

  useEffect(() => {
    getPayouts("", year);
  }, []);

  function separators(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }

  var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

  function abbreviateNumber(number) {
    // what tier? (determines SI symbol)
    var tier = (Math.log10(Math.abs(number)) / 3) | 0;

    // if zero, we don't need a suffix
    if (tier == 0) return number;

    // get suffix and determine scale
    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(1) + suffix;
  }

  return (
    <View style={styles[`container${mode}`]}>
      <StatusBar
        barStyle={mode == "light" ? "dark-content" : "light-content"}
      />
      <View
        style={{
          backgroundColor: mode == "light" ? "#00000010" : "#ffffff15",
          height: 50,
          alignItems: "center",
          flexDirection: "row",
          paddingLeft: 30,
          borderBottomColor: mode == "light" ? "#00000070" : "#ffffff20",
          borderBottomWidth: 0.3,
        }}
      >
        <TextInput
          placeholder="Month"
          placeholderTextColor={mode == "light" ? "#000" : "#ffffff50"}
          style={{
            flex: 1,
            fontSize: 15,
            color: mode == "light" ? "#000" : "#ffffff50",
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
          backgroundColor: mode == "light" ? "#00000010" : "#ffffff15",
          height: 50,
          justifyContent: "center",
          paddingLeft: 30,
          borderBottomColor: mode == "light" ? "#00000070" : "#ffffff20",
          borderBottomWidth: 0.3,
        }}
      >
        <TextInput
          placeholder="Year"
          placeholderTextColor={mode == "light" ? "#000" : "#ffffff50"}
          style={{
            fontSize: 15,
            color: mode == "light" ? "#000" : "#ffffff50",
          }}
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
          backgroundColor: mode == "light" ? "#00000010" : "#ffffff15",
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
            <Spinner color={mode == "light" ? "#000" : "#fff"} size="small" />
          ) : (
            <>
              <Feather
                name="search"
                size={18}
                color={mode == "light" ? "#000" : "#fff"}
              />
              <Text
                style={{
                  marginLeft: 10,

                  fontSize: 14,
                  color: mode == "light" ? "#000" : "#fff",
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
          style={{ backgroundColor: mode == "light" ? "#00000010" : "#000" }}
          contentContainerStyle={styles[`container${mode}`]}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome5
              name={"money-check"}
              size={20}
              color={mode == "light" ? "black" : "white"}
            />
            <Text
              style={{
                color: mode == "light" ? "black" : "white",
                padding: 20,
              }}
            >
              No payouts available
            </Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          style={{ backgroundColor: mode == "light" ? "#00000005" : "#000" }}
          contentContainerStyle={styles[`container${mode}`]}
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
                      margin: 20,
                      paddingTop: 20,
                      paddingBottom: 20,
                      paddingRight: 20,
                      paddingLeft: 20,
                      borderRadius: 3,
                      backgroundColor: mode == "light" ? "#fff" : "#ffffff10",
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
                          fontSize: 14,
                          color: mode == "light" ? "black" : "white",
                        }}
                      >
                        <Text style={{ fontWeight: "bold" }}>Net Profit:</Text>{" "}
                        ${abbreviateNumber(item.net_profit)}
                      </Text>

                      <Text
                        style={{
                          fontSize: 14,
                          color: mode == "light" ? "black" : "white",
                        }}
                      >
                        <Text style={{ fontWeight: "bold" }}>
                          Gross Profit:
                        </Text>{" "}
                        ${abbreviateNumber(item.gross_profit)}
                      </Text>
                      <View
                        style={{
                          backgroundColor: item.paid ? "green" : "red",
                          borderRadius: 3,
                          padding: 5,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: "white",
                          }}
                        >
                          {item.paid ? "Paid" : "Unpaid"}
                        </Text>
                      </View>
                    </View>

                    <View style={{ justifyContent: "space-between" }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: mode == "light" ? "black" : "white",
                        }}
                      >
                        <Text style={{ fontWeight: "bold" }}>
                          Total Deduction:
                        </Text>{" "}
                        ${abbreviateNumber(item.total_deduction)}
                      </Text>

                      <Text
                        style={{
                          fontSize: 14,
                          color: mode == "light" ? "black" : "white",
                        }}
                      >
                        <Text style={{ fontWeight: "bold" }}>
                          Royalty Cut:{" "}
                        </Text>
                        ${abbreviateNumber(item.royalty_cut)}
                      </Text>

                      <Text
                        style={{
                          fontSize: 14,
                          color: mode == "light" ? "black" : "white",
                        }}
                      >
                        {moment(item.timestamp).format("MMMM Do YYYY")}
                      </Text>
                    </View>
                  </View>
                </React.Fragment>
              );
            })}
        </ScrollView>
      )}
    </View>
  );
}

export default Payouts;

const styles = StyleSheet.create({
  containerNoPayouts: {
    flex: 1,
    backgroundColor: "#101820FF",
    justifyContent: "center",
    alignItems: "center",
  },

  containerlight: {
    flex: 1,
    backgroundColor: "#00000005",
  },
  containerdark: {
    flex: 1,
    backgroundColor: "#000000",
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
