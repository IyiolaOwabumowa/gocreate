import React, { useState, useEffect, useLayoutEffect } from "react";
import { TextInputMask } from "react-native-masked-text";
import DropDownPicker from "react-native-dropdown-picker";
import IntlPhoneInput from "react-native-intl-phone-input";
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
import { Picker } from "@react-native-community/picker";
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

function AddRoyalty(props) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);
  const songs = useSelector((state) => state.songReducer.songs);
  const royalties = useSelector((state) =>
    state.songReducer.songs ? state.songReducer.songs.royalties : null
  );
  const mode = useSelector((state) => state.userReducer.mode);
  const message = useSelector((state) => state.songReducer.message);
  const buttonLoader = useSelector((state) => state.songReducer.loading);

  const [fullname, setfullname] = useState(null);
  const [email, setemail] = useState(null);
  const [phone, setphone] = useState(null);
  const [song, setsong] = useState("None");
  const [share, setshare] = useState(null);
  const [description, setdescription] = useState(null);
  const [songList, setsongList] = useState([{ label: "", value: "" }]);

  const onChangeText = ({
    dialCode,
    unmaskedPhoneNumber,
    phoneNumber,
    isVerified,
  }) => {
    setphone(dialCode + "" + unmaskedPhoneNumber);
  };

  const handleSubmit = () => {
    if (
      email == null ||
      fullname == null ||
      phone == null ||
      share == null ||
      description == null ||
      song == "None"
    ) {
      Toast.show({
        text: "Please recheck all fields",
        textStyle: {
          fontSize: 14,
          paddingLeft: 10,
        },
        duration: 2000,
        style: {
          backgroundColor: "red",
        },
        onClose: () => {
          dispatch(authActions.clearToastMessage());
        },
      });
    } else {
      // const newDob = moment(dob, 'YYYY-MM-DD')
      // console.log(newDob);
      // moment(newDob).format('L');
      //console.log(token, share, email, phone, fullname, song, description);
      dispatch(
        songActions.addRoyalty(
          token,
          share,
          email,
          phone,
          fullname,
          song,
          description
        )
      );

      props.navigation.navigate("Royalties");
    }
  };

  useEffect(() => {
    if (message != null || message != undefined) {
      Toast.show({
        text: message,
        textStyle: {
          fontSize: 14,
          paddingLeft: 10,
        },
        duration: 10000,
        style: {
          backgroundColor: "#9DC828",
        },
        onClose: () => {
          dispatch(authActions.clearToastMessage());
        },
      });
    }
  }, [message]);

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: mode == "light" ? "#fff" : "#000" }}
      contentContainerStyle={styles[`container${mode}`]}
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 20,
          marginTop: 50,
        }}
      >
        <Text
          style={{
            color: mode == "light" ? "#212121" : "white",
            fontSize: 16,
          }}
        >
          Full Name
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: mode == "light" ? "#212121" : "white",
            width: 200,
          }}
        >
          <TextInput
            style={styles[`textInput${mode}`]}
            placeholderTextColor={mode == "light" ? "#212121" : "white"}
            value={fullname}
            onChangeText={(text) => {
              setfullname(text);
            }}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 20,
        }}
      >
        <Text
          style={{
            color: mode == "light" ? "#212121" : "white",
            fontSize: 16,
          }}
        >
          Email
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: mode == "light" ? "#212121" : "white",
            width: 200,
          }}
        >
          <TextInput
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles[`textInput${mode}`]}
            placeholderTextColor={mode == "light" ? "#212121" : "white"}
            value={email}
            onChangeText={(text) => {
              setemail(text);
            }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 20,
        }}
      >
        <Text
          style={{
            color: mode == "light" ? "#212121" : "white",
            fontSize: 16,
          }}
        >
          Phone
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: mode == "light" ? "#212121" : "white",
            width: 200,
          }}
        >
          {/* <IntlPhoneInput
            containerStyle={{
              backgroundColor: mode == "light" ? "#fff" : "#000",
              color: "white",
            }}
            phoneInputStyle={{ color: mode == "light" ? "black" : "white" }}
            dialCodeTextStyle={{
              color: mode == "light" ? "black" : "white",
              marginLeft: 10,
            }}
            onChangeText={onChangeText}
            defaultCountry="NG"
            flagStyle={{}}
          /> */}

          <TextInput
            style={styles[`textInput${mode}`]}
            placeholderTextColor={mode == "light" ? "#000" : "white"}
            value={phone}
            onChangeText={(text) => {
              setphone(text);
            }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 20,
        }}
      >
        <Text
          style={{
            color: mode == "light" ? "#212121" : "white",
            fontSize: 16,
          }}
        >
          Share (%)
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: mode == "light" ? "#212121" : "white",
            width: 200,
          }}
        >
          <TextInput
            style={styles[`textInput${mode}`]}
            keyboardType="number-pad"
            placeholderTextColor={mode == "light" ? "#212121" : "white"}
            value={share}
            onChangeText={(text) => {
              setshare(text);
            }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 20,
        }}
      >
        <Text
          style={{
            color: mode == "light" ? "#212121" : "white",
            fontSize: 16,
          }}
        >
          Description
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: mode == "light" ? "#212121" : "white",
            width: 200,
          }}
        >
          <TextInput
            style={styles[`textInput${mode}`]}
            placeholderTextColor={mode == "light" ? "#212121" : "white"}
            value={description}
            onChangeText={(text) => {
              setdescription(text);
            }}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          marginLeft: 20,
          marginTop: 40,
        }}
      >
        <Text
          style={{
            color: mode == "light" ? "#212121" : "white",
            fontSize: 16,
          }}
        >
          Which song do you want to add this royalty to?
        </Text>
      </View>

      <View style={{ marginLeft: 20, marginRight: 20, marginTop: 20 }}></View>

      <DropDownPicker
        items={songs.data.results.map((song) => {
          return { value: song.id, label: song.title };
        })}
        placeholder="Pick a song"
        selectedLabelStyle={{
          color: mode == "light" ? "#212121" : "white",
          fontSize: 16,
        }}
        placeholderStyle={{
          color: mode == "light" ? "#212121" : "white",
          fontSize: 16,
        }}
        containerStyle={{ height: 80 }}
        style={{
          backgroundColor: mode == "light" ? "#ffffff" : "#000000",
          margin: 5,
          borderWidth: 0,
        }}
        itemStyle={{
          justifyContent: "flex-start",
        }}
        dropDownStyle={{
          backgroundColor: "#fafafa",
          margin: 20,
          width: "91%",
        }}
        onChangeItem={(item) =>
          // this.setState({
          //   country: item.value,
          // })
          setsong(item.value)
        }
      />

      <Button
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          width: width - 40,
          backgroundColor: mode == "light" ? "#00000050" : "#ffffff10",
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          margin: 20,
        }}
        onPress={handleSubmit}
      >
        {buttonLoader ? (
          <Spinner color="#fff" size="small" />
        ) : (
          <Text
            style={{
              textAlign: "center",
              color: mode == "light" ? "white" : "white",

              fontSize: 15,
            }}
          >
            Add Royalty
          </Text>
        )}
      </Button>
    </KeyboardAwareScrollView>
  );
}

export default AddRoyalty;

const styles = StyleSheet.create({
  containerlight: {
    backgroundColor: "#fff",
  },
  containerdark: {
    backgroundColor: "#000",
  },

  textInputlight: {
    color: "#000",

    fontSize: 16,
  },
  textInputdark: {
    color: "white",

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
