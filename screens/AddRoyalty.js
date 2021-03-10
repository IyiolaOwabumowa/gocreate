import React, { useState, useEffect, useLayoutEffect } from "react";
import { TextInputMask } from "react-native-masked-text";
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
import {
  MaterialCommunityIcons,
  FontAwesome5,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { authActions } from "../src/actions/auth.actions";
import { songActions } from "../src/actions/song.actions";

const width = Dimensions.get("window").width;
const songSelected = null;

function AddRoyalty() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);
  const songs = useSelector((state) =>
    state.songReducer.songs ? state.songReducer.songs : null
  );
  const royalties = useSelector((state) =>
    state.songReducer.songs ? state.songReducer.songs.royalties : null
  );
  const message = useSelector((state) => state.songReducer.message);
  const buttonLoader = useSelector((state) => state.songReducer.loading);

  const [fullname, setfullname] = useState(null);
  const [email, setemail] = useState(null);
  const [phone, setphone] = useState(null);
  const [song, setsong] = useState("None");
  const [share, setshare] = useState(null);
  const [description, setdescription] = useState(null)
  const [songList, setsongList] = useState([]);

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
        songActions.addRoyalty(token, share, email, phone, fullname, song, description)
      );
    }
  };

  useEffect(() => {
    dispatch(songActions.getSongs(token));
    if (songs.data.results.length != 0) {
      songs.data.results.forEach((song) => {
        songList.push({ id: song.id, value: song.title });
      });
    }
  }, []);

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
      <View
        style={{
          backgroundColor: "#010114",
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
          <FontAwesome5 name={"signature"} size={20} color="white" />
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontFamily: "Trebuchet",
              fontSize: 15,
              padding: 20,
            }}
          >
            Royalty's Details
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 20,
        }}
      >
        <Text style={{ fontFamily: "Trebuchet", color: "white", fontSize: 16 }}>
          Full Name
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "white",
            width: 200,
          }}
        >
          <TextInput
            style={styles.textInput}
            placeholderTextColor="white"
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
        <Text style={{ fontFamily: "Trebuchet", color: "white", fontSize: 16 }}>
          Email
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "white",
            width: 200,
          }}
        >
          <TextInput
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.textInput}
            placeholderTextColor="white"
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
            marginTop: 10,
            fontFamily: "Trebuchet",
            color: "white",
            fontSize: 16,
          }}
        >
          Phone
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "white",
            width: 200,
          }}
        >
          <IntlPhoneInput
            containerStyle={{ backgroundColor: "#101820FF", color: "white" }}
            phoneInputStyle={{ color: "white" }}
            dialCodeTextStyle={{ color: "white", marginLeft: 10 }}
            onChangeText={onChangeText}
            defaultCountry="NG"
            flagStyle={{}}
          />

          {/* <TextInput
            style={styles.textInput}
            placeholderTextColor="white"
            value={phone}
            onChangeText={(text) => {
              setphone(text);
            }}
          /> */}
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 20,
        }}
      >
        <Text style={{ fontFamily: "Trebuchet", color: "white", fontSize: 16 }}>
          Share (%)
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "white",
            width: 200,
          }}
        >
          <TextInput
            style={styles.textInput}
            keyboardType="number-pad"
            placeholderTextColor="white"
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
        <Text style={{ fontFamily: "Trebuchet", color: "white", fontSize: 16 }}>
          Description
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "white",
            width: 200,
          }}
        >
          <TextInput
            
            style={styles.textInput}
            placeholderTextColor="white"
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
          justifyContent: "center",
          marginTop: 40,
        }}
      >
        <Text style={{ fontFamily: "Trebuchet", color: "white", fontSize: 16 }}>
          Which song do you want to add this royalty to?
        </Text>
      </View>
      <View style={{marginLeft:20, marginRight:20, marginTop:20}}>
      <Picker
        selectedValue={song}
        onValueChange={(itemValue, itemIndex) => {
          setsong(itemValue);
        }}
        itemStyle={{color:"white"}}
      >
        <Picker.Item label={"None"} value={"None"} key={0} />
        {songList.map((item) => {
          return (
            <Picker.Item label={item.value} value={item.id} key={item.id} />
          );
        })}
      </Picker>
      </View>

      <Button
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          width: width - 40,
          backgroundColor: "#ffffff10",
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
              color: "white",
              fontFamily: "Trebuchet",
              fontSize: 13,
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
  container: {
    backgroundColor: "#101820FF",
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
