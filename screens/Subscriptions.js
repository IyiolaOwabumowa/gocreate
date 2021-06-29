import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import { authActions } from "../src/actions/auth.actions";
import { subscriptionActions } from "../src/actions/subscription.actions";
import { userActions } from "../src/actions/user.actions";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const width = Dimensions.get("window").width;
const noOfPayouts = 0;
function Subscriptions(props) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const token = useSelector((state) => state.authReducer.token);
  const subscriptions = useSelector((state) =>
    state.subscriptionReducer.subscriptions
      ? state.subscriptionReducer.subscriptions
      : null
  );
  const artist_subscriptions = useSelector((state) =>
    state.subscriptionReducer.artist_subscriptions
      ? state.subscriptionReducer.artist_subscriptions
      : null
  );
  const artist = useSelector((state) =>
    state.userReducer.artist ? state.userReducer.artist : null
  );
  const mode = useSelector((state) => state.userReducer.mode);

  const [packageWarning, setPackageWarning] = useState([null, null, null]);

  const [soon, setSoon] = useState(false);
  const [pleaseWait, setPleaseWait] = useState([false, false, false]);

  useEffect(() => {
    if (artist_subscriptions) {
      const epFull = artist_subscriptions.data.results
        .filter((s) => s.package.title === "EP")
        .every((sub) => sub.songs_added == sub.package.tracks_count);
      const singleFull = artist_subscriptions.data.results
        .filter((s) => s.package.title === "Single")
        .every((sub) => sub.songs_added == sub.package.tracks_count);
      const albumFull = artist_subscriptions.data.results
        .filter((s) => s.package.title === "Album")
        .every((sub) => sub.songs_added == sub.package.tracks_count);
      const warnings = [singleFull, epFull, albumFull];
      setPackageWarning(warnings);
    }
  }, [artist_subscriptions]);

  function packageExists(packageid) {
    if (artist_subscriptions) {
      artist_subscriptions.data.results.some(function (el) {
        return el.package.id === packageid;
      });
    }
  }

  const getSlotsCount = (id, packageId) => {
    return (
      artist_subscriptions &&
      artist_subscriptions.data.results
        .filter((item) => item.package.id === packageId)
        .findIndex((slot) => slot.id == id) + 1
    );
  };

  const getPaymentIntent = (packageId, packageName) => {
    // console.log({ package: packageId });

    //after intent is gotten from the backend

    return axios
      .post(
        "https://web.gocreateafrica.app/api/v1/subscriptions/stripepayment/",
        { package: packageId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const pw = [false, false, false];
        setPleaseWait(pw);

        openPaymentSheet(response.data.session_id, packageName, packageId);
      })
      .catch(function (error) {
        const pw = [false, false, false];
        setPleaseWait(pw);
        Alert.alert(
          "Payment Failed",
          "Something went wrong, please try again later"
        );
      });
  };
  const initializePaymentSheet = async (clientSecret, packageName) => {
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: "Example Inc.",
      style: mode == "light" ? "alwaysLight" : "alwaysDark",
    });
    if (!error) {
    }
  };

  const openPaymentSheet = async (clientSecret, packageName, packageId) => {
    initializePaymentSheet(clientSecret, packageName);

    const { error } = await presentPaymentSheet({
      clientSecret: clientSecret,
    });

    if (error) {
      // Alert.alert(` ${error.code}`, error.message);
    } else {
      axios
        .post(
          `https://web.gocreateafrica.app/api/v1/subscriptions/artist/`,
          {
            reference: `${Math.random().toString(36).substr(2, 5)}`,
            artist: artist.id,
            package: packageId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          dispatch(subscriptionActions.getArtistSubscriptions(token));
          Alert.alert(
            "Payment Successful",
            `You can now start adding songs to your new slot in ${packageName}`
          );
        })
        .catch((err) => {
          dispatch(subscriptionActions.getArtistSubscriptions(token));
          Alert.alert(
            "Payment Successful",
            `You can now start adding songs to your new slot in ${packageName}`
          );
          Toast.show({
            text: err.response.data,
            textStyle: {
              fontSize: 14,
              paddingLeft: 10,
            },
            duration: 4000,
            style: {
              backgroundColor: "red",
            },
            onClose: () => {
              dispatch(authActions.clearToastMessage());
            },
          });
        });
    }
  };

  const getSubCount = (id) => {
    console.log(id);
    axios
      .get(
        `https://web.gocreateafrica.app/api/v1/songs/subscriptions/${id}/`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        return res.count;
      })
      .catch((err) => {
        return 0;
      });
  };

  if (soon) {
    return (
      <ScrollView
        style={{ backgroundColor: "#101820FF" }}
        contentContainerStyle={styles.containerNoPayouts}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="contactless-payment"
            size={20}
            color="white"
          />
          <Text style={{ color: "white", padding: 20 }}>
            This feature is coming soon
          </Text>
        </View>
      </ScrollView>
    );
  }
  return (
    <ScrollView
      style={{ backgroundColor: mode == "light" ? "#00000010" : "#000" }}
    >
      <StatusBar
        barStyle={mode == "light" ? "dark-content" : "light-content"}
      />
      <>
        <View
          style={{
            backgroundColor: mode == "light" ? "#fff" : "#ffffff10",
            width: "90%",
            margin: 20,

            justifyContent: "flex-start",
            padding: 25,
            borderRadius: 5,
          }}
        >
          <Text
            style={{
              textAlign: "left",
              color: mode == "light" ? "#000" : "#fff",
              fontWeight: "bold",
              fontSize: 20,
              marginBottom: 10,
            }}
          >
            Single Package
          </Text>
          <Text
            style={{
              color: mode == "light" ? "#000" : "#fff",
              fontSize: 12,
              marginBottom: 10,
            }}
          >
            Distribute all songs in each slot every month. Each slot in this
            package can have a maximum of one song.{" "}
            <Text style={{ fontWeight: "500" }}>
              {packageWarning[0] &&
                "You have no available slots in this package."}{" "}
            </Text>
          </Text>
          {pleaseWait[0] ? (
            <>
              <Text
                style={{ fontWeight: "700", fontSize: 12, color: "#32CD32" }}
              >
                {"Please wait..."}
              </Text>
            </>
          ) : (
            <>
              {packageWarning[0] && (
                <TouchableOpacity
                  activeOpacity={0.4}
                  style={{ marginBottom: 10 }}
                  onPress={() => {
                    const pw = [true, false, false];
                    setPleaseWait(pw);

                    getPaymentIntent(
                      subscriptions?.data.results[2].id,
                      subscriptions?.data.results[2].title
                    );
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 12,
                      color: "#32CD32",
                    }}
                  >
                    {"Buy more slots"}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {artist_subscriptions &&
            artist_subscriptions.data.results.map((item, idx) => {
              if (item.package.id === subscriptions.data.results[2].id) {
                return (
                  <React.Fragment key={item.id}>
                    <View
                      style={{
                        backgroundColor:
                          item.songs_added == 1
                            ? mode == "light"
                              ? "#11111110"
                              : "#00000050"
                            : "#32CD3275",
                        width: "100%",

                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: 5,
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",

                          color: mode == "light" ? "black" : "#fff",
                          fontSize: 15,
                          padding: 20,
                        }}
                      >
                        Slot {getSlotsCount(item.id, item.package.id)}
                      </Text>
                      <Text
                        style={{
                          textAlign: "center",
                          color: mode == "light" ? "black" : "#fff",

                          fontSize: 13,
                          padding: 20,
                        }}
                      >
                        {item.songs_added > 0
                          ? `Song Count: ${item.songs_added} `
                          : "Empty Slot"}
                      </Text>
                      {item.songs_added < 1 ? (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={{
                            backgroundColor: "#32CD3275",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 30,
                            height: 30,
                            borderRadius: 5,
                            marginRight: 10,
                          }}
                          onPress={() => {
                            props.navigation.navigate("AddTrack", {
                              distroId: item.id,

                              packageName: "Single Package",
                            });
                          }}
                        >
                          <Ionicons name="ios-add" size={24} color="white" />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          activeOpacity={1}
                          style={{
                            backgroundColor:
                              item.songs_added == 1
                                ? mode == "light"
                                  ? "#11111120"
                                  : "#ffffff10"
                                : "#32CD3275",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 30,
                            height: 30,
                            borderRadius: 5,
                            marginRight: 10,
                          }}
                        >
                          <Ionicons
                            name="ios-add"
                            size={24}
                            color={
                              mode == "light"
                                ? "white"
                                : item.songs_added == 1
                                ? "#ffffff20"
                                : "#fff"
                            }
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </React.Fragment>
                );
              }
            })}

          {packageExists(subscriptions?.data.results[2].id) ? null : (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                backgroundColor: "#32CD3275",
                padding: 5,
                borderRadius: 3,
                marginTop: 30,
                marginBottom: 30,
                paddingLeft: 10,
                paddingRight: 10,
                height: 40,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                const pw = [true, false, false];
                setPleaseWait(pw);
                getPaymentIntent(
                  subscriptions?.data.results[2].id,
                  subscriptions?.data.results[2].title
                );
              }}
            >
              {pleaseWait[0] ? (
                <ActivityIndicator size={"small"} color={"white"} />
              ) : (
                <>
                  <FontAwesome5 name="money-check" size={13} color="white" />
                  <Text
                    style={{
                      fontSize: 12,
                      color: mode == "light" ? "black" : "white",
                      marginLeft: 10,
                    }}
                  >
                    Buy a {subscriptions?.data.results[2].title} package slot
                    for ${subscriptions?.data.results[2].price}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            backgroundColor: mode == "light" ? "#fff" : "#ffffff10",
            width: "90%",
            marginLeft: 20,
            marginRight: 20,
            justifyContent: "flex-start",
            padding: 25,
            borderRadius: 5,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              textAlign: "left",
              color: mode == "light" ? "#000" : "#fff",
              fontWeight: "bold",
              fontSize: 20,
              marginBottom: 10,
            }}
          >
            EP Package
          </Text>
          <Text
            style={{
              color: mode == "light" ? "#000" : "#fff",
              fontSize: 12,
              marginBottom: 20,
            }}
          >
            Distribute all songs in each slot every month. Each slot in this
            package can have a maximum of ten songs.{" "}
            <Text style={{ fontWeight: "500" }}>
              {packageWarning[1] &&
                "You have no available slots in this package."}{" "}
            </Text>
          </Text>

          {pleaseWait[1] ? (
            <>
              <Text
                style={{ fontWeight: "700", fontSize: 12, color: "#32CD32" }}
              >
                {"Please wait..."}
              </Text>
            </>
          ) : (
            <>
              {packageWarning[1] && (
                <TouchableOpacity
                  activeOpacity={0.4}
                  style={{ marginBottom: 10 }}
                  onPress={() => {
                    const pw = [false, true, false];
                    setPleaseWait(pw);

                    getPaymentIntent(
                      subscriptions?.data.results[0].id,
                      subscriptions?.data.results[0].title
                    );
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 12,
                      color: "#32CD32",
                    }}
                  >
                    {"Buy more slots"}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
          {artist_subscriptions &&
            artist_subscriptions.data.results.map((item, idx) => {
              if (item.package.id === subscriptions.data.results[0].id) {
                return (
                  <React.Fragment key={item.id}>
                    <View
                      style={{
                        backgroundColor:
                          item.songs_added == 10 ? "#11111110" : "#32CD3275",
                        width: "100%",

                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: 5,
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",

                          color: mode == "light" ? "black" : "#fff",
                          fontSize: 15,
                          padding: 20,
                        }}
                      >
                        Slot {getSlotsCount(item.id, item.package.id)}
                      </Text>
                      <Text
                        style={{
                          textAlign: "center",
                          color: mode == "light" ? "black" : "#fff",

                          fontSize: 12,
                          padding: 20,
                        }}
                      >
                        {item.songs_added > 0
                          ? `Song Count: ${item.songs_added} `
                          : "Empty Slot"}
                      </Text>
                      {item.songs_added < 10 ? (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={{
                            backgroundColor: "#32CD3275",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 30,
                            height: 30,
                            borderRadius: 5,
                            marginRight: 10,
                          }}
                          onPress={() => {
                            props.navigation.navigate("AddTrack", {
                              distroId: item.id,

                              packageName: "EP Package",
                            });
                          }}
                        >
                          <Ionicons name="ios-add" size={24} color="white" />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          activeOpacity={1}
                          style={{
                            backgroundColor:
                              item.songs_added == 10
                                ? "#11111120"
                                : "#32CD3275",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 30,
                            height: 30,
                            borderRadius: 5,
                            marginRight: 10,
                          }}
                        >
                          <Ionicons name="ios-add" size={24} color="white" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </React.Fragment>
                );
              }
            })}

          {packageExists(subscriptions?.data.results[0].id) ? null : (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                backgroundColor: "#32CD3275",
                padding: 5,
                borderRadius: 3,
                marginTop: 30,
                marginBottom: 30,
                paddingLeft: 10,
                paddingRight: 10,
                height: 40,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                const pw = [false, true, false];
                setPleaseWait(pw);

                getPaymentIntent(
                  subscriptions?.data.results[0].id,
                  subscriptions?.data.results[0].title
                );
              }}
            >
              {pleaseWait[1] ? (
                <ActivityIndicator size={"small"} color={"white"} />
              ) : (
                <>
                  <FontAwesome5 name="money-check" size={13} color="white" />
                  <Text
                    style={{
                      fontSize: 12,
                      color: mode == "light" ? "black" : "white",
                      marginLeft: 10,
                    }}
                  >
                    Buy an {subscriptions?.data.results[0].title} package slot
                    for ${subscriptions?.data.results[0].price}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            backgroundColor: mode == "light" ? "#fff" : "#ffffff10",
            width: "90%",
            marginLeft: 20,
            marginRight: 20,
            justifyContent: "flex-start",
            padding: 25,
            borderRadius: 5,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              textAlign: "left",
              color: mode == "light" ? "#000" : "#fff",
              fontWeight: "bold",
              fontSize: 20,
              marginBottom: 10,
            }}
          >
            Album Package
          </Text>
          <Text
            style={{
              color: mode == "light" ? "#000" : "#fff",
              fontSize: 12,
              marginBottom: 10,
            }}
          >
            Distribute all songs in each slot every month. Each slot in this
            package can have a maximum of twenty songs.{" "}
            <Text style={{ fontWeight: "500" }}>
              {packageWarning[2] &&
                "You have no available slots in this package."}{" "}
            </Text>
          </Text>
          {pleaseWait[2] ? (
            <>
              <Text
                style={{ fontWeight: "700", fontSize: 12, color: "#32CD32" }}
              >
                {"Please wait..."}
              </Text>
            </>
          ) : (
            <>
              {packageWarning[2] && (
                <TouchableOpacity
                  activeOpacity={0.4}
                  style={{ marginBottom: 10 }}
                  onPress={() => {
                    const pw = [false, false, true];
                    setPleaseWait(pw);

                    getPaymentIntent(
                      subscriptions?.data.results[1].id,
                      subscriptions?.data.results[1].title
                    );
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 12,
                      color: "#32CD32",
                    }}
                  >
                    {"Buy more slots"}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {artist_subscriptions &&
            artist_subscriptions.data.results.map((item, idx) => {
              if (item.package.id === subscriptions.data.results[1].id) {
                return (
                  <React.Fragment key={item.id}>
                    <View
                      style={{
                        backgroundColor:
                          item.songs_added == 20
                            ? mode == "light"
                              ? "#11111110"
                              : "#000000"
                            : "#32CD3275",
                        width: "100%",

                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: 5,
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",

                          color: mode == "light" ? "black" : "#fff",
                          fontSize: 15,
                          padding: 20,
                        }}
                      >
                        Slot {getSlotsCount(item.id, item.package.id)}
                      </Text>
                      <Text
                        style={{
                          textAlign: "center",
                          color: mode == "light" ? "black" : "#fff",

                          fontSize: 12,
                          padding: 20,
                        }}
                      >
                        {item.songs_added > 0
                          ? `Song Count: ${item.songs_added} `
                          : "Empty Slot"}
                      </Text>
                      {item.songs_added < 20 ? (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={{
                            backgroundColor: "#32CD3275",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 30,
                            height: 30,
                            borderRadius: 5,
                            marginRight: 10,
                          }}
                          onPress={() => {
                            props.navigation.navigate("AddTrack", {
                              distroId: item.id,

                              packageName: "Album Package",
                            });
                          }}
                        >
                          <Ionicons name="ios-add" size={24} color="white" />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          activeOpacity={1}
                          style={{
                            backgroundColor:
                              item.songs_added == 20
                                ? "#11111120"
                                : "#32CD3275",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 30,
                            height: 30,
                            borderRadius: 5,
                            marginRight: 10,
                          }}
                        >
                          <Ionicons name="ios-add" size={24} color="white" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </React.Fragment>
                );
              }
            })}

          {packageExists(subscriptions?.data.results[1].id) ? null : (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                backgroundColor: "#32CD3275",
                padding: 5,
                borderRadius: 3,
                marginTop: 30,
                marginBottom: 30,
                paddingLeft: 10,
                paddingRight: 10,
                height: 40,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                const pw = [false, false, true];
                setPleaseWait(pw);
                getPaymentIntent(
                  subscriptions?.data.results[1].id,
                  subscriptions?.data.results[1].title
                );
              }}
            >
              {pleaseWait[2] ? (
                <ActivityIndicator size={"small"} color={"white"} />
              ) : (
                <>
                  <FontAwesome5 name="money-check" size={13} color="white" />
                  <Text
                    style={{
                      fontSize: 12,
                      color: mode == "light" ? "black" : "white",
                      marginLeft: 10,
                    }}
                  >
                    Buy an {subscriptions?.data.results[1].title} package slot
                    for ${subscriptions?.data.results[1].price}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </>
    </ScrollView>
  );
}

export default Subscriptions;

const styles = StyleSheet.create({
  containerNoPayouts: {
    flex: 1,
    backgroundColor: "#101820FF",
    justifyContent: "center",
    alignItems: "center",
  },

  containerlight: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#00000010",
  },
  containerdark: {
    flex: 1,
    flexDirection: "column",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 7,
    width: "90%",
    height: "80%",
    padding: 35,
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",

    fontSize: 18,
    marginTop: 30,
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
  cardslight: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 15,
    backgroundColor: "#fff",
    height: 300,
    width: 250,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  cardsdark: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 15,
    backgroundColor: "#010114",
    height: 300,
    width: 250,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
});
