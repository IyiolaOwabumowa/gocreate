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
  Platform,
  Alert,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Input, Item } from "native-base";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import { authActions } from "../src/actions/auth.actions";
import { songActions } from "../src/actions/song.actions";
import { ScrollView } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";

const width = Dimensions.get("window").width;
const noOfRoyalties = 1;
function Royalties(props) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);
  const successMessage = useSelector((state) => state.songReducer.message);
  const mode = useSelector((state) => state.userReducer.mode);

  const songs = useSelector((state) =>
    state.songReducer.songs ? state.songReducer.songs : null
  );
  const royalties = useSelector((state) =>
    state.songReducer.songs ? state.songReducer.songs.royalties : null
  );
  const isFocused = useIsFocused();
  const [foundRoyalty, setFoundRoyalty] = useState(true);

  useEffect(() => {
    if (successMessage) {
      dispatch(songActions.getSongs(token));
    }
  }, [successMessage]);

  useEffect(() => {
    const filteredRoyalties = songs.data.results.filter(
      (song) => song.royalties.length != 0
    );
    if (filteredRoyalties.length != 0) {
      setFoundRoyalty(true);
    } else {
      setFoundRoyalty(false);
    }
  }, [songs]);

  const royalty = ({ item }) => {
    if (item) {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            Alert.alert(
              "Are you sure?",
              `Do you want to delete ${item.description} with a ${item.share}% share?`,
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => {
                    console.log(item.id);
                    dispatch(songActions.deleteRoyalty(item.id, token));
                  },
                },
              ],
              { cancelable: false }
            );
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              marginBottom: 15,
              backgroundColor: "#cdcdcd",
              paddingLeft: 10,
              paddingRight: 0,
              borderRadius: 3,
              marginRight: 10,
            }}
          >
            <Text style={{ color: "black", paddingRight: 10 }}>
              {item.description} {item.share}
              {"%"}
            </Text>
            <View
              style={{
                backgroundColor: mode == "light" ? "#000" : "#212121",

                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 5,
                paddingRight: 5,
                borderTopRightRadius: 3,
                borderBottomRightRadius: 3,
              }}
            >
              <SimpleLineIcons name="close" size={17} color="white" />
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const Item = ({ item }) => {
    return (
      <View
        style={{
          backgroundColor: mode == "light" ? "#fff" : "#11111120",
          width: width,
          marginBottom: 10,
          paddingLeft: 20,
          borderBottomWidth: 0.4,
          borderBottomColor: mode == "light" ? "#00000030" : "#ffffff40",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingTop: 10,

                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: mode == "light" ? "black" : "white",

                  fontSize: 15,
                }}
              >
                {item.title}
              </Text>
            </View>
            <View style={{}}>
              <FlatList
                numColumns={3}
                showsVerticalScrollIndicator={false}
                data={item.royalties}
                renderItem={royalty}
                keyExtractor={(item) => item.id}
              />
            </View>
          </View>
          <View style={{}}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("ManageRoyalties", {
                  song: item,
                });
              }}
              activeOpacity={0.8}
              style={{
                width: 70,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SimpleLineIcons
                name="pencil"
                size={20}
                color={mode == "light" ? "black" : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    if (item.royalties.length != 0) {
      return <Item item={item} />;
    }
  };

  if (!foundRoyalty) {
    return (
      <ScrollView
        style={{ backgroundColor: mode == "light" ? "#fff" : "#000" }}
        contentContainerStyle={styles[`container${mode}`]}
      >
        <StatusBar
          barStyle={mode == "light" ? "dark-content" : "light-content"}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome5
            name={"signature"}
            size={20}
            color={mode == "light" ? "black" : "white"}
          />
          <Text
            style={{
              color: mode == "light" ? "black" : "white",
              padding: 20,
            }}
          >
            You have no royalties
          </Text>
        </View>
      </ScrollView>
    );
  } else {
    return (
      <View style={styles[`container${mode}`]}>
        <StatusBar
          barStyle={mode == "light" ? "dark-content" : "light-content"}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={songs && songs.data.results}
          // style={styles[`container${mode}`]}
          // contentContainerStyle={{
          //   alignItems: "center",
          // }}
          ListHeaderComponent={<></>}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListFooterComponent={<></>}
        />
      </View>
    );
  }
}

export default Royalties;

const styles = StyleSheet.create({
  containerlight: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  containerdark: {
    flex: 1,
    backgroundColor: "#000000",
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
