import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  TextInput,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Spinner, Toast } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";

import { ScrollView } from "react-native-gesture-handler";
import { songActions } from "../src/actions/song.actions";
import { authActions } from "../src/actions/auth.actions";
import { userActions } from "../src/actions/user.actions";
import { subscriptionActions } from "../src/actions/subscription.actions";

const width = Dimensions.get("window").width;
const songSelected = null;

function AddTrack({ route, navigation }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);
  const songs = useSelector((state) => state.songReducer.songs);
  const artist = useSelector((state) =>
    state.userReducer.artist ? state.userReducer.artist : null
  );
  const mode = useSelector((state) => state.userReducer.mode);

  const { distroId } = route.params;
  const { packageName } = route.params;

  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const addTrackToSlot = (trackid, songname) => {
    const artistId = artist.id.toString();
    const trackId = trackid.toString();
    const planId = distroId.toString();
    Alert.alert(
      "Are you sure?",
      `You are about to add ${songname} to ${packageName} for distribution`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            //({ artist: artistId, song: trackId, plan: planId });
            console.log({
              artist: artistId,
              song: trackId,
              plan: planId,
            });
            axios
              .post(
                "https://web.gocreateafrica.app/api/v1/subscriptions/song/add/",
                {
                  artist: artistId,
                  song: trackId,
                  plan: planId,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((response) => {
                console.log(response.status);
                // const successObject = { status: response.status, data: response.data };
                if (response.status == 201) {
                  dispatch(subscriptionActions.getArtistSubscriptions(token));
                  dispatch(songActions.getSongs(token));
                  navigation.goBack();
                  Toast.show({
                    text: `We've added this song to ${packageName} `,
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
                }
              })
              .catch(function (error) {
                console.log(error);
                if (error.response) {
                  // Request made and server responded
                  const values = Object.values(error.response.data);
                  const errorObject = {
                    status: error.response.status,
                    error: values[0],
                  };

                  //console.log(error.response);
                  return errorObject;
                }
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const temp = [];
    songs.data.results.map((song) => temp.push(song));
    setFilteredSongs(temp);
  }, []);

  return (
    <>
      <StatusBar
        barStyle={mode == "light" ? "dark-content" : "light-content"}
      />
      <View
        style={{
          backgroundColor: mode == "light" ? "#d5d5d5" : "#000",
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            marginLeft: 30,
            marginRight: 30,

            backgroundColor: mode == "light" ? "#11111110" : "#ffffff20",
            height: 40,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            placeholderTextColor={mode == "light" ? "#00000090" : "white"}
            placeholder="Search songs"
            value={searchKey}
            onChangeText={(text) => {
              setSearchKey(text);
              setFilteredSongs(
                songs.data.results.filter((song) =>
                  song.title.toLowerCase().includes(text.toLowerCase())
                )
              );
            }}
            style={{
              flex: 1,
              marginLeft: 15,
              color: mode == "light" ? "#00000090" : "white",
            }}
          />
        </View>
      </View>

      {songs && songs.data.results.length == 0 ? (
        <ScrollView
          style={{ backgroundColor: mode == "light" ? "#fff" : "#000" }}
          contentContainerStyle={styles[`container${mode}`]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                color: mode == "light" ? "black" : "white",
                padding: 20,
              }}
            >
              You have no songs uploaded
            </Text>
          </View>
        </ScrollView>
      ) : (
        <>
          <KeyboardAwareScrollView
            style={{ backgroundColor: mode == "light" ? "#ffffff" : "#000" }}
            contentContainerStyle={styles[`scrollcontainer${mode}`]}
            behavior="padding"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            extraScrollHeight={50}
            enabled
            enableOnAndroid={true}
          >
            <StatusBar
              barStyle={mode == "light" ? "dark-content" : "light-content"}
            />

            {filteredSongs.map((item) => {
              return (
                <View
                  key={item.id}
                  style={{
                    height: 75,
                    flexDirection: "row",
                    padding: 20,
                    backgroundColor: mode == "light" ? "#ffffff" : "#ffffff10",
                    borderWidth: 1,
                    borderColor: mode == "light" ? "#00000040" : "#ffffff00",
                    borderBottomColor: "#ffffff10",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: mode == "light" ? "black" : "white",
                    }}
                  >
                    {item.title}
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#32CD3275",
                      paddingLeft: 15,
                      paddingRight: 15,

                      borderRadius: 3,
                    }}
                    activeOpacity={0.6}
                    onPress={() => {
                      // props.navigation.navigate("Subscriptions");
                      // console.log(item.id)

                      addTrackToSlot(item.id, item.title);
                    }}
                  >
                    <Text
                      style={{
                        color: mode == "light" ? "black" : "white",
                        fontSize: 13,
                        paddingTop: 8,
                        paddingBottom: 8,
                      }}
                    >
                      Add to slot
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </KeyboardAwareScrollView>
        </>
      )}
    </>
  );
}

export default AddTrack;

const styles = StyleSheet.create({
  containerlight: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  containerdark: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  scrollcontainerlight: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollcontainerdark: {
    flex: 1,
    backgroundColor: "#000",
  },
  textInput: {
    color: "white",

    fontSize: 16,
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
