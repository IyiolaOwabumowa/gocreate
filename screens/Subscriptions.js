import React, { useState, useEffect, useLayoutEffect } from "react";
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
  Alert,
  Modal,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Input, Item } from "native-base";
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
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { authActions } from "../src/actions/auth.actions";
import { subscriptionActions } from "../src/actions/subscription.actions";
import { userActions } from "../src/actions/user.actions";

const width = Dimensions.get("window").width;
const noOfPayouts = 0;
function Subscriptions(props) {
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
  const [spFound, setSpFound] = useState(false);
  const [epFound, setEpFound] = useState(false);
  const [alFound, setAlFound] = useState(false);
  
  const [soon, setSoon] = useState(true);
  useEffect(() => {
    dispatch(userActions.getArtist(token));
    dispatch(subscriptionActions.getAvailableSubscriptions(token));
    dispatch(subscriptionActions.getArtistSubscriptions(token));
    }, [isFocused]);

  function packageExists(packageid) {
    return (
      artist_subscriptions &&
      artist_subscriptions.data.results.some(function (el) {
        return el.package.id === packageid;
      })
    );
  }

if(soon){
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
      <Text
        style={{ fontFamily: "Trebuchet", color: "white", padding: 20 }}
      >
       The distribution feature is coming soon
      </Text>
    </View>
  </ScrollView>
  )
}
  return (
    <ScrollView
      style={{ backgroundColor: "#101820FF" }}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={{ justifyContent: "center", alignItems: "center" }}
        activeOpacity={0.85}
      >
        <View
          style={{
            backgroundColor: "#000",
            width: width - 40,
            height: 80,
            marginTop: 20,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Trebuchet",
              color: "white",
              padding: 20,
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            Only songs in a distribution package can be distributed by GoCreate.{" "}
          </Text>
        </View>
      </TouchableOpacity>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {subscriptions &&
          subscriptions.data.results.map((item) => {
            console.log(item)
             return (
              <View
                key={item.id}
                style={{ flexDirection: "row", justifyContent: "center" }}
              >
                <View style={styles.cards}>
                  <View style={{ alignItems: "center" }}>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontFamily: "Trebuchet",
                          fontSize: 20,
                          color: "white",
                        }}
                      >
                        {item.title}
                      </Text>
                    </View>
                    {/* <SimpleLineIcons
                    name="badge"
                    size={40}
                    color="white"
                    style={{ marginRight: 5 }}
                  /> */}
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 10,
                        marginTop: 10,
                        color: "white",
                        padding:25,
                        textAlign:"center"
                      }}
                    >
                      ({item.description})
                    </Text>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: "#32CD3275",
                        padding: 5,
                        borderRadius: 3,
                        marginTop: 50,
                        paddingLeft: 10,
                        paddingRight: 10,
                        flexDirection: "row",
                      }}
                      onPress={() => {
                        props.navigation.navigate("SubscriptionPayment", {
                          itemPrice: item.price,
                          artist: artist.id,
                          package: item.id

                        });
                      }}
                    >
                      <FontAwesome5
                        name="money-check"
                        size={13}
                        color="white"
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          color: "white",
                          marginLeft: 5,
                        }}
                      >
                        Purchase for ‎₦{item.price}
                      </Text>
                    </TouchableOpacity>

                    <Text
                      style={{
                        fontSize: 10,
                        color: "white",
                        marginLeft: 5,
                        marginTop: 50,
                        textAlign: "center",
                      }}
                    >
                      Each purchase adds {"\n"} a slot to your package
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
      </ScrollView>

      <>
        <View
          style={{
            backgroundColor: "#000",
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
            <View>
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontFamily: "Trebuchet",
                  fontSize: 15,
                  padding: 20,
                }}
              >
                Single Package
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontFamily: "Trebuchet",
                  fontSize: 12,
                }}
              >
                (Package allows max of 1 track per slot)
              </Text>
            </View>
          </View>
          {artist_subscriptions &&
            artist_subscriptions.data.results.map((item) => {
              if (item.package.id == subscriptions.data.results[0].id) {
                return (
                  <React.Fragment key={item.id}>
                    <View
                      style={{
                        backgroundColor: "#ffffff50",
                        width: "90%",
                        marginLeft: 20,
                        marginRight: 20,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: 5,
                        marginTop: 30,
                        marginBottom: 20,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontWeight: "700",
                          color: "#fff",
                          fontSize: 15,
                          padding: 20,
                        }}
                      >
                        Slot{" "}
                        {artist_subscriptions &&
                          artist_subscriptions.data.results.indexOf(item) + 1}
                      </Text>
                      <Text
                        style={{
                          textAlign: "center",
                          color: "white",
                          fontFamily: "Trebuchet",
                          fontSize: 15,
                          padding: 20,
                        }}
                      >
                        {item.songs_added}{" "}
                        {item.songs_added == 1 ? "track" : "tracks"}
                      </Text>
                      {item.songs_added < 1 ? (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={{
                            backgroundColor: "#010114",
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

                              packageName: "Single Package"
                            });
                          }}
                        >
                          <Ionicons name="ios-add" size={24} color="white" />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          activeOpacity={1}
                          style={{
                            backgroundColor: "#cdcdcd20",
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
                            color="#cdcdcd15"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </React.Fragment>
                );
              }
            })}

          {packageExists(subscriptions?.data.results[0].id) ? null : (
            <>
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontFamily: "Trebuchet",
                  fontSize: 12,
                  padding: 40,
                }}
              >
                You have not purchased this package
              </Text>
            </>
          )}
        </View>

        <View
          style={{
            backgroundColor: "#000",
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
            <View>
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontFamily: "Trebuchet",
                  fontSize: 15,
                  padding: 20,
                }}
              >
                EP Package
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontFamily: "Trebuchet",
                  fontSize: 12,
                  marginBottom:20
                }}
              >
                (Package allows max of 10 tracks per slot)
              </Text>
            </View>
          </View>
          {artist_subscriptions &&
            artist_subscriptions.data.results.map((item) => {
              if (item.package.id == subscriptions.data.results[1].id) {
               
                return (
                  <React.Fragment key={item.id}>
                    <View

                      style={{
                        backgroundColor: "#ffffff50",
                        width: "90%",
                        marginLeft: 20,
                        marginRight: 20,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: 5,
                        marginTop: 10,
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontWeight: "700",
                          color: "#fff",
                          fontSize: 15,
                          padding: 20,
                        }}
                      >
                        Slot{" "}
                        {artist_subscriptions &&
                          artist_subscriptions.data.results.indexOf(item) + 1}
                      </Text>
                      <Text
                        style={{
                          textAlign: "center",
                          color: "white",
                          fontFamily: "Trebuchet",
                          fontSize: 15,
                          padding: 20,
                        }}
                      >
                        {item.songs_added}{" "}
                        {item.songs_added == 1 ? "track" : "tracks"}
                      </Text>
                      {item.songs_added < 10 ? (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={{
                            backgroundColor: "#010114",
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
                              
                              packageName: "EP Package"
                            });
                          }}
                        >
                          <Ionicons name="ios-add" size={24} color="white" />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          activeOpacity={1}
                          style={{
                            backgroundColor: "#cdcdcd20",
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
                            color="#cdcdcd15"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </React.Fragment>
                );
              }
            })}

          {packageExists(subscriptions?.data.results[1].id) ? null : (
            <>
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontFamily: "Trebuchet",
                  fontSize: 12,
                  padding: 40,
                }}
              >
                You have not purchased this package
              </Text>
            </>
          )}
        </View>
        <View
          style={{
            backgroundColor: "#000",
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
            <View>
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontFamily: "Trebuchet",
                  fontSize: 15,
                  padding: 20,
                }}
              >
                Album Package
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontFamily: "Trebuchet",
                  fontSize: 12,
                }}
              >
                (Package allows max of 20 tracks per slot)
              </Text>
            </View>
          </View>
          {artist_subscriptions &&
            artist_subscriptions.data.results.map((item) => {
              if (item.package.id == subscriptions.data.results[2].id) {
                return (
                  <React.Fragment key={item.id}>
                    <View
                      style={{
                        backgroundColor: "#ffffff50",
                        width: "90%",
                        marginLeft: 20,
                        marginRight: 20,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: 5,
                        marginTop: 30,
                        marginBottom: 20,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontWeight: "700",
                          color: "#fff",
                          fontSize: 15,
                          padding: 20,
                        }}
                      >
                        Slot{" "}
                        {artist_subscriptions &&
                          artist_subscriptions.data.results.indexOf(item) + 1}
                      </Text>
                      <Text
                        style={{
                          textAlign: "center",
                          color: "white",
                          fontFamily: "Trebuchet",
                          fontSize: 15,
                          padding: 20,
                        }}
                      >
                        {item.songs_added}{" "}
                        {item.songs_added == 1 ? "track" : "tracks"}
                      </Text>
                      {item.songs_added < 20 ? (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={{
                            backgroundColor: "#010114",
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
                              packageName: "Album Package"
                            });
                          }}
                        >
                          <Ionicons name="ios-add" size={24} color="white" />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          activeOpacity={1}
                          style={{
                            backgroundColor: "#cdcdcd20",
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
                            color="#cdcdcd15"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </React.Fragment>
                );
              }
            })}
          {packageExists(subscriptions?.data.results[2].id) ? null : (
            <>
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontFamily: "Trebuchet",
                  fontSize: 12,
                  padding: 40,
                }}
              >
                You have not purchased this package
              </Text>
            </>
          )}
        </View>
      </>
    </ScrollView>
  );
}

export default Subscriptions;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
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
    fontFamily: "Trebuchet",
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
    fontFamily: "Trebuchet",
    marginLeft: 20,
    marginTop: 20,
  },
  cards: {
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
    shadowColor: "#010114",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.55,
    shadowRadius: 10.78,

    elevation: 22,
  },
});
