import React, { useState, useEffect, useLayoutEffect } from "react";
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
  Keyboard,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Toast, Spinner } from "native-base";
import * as Progress from "react-native-progress";
import { useIsFocused } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { ScrollView, FlatList } from "react-native-gesture-handler";
import { authActions } from "../src/actions/auth.actions";
import { songActions } from "../src/actions/song.actions";
import Clipboard from "@react-native-community/clipboard";

const width = Dimensions.get("window").width;

function Uploads(props) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const token = useSelector((state) => state.authReducer.token);

  const artist = useSelector((state) => state.userReducer.artist);
  const mode = useSelector((state) => state.userReducer.mode);
  const songs = useSelector((state) =>
    state.songReducer.songs ? state.songReducer.songs : null
  );
  const loading = useSelector((state) => state.songReducer.loading);
  const focused = useIsFocused();

  useEffect(() => {}, [success]);

  function countItem(item) {
    if (songs) {
      var count = 0;
      var arr = songs.data.results;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].subscriptions.length == 0 && item == "Unassigned") {
          count = count + 1;
        }
        if (arr[i].subscriptions.length != 0) {
          console.log(arr[i].subscriptions[0].package.title);
          if (arr[i].subscriptions.length == 1) {
            if (arr[i].subscriptions[0].package.title == item) {
              count = count + 1;
            }
          }
          if (arr[i].subscriptions.length > 1) {
            for (var j = 0; j < arr[i].subscriptions.length; j++) {
              if (arr[i].subscriptions[j].package.title == item) {
                count = count + 1;
              }
            }
          }
        }
      }
      return count;
    }
  }

  const Item = ({ item }) => {
    return (
      <View
        style={{
          backgroundColor: mode == "light" ? "#fff" : "#ffffff40",

          borderLeftColor: "#9DC828",
          borderLeftWidth: 3,
          marginLeft: 30,
          width: width - 70,
          height: 70,
          marginTop: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{}}>
            <Text
              style={{
                color: mode == "light" ? "#000" : "#fff",
                paddingLeft: 20,
                paddingTop: 10,
                paddingBottom: 10,
                fontSize: 15,
              }}
            >
              {item.title} ({item.file_size})
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Clipboard.setString(item.fingerprint);

                Toast.show({
                  text: "Fingerprint has been copied to your clipboard",
                  textStyle: {
                    fontSize: 14,
                    paddingLeft: 10,
                  },
                  duration: 4000,
                  style: {
                    backgroundColor: "#9DC828",
                  },
                  onClose: () => {
                    dispatch(authActions.clearToastMessage());
                  },
                });
              }}
              style={{
                width: "100%",
                backgroundColor: "#00000015",
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 10,
                paddingRight: 10,
                marginLeft: 20,
              }}
            >
              <Text
                style={{
                  color: mode == "light" ? "#000" : "white",

                  fontSize: 13,
                }}
              >
                Copy Fingerprint
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginRight: 20,
              padding: 10,
              backgroundColor: "101820FF",
              borderRadius: 5,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                Alert.alert(
                  `Delete ${item.title}`,
                  "Are you sure you want to delete this song?",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        axios
                          .delete(
                            `https://web.gocreateafrica.app/api/v1/songs/details/${item.id}/`,
                            {
                              headers: {
                                "Access-Control-Allow-Origin": "*",
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          )
                          .then((response) => {
                            const successObject = { data: "Delete Successful" };
                            dispatch(songActions.getSongs(token));
                            Alert.alert("Deletion Successful");
                            setSuccess("Deletion Successful");
                            //  const token = res.data.token;
                            //  const id = 1;
                            //  const auth = {id, token}
                            //  return auth;
                            // console.log(successObject);
                            return successObject;
                          })
                          .catch((error) => {
                            console.log(error.response);
                            if (error.response) {
                              // Request made and server responded
                              const values = Object.values(error.response.data);
                              const errorObject = {
                                status: error.response.status,
                                error: error.response.data.message,
                              };
                              // for (const value of values) {
                              //   console.log(value[0])
                              // }
                              Alert.alert(error.response.data.message);
                              return errorObject;
                            }

                            Promise.reject(error);
                          });
                      },
                    },
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                  ],
                  { cancelable: false }
                );
              }}
            >
              <MaterialIcons
                name="cancel"
                size={27}
                color={mode == "light" ? "#00000030" : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    if (open) {
      return <Item item={item} />;
    } else {
      return null;
    }
  };

  return (
    <View style={styles[`container${mode}`]}>
      <StatusBar
        barStyle={mode == "light" ? "dark-content" : "light-content"}
      />
      {loading ? (
        <Spinner color="#fff" size="small" />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={songs && songs.data.results}
          style={styles[(`container${mode}`, { width: "100%" })]}
          contentContainerStyle={{
            alignItems: "center",
          }}
          ListHeaderComponent={
            <>
              <TouchableOpacity
                style={{
                  backgroundColor: "#9DC828",
                  width: width,
                  paddingLeft: 10,
                  height: 50,
                  justifyContent: "center",
                }}
                activeOpacity={0.8}
                onPress={() => {
                  setOpen(!open);
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: mode == "light" ? "white" : "black",
                      padding: 10,
                      fontSize: 14,
                    }}
                  >
                    Uploaded songs ({songs && songs.data.results.length})
                  </Text>
                  <View style={{ marginRight: 30 }}>
                    {open ? (
                      <AntDesign
                        name="down"
                        size={14}
                        color={mode == "light" ? "white" : "black"}
                      />
                    ) : (
                      <AntDesign
                        name="right"
                        size={14}
                        color={mode == "light" ? "white" : "black"}
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </>
          }
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListFooterComponent={
            <>
              <View
                style={{
                  backgroundColor: mode == "light" ? "#fff" : "#111111",
                  width: width - 30,
                  marginTop: 20,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: mode == "light" ? "black" : "white",
                      padding: 20,
                      fontSize: 18,
                    }}
                  >
                    {countItem("Single") == 1
                      ? countItem("Single") + " song"
                      : countItem("Single") + " songs"}{" "}
                    in Singles
                  </Text>
                  <View style={{ marginRight: 20 }}>
                    {/* <SimpleLineIcons
                      name={"music-tone"}
                      size={24}
                      color={mode == "light" ? "black" : "white"}
                    /> */}
                  </View>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: mode == "light" ? "#fff" : "#111111",
                  width: width - 30,
                  marginTop: 20,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: mode == "light" ? "black" : "white",
                      padding: 20,
                      fontSize: 18,
                    }}
                  >
                    {countItem("EP") == 1
                      ? countItem("EP") + " song"
                      : countItem("EP") + " songs"}{" "}
                    in EPs
                  </Text>
                  <View style={{ marginRight: 20 }}>
                    {/* <MaterialCommunityIcons
                      name="playlist-music-outline"
                      size={24}
                      color={mode == "light" ? "black" : "white"}
                    /> */}
                  </View>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: mode == "light" ? "#fff" : "#111111",
                  width: width - 30,
                  marginTop: 20,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: mode == "light" ? "black" : "white",
                      padding: 20,
                      fontSize: 18,
                    }}
                  >
                    {countItem("Album") == 1
                      ? countItem("Album") + " song"
                      : countItem("Album") + " songs"}{" "}
                    in Albums
                  </Text>
                  <View style={{ marginRight: 20 }}>
                    {/* <Entypo
                      name="folder-music"
                      size={24}
                      color={mode == "light" ? "black" : "white"}
                    /> */}
                  </View>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: mode == "light" ? "#fff" : "#111111",
                  width: width - 30,
                  marginTop: 20,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: mode == "light" ? "black" : "white",
                      padding: 20,
                      fontSize: 18,
                    }}
                  >
                    {countItem("Unassigned") == 1
                      ? countItem("Unassigned") + " song"
                      : countItem("Unassigned") + " songs"}{" "}
                    Unassigned
                  </Text>
                  <View style={{ marginRight: 20 }}>
                    {/* <SimpleLineIcons
                      name={"music-tone"}
                      size={24}
                      color={mode == "light" ? "black" : "white"}
                    /> */}
                  </View>
                </View>
              </View>

              <View
                style={{
                  height: 300,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: mode == "light" ? "#fff" : "#111111",
                  width: width - 30,
                  marginTop: 20,
                  borderRadius: 5,
                }}
              >
                <Progress.Circle
                  progress={
                    artist.storage.used_space / artist.storage.total_space
                  }
                  size={170}
                  indeterminate={false}
                  color={"#9DC828"}
                  borderWidth={2}
                  showsText={true}
                  strokeCap="round"
                  thickness={7}
                  animated={true}
                  formatText={() => {
                    return (
                      (
                        (artist.storage.used_space /
                          artist.storage.total_space) *
                        100
                      ).toFixed(2) + "%"
                    );
                  }}
                />

                <Text
                  style={{
                    color: mode == "light" ? "black" : "white",
                    paddingTop: 20,
                    fontSize: 14,
                    textAlign: "center",
                    lineHeight: 30,
                  }}
                >
                  Used storage space: {"\n"}{" "}
                  {artist.storage.used_space.toFixed(2)}
                  {"MB"} out of {artist.storage.total_space}
                  {"MB"}
                </Text>
              </View>
            </>
          }
        />
      )}
    </View>
    // </ScrollView>
  );
}

export default Uploads;

const styles = StyleSheet.create({
  containerlight: {
    flex: 1,
    backgroundColor: "#00000010",
  },
  containerdark: {
    flex: 1,
    backgroundColor: "#000000",
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
