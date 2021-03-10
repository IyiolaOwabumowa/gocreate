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
import { Spinner } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Item } from "native-base";
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
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import axios from "axios";

import { ScrollView } from "react-native-gesture-handler";
import { songActions } from "../src/actions/song.actions";
import { authActions } from "../src/actions/auth.actions";
import { userActions } from "../src/actions/user.actions";

const width = Dimensions.get("window").width;
const songSelected = null;

function AddTrack({ route, navigation }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);
  const songs = useSelector((state) =>
    state.songReducer.songs ? state.songReducer.songs : null
  );
  const artist = useSelector((state) =>
    state.userReducer.artist ? state.userReducer.artist : null
  );

  const { distroId } = route.params;
  const { packageName } = route.params;

  useEffect(() => {
    dispatch(songActions.getSongs(token));
    dispatch(userActions.getArtist(token));
    //  console.log(artist);
  }, []);

  const addTrackToSlot = (trackid, songname) => {
    const artistId = artist.id.toString();
    const trackId = trackid.toString();
    const planId = distroId.toString();
    Alert.alert(
      "Are you sure?",
      `Do you want to add ${songname} to the ${packageName}?`,
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
            return axios
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
                //console.log(response.status);
                // const successObject = { status: response.status, data: response.data };
                if (response.status == 201) {
                  Alert.alert(
                    "Successful",
                    "Track added successfully",
                    [
                      {
                        text: "Back to Distribution",
                        onPress: () => {
                          navigation.navigate("Subscriptions");
                        },
                      },
                    ],
                    { cancelable: false }
                  );
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
  return (
    <>
      <View
        style={{
          backgroundColor: "#010114",
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "90%",
            marginLeft: 30,
            marginRight: 30,
            marginTop: 10,
            marginBottom: 25,
            backgroundColor: "#ffffff30",
            height: 40,
            borderRadius: 3,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            placeholderTextColor="white"
            placeholder="Search uploads"
            style={{
              flex: 1,
              fontFamily: "Trebuchet",
              marginLeft: 15,
              color: "white",
            }}
          />
        </View>
      </View>

      {songs && songs.data.results.length == 0 ? (
        <ScrollView
          style={{ backgroundColor: "#101820FF" }}
          contentContainerStyle={styles.containerNoPayouts}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
             <Text
              style={{ fontFamily: "Trebuchet", color: "white", padding: 20 }}
            >
              You have no songs uploaded
            </Text>
          </View>
        </ScrollView>
      ) : (
        <>
          <KeyboardAwareScrollView
            style={{ backgroundColor: "#101820FF" }}
            contentContainerStyle={styles.container}
            behavior="padding"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            extraScrollHeight={50}
            enabled
            enableOnAndroid={true}
          >
            {songs &&
              songs.data.results.map((item) => {
                return (
                  <>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        padding: 20,
                        backgroundColor: "#ffffff10",
                        borderWidth: 1,
                        borderColor: "#ffffff00",
                        borderBottomColor: "#ffffff10",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontFamily: "Trebuchet", color: "white" }}>
                        {item.title}
                      </Text>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#010114",
                          paddingLeft: 15,
                          paddingRight: 15,
                          paddingTop: 8,
                          paddingBottom: 8,
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
                            fontFamily: "Trebuchet",
                            color: "white",
                            fontSize: 13,
                          }}
                        >
                          Add to slot
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
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
  container: {
    backgroundColor: "#101820FF",
  },
  containerNoPayouts: {
   flex:1,
    backgroundColor: "#101820FF",
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    color: "white",
    fontFamily: "Trebuchet",
    fontSize: 16,
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
