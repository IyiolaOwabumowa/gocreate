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
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  FontAwesome,
} from "@expo/vector-icons";
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
  const songs = useSelector((state) =>
    state.songReducer.songs ? state.songReducer.songs : null
  );
  const royalties = useSelector((state) =>
    state.songReducer.songs ? state.songReducer.songs.royalties : null
  );
  const isFocused = useIsFocused();
  useEffect(() => {
    dispatch(songActions.getSongs(token));
    console.log(isFocused);
  }, [isFocused]);

  // const deleteRoyalty = ()=>{

  // }

  useEffect(() => {
    if (successMessage) {
      Alert.alert(successMessage);
      dispatch(songActions.getSongs(token));
    }
  }, [successMessage]);

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
              marginRight: 5,
              marginBottom: 20,
              backgroundColor: "#9DC828",
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 3,
              paddingTop: 1,
              paddingBottom: 1,
            }}
          >
            <Text style={{ fontFamily: "Trebuchet", color: "black" }}>
              {item.description} {item.share}
              {"%"}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const Item = ({ item }) => {
    return (
      <View
        style={{
          backgroundColor: "#010114",

          width: width,
          marginBottom: 10,
          paddingLeft: 20,
          borderBottomWidth: 0.4,
          borderBottomColor: "#ffffff40",
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
                paddingTop: 20,
                paddingBottom: 20,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Trebuchet",
                  color: "white",

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
                backgroundColor: "#9DC828",
                height: 40,
                width: 40,
                borderRadius: 3,
                marginRight: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SimpleLineIcons name="pencil" size={17} color="black" />
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

  if (songs.data.results.length == 0) {
    return (
      <ScrollView
        style={{ backgroundColor: "#101820FF" }}
        contentContainerStyle={styles.containerNoRoyalty}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome5 name={"signature"} size={20} color="white" />
          <Text
            style={{ fontFamily: "Trebuchet", color: "white", padding: 20 }}
          >
            You have no royalties
          </Text>
        </View>
      </ScrollView>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#101820FF",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FlatList
          showsVerticalScrollIndicator={false}
          data={songs && songs.data.results}
          style={styles.container}
          contentContainerStyle={{
            alignItems: "center",
          }}
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
  container: {
    flex: 1,
    backgroundColor: "#101820FF",
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
