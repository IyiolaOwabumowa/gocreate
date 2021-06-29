import React, { useState, useEffect, useLayoutEffect } from "react";
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
  TextInput,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Item, Toast } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTv,
  faPodcast,
  faStream,
  faPlay,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";

import { ScrollView } from "react-native-gesture-handler";
import { authActions } from "../src/actions/auth.actions";
import { songActions } from "../src/actions/song.actions";

const width = Dimensions.get("window").width;
const songSelected = null;

function ManageRoyalties(props) {
  const [email, setemail] = useState(null);
  const [phone, setphone] = useState(null);
  const [fullname, setfullname] = useState(null);
  const [share, setshare] = useState(null);
  const [splittings, setsplittings] = useState([]);
  const mode = useSelector((state) => state.userReducer.mode);
  const [arrayPushed, setarrayPushed] = useState(false);
  const [songVal, setsongVal] = useState(null);
  const { song } = props.route.params;
  const royalties = song.royalties;

  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);
  const songs = useSelector((state) =>
    state.songReducer.songs ? state.songReducer.songs : null
  );
  const royaltiesS = useSelector((state) =>
    state.songReducer.songs ? state.songReducer.songs : null
  );
  const message = useSelector((state) => state.songReducer.message);
  const loading = useSelector((state) => state.songReducer.loading);

  useEffect(() => {
    if (message != null || message != undefined) {
      Toast.show({
        text: message,
        textStyle: {
          fontSize: 14,
          paddingLeft: 10,
        },
        duration: 2000,
        style: {
          backgroundColor: "#9DC828",
        },
        onClose: () => {
          dispatch(authActions.clearToastMessage());
        },
      });
    }
  }, [message]);

  const handleSplitting = () => {
    splittings.forEach((split) => {
      dispatch(
        songActions.updateRoyalty(
          split.id,
          token,
          split.share,
          split.email,
          split.phone,
          split.fullname,
          split.song,
          split.description
        )
      );
    });
  };
  const royalty = ({ item }) => {
    return (
      <View
        style={{
          backgroundColor: "white",
          paddingLeft: 5,
          paddingRight: 5,
          borderRadius: 2,
          marginRight: 5,
        }}
      >
        <Text
          style={{
            color: "#101820",
          }}
        >
          {item.description} {item.share}
          {"%"}
        </Text>
      </View>
    );
  };

  const splittingDetails = ({ item, index }) => {
    if (arrayPushed == false) {
      splittings.push({
        id: item.id,
        share: item.share,
        email: item.email,
        phone: item.phone,
        fullname: item.fullname,
        song: item.song,
        description: item.description,
      });
      setarrayPushed(true);
    }

    var splitValue = splittings[index].share.toString();

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 20,
        }}
      >
        <Text
          style={{
            color: mode == "light" ? "black" : "white",
            fontSize: 16,
            paddingTop: 10,
          }}
        >
          For {item.description}
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: mode == "light" ? "#000" : "white",

            width: 200,
          }}
        >
          <TextInput
            style={styles[`textInput${mode}`]}
            keyboardType="number-pad"
            placeholder={`${splittings[index].share}% (unchanged)`}
            placeholderTextColor={mode == "light" ? "#00000050" : "#ffffff30"}
            // value={splitValue}
            onChangeText={(text) => {
              splittings[index].share = text;
              setsplittings(splittings);
            }}
          />
        </View>
      </View>
    );
  };
  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: mode == "light" ? "#fff" : "#000" }}
      contentContainerStyle={styles.container}
      behavior="padding"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      extraScrollHeight={50}
      enabled
      enableOnAndroid={true}
    >
      <View
        style={{
          backgroundColor: mode == "light" ? "#000000" : "#212121",
          padding: 50,
        }}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View
            style={{
              borderRadius: 5,
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
              }}
            >
              "{song.title}" - Splitting Information
            </Text>
          </View>
          <FlatList
            numColumns={3}
            showsVerticalScrollIndicator={false}
            data={royalties}
            renderItem={royalty}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={royalties}
        renderItem={splittingDetails}
        keyExtractor={(item) => item.id}
      />
      <Button
        onPress={handleSplitting}
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          width: width - 40,
          backgroundColor: mode == "light" ? "#00000090" : "#ffffff10",
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          margin: 20,
        }}
      >
        {loading ? (
          <Spinner color="#fff" size="small" />
        ) : (
          <Text
            style={{
              textAlign: "center",
              color: mode == "light" ? "#fff" : "#fff",

              fontSize: 13,
            }}
          >
            Update Splitting
          </Text>
        )}
      </Button>
    </KeyboardAwareScrollView>
  );
}

export default ManageRoyalties;

const styles = StyleSheet.create({
  containerlight: {
    backgroundColor: "#fff",
  },
  containerdark: {
    backgroundColor: "#000",
  },
  textInputlight: {
    color: "black",
    paddingBottom: 10,
    fontSize: 16,
  },
  textInputdark: {
    color: "white",
    paddingBottom: 10,
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
