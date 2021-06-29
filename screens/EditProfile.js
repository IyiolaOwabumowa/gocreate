import React, { useState, useEffect, useLayoutEffect } from "react";
import CountryPicker, {
  DARK_THEME,
  FlagButton,
} from "react-native-country-picker-modal";
import { TextInputMask } from "react-native-masked-text";
import {
  launchCamera,
  launchImageLibrary,
  ImagePicker,
} from "react-native-image-picker";
import * as Permissions from "expo-permissions";
import moment from "moment";

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
  FlatList,
  SafeAreaView,
  Alert,
  Platform,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
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
import { userActions } from "../src/actions/user.actions";
import { Spinner, Input } from "native-base";
import FastImage from "react-native-fast-image";

const width = Dimensions.get("window").width;

const EditProfile = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.userReducer.mode);
  const [firstName, setfirstName] = useState(null);
  const [lastName, setlastName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [email, setemail] = useState(null);
  const [dob, setdob] = useState(null);
  const [address, setaddress] = useState(null);
  const [state, setstate] = useState(null);
  const [lga, setlga] = useState(null);
  const [image, setimage] = useState(null);
  const [loader, setloader] = useState(false);

  const imageUrl = artist ? artist.dp.image : null;

  const token = useSelector((state) => state.authReducer.token);

  const artist = useSelector((state) =>
    state.userReducer.artist ? state.userReducer.artist : null
  );
  const id = useSelector((state) =>
    state.userReducer.artist ? state.userReducer.artist.id : null
  );
  const dp_id = useSelector((state) =>
    state.userReducer.artist ? state.userReducer.artist.dp.id : null
  );
  const message = useSelector((state) => state.userReducer.toastMessage);
  const buttonLoader = useSelector((state) => state.userReducer.loading);

  let options = {
    title: "Select Image",
    customButtons: [
      { name: "customOptionKey", title: "Choose Photo from Custom Option" },
    ],
    storageOptions: {
      skipBackup: true,
      path: "images",
    },
  };

  useEffect(() => {
    setimage(imageUrl);
  }, []);

  useEffect(() => {
    setimage(artist.dp.image);
  }, []);

  useEffect(() => {
    setfirstName(artist.first_name);
    setlastName(artist.last_name);
    setPhone(artist.phone);
    setemail(artist.email);
    setdob(artist.dob);
    setaddress(artist.address);
    setstate(artist.sor);
    setlga(artist.lga);
  }, []);

  useEffect(() => {
    if (message != null || message != undefined) {
      Toast.show({
        text: message,
        textStyle: {
          fontSize: 14,
          paddingLeft: 10,
        },
        duration: 3000,
        style: {
          backgroundColor: "#9DC828",
        },
        onClose: () => {
          dispatch(userActions.getArtist(token));
          dispatch(authActions.clearToastMessage());
        },
      });
    }
  }, [message]);

  const handleSubmit = () => {
    if (
      email == null ||
      firstName == null ||
      lastName == null ||
      phone == null ||
      address == null ||
      dob == null ||
      lga == null ||
      state == null
    ) {
      Toast.show({
        text: "Please recheck all fields",
        textStyle: {
          fontSize: 14,
          paddingLeft: 10,
        },
        duration: 10000,
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

      dispatch(
        userActions.updateProfile(
          email,
          firstName,
          lastName,
          phone,
          image,
          dp_id,
          id,
          token,
          address,
          dob,
          lga,
          state
        )
      );
    }
  };

  const renderCustomModal = (modalVisible, countries, onCountryChange) => (
    <Modal visible={modalVisible}>
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          <View>
            <TextInput placeholder="Search" />
            <Text>🔍</Text>
          </View>
          <FlatList
            style={{ flex: 1 }}
            data={countries}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback
                onPress={() => onCountryChange(item.code)}
              >
                <Text>{item["your language code here for example tr"]}</Text>
              </TouchableWithoutFeedback>
            )}
          />
        </View>
        <TouchableOpacity onPress={() => phoneInput.hideModal()}>
          <Text>CLOSE</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );

  const getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
  };

  const choosePhotoFromLibrary = async () => {
    // try {
    //   getPermissionAsync();
    //   let result = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.All,
    //     allowsEditing: false,
    //     aspect: [4, 3],
    //     quality: 1,
    //   });
    //   if (!result.cancelled) {
    //     setImage(result.uri);
    //   }
    // } catch (E) {
    //   console.log(E);
    // }

    launchImageLibrary(options, (response) => {
      // console.log("Response = ", response);

      if (response.didCancel) {
        // alert("User cancelled camera picker");
        return;
      } else if (response.errorCode == "camera_unavailable") {
        //alert("Camera not available on device");
        return;
      } else if (response.errorCode == "permission") {
        // alert("Permission not satisfied");
        return;
      } else if (response.errorCode == "others") {
        // alert(response.errorMessage);
        return;
      }

      setimage(response.assets[0].uri);
    });
  };

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: mode == "light" ? "white" : "black" }}
      contentContainerStyle={styles[`container${mode}`]}
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
          backgroundColor: mode == "light" ? "#fff" : "#000",
          width: "100%",

          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loader ? (
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        ) : null}

        <FastImage
          source={
            image != null
              ? {
                  uri: image.split("?")[0],
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }
              : require("../assets/dummy_avatar.png")
          }
          // resizeMode="cover"
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginTop: 30,
            marginBottom: 30,
          }}
        />

        <View style={{ width: "80%" }}>
          <Button
            style={{
              padding: 20,
              width: "100%",
              backgroundColor: mode == "light" ? "#000" : "#ffffff20",
              height: 30,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
            onPress={() => {
              choosePhotoFromLibrary();
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",

                fontSize: 13,
              }}
            >
              Select a display picture
            </Text>
          </Button>
        </View>
      </View>

      <View style={{}}>
        <Text
          style={{
            color: mode == "light" ? "black" : "white",

            fontSize: 23,
            fontWeight: "700",
            paddingLeft: 20,
            marginTop: 40,
            marginBottom: 10,
          }}
        >
          Let's get to know you
        </Text>
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
            color: mode == "light" ? "black" : "white",
            fontSize: 16,
            paddingTop: 20,
          }}
        >
          First Name
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: mode == "light" ? "black" : "white",
            width: 200,
          }}
        >
          <TextInput
            style={[styles[`textInput${mode}`], { height: 40 }]}
            placeholderTextColor="white"
            value={firstName}
            onChangeText={(text) => {
              setfirstName(text);
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
            color: mode == "light" ? "black" : "white",
            fontSize: 16,
            paddingTop: 20,
          }}
        >
          Last Name
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: mode == "light" ? "black" : "white",
            width: 200,
          }}
        >
          <TextInput
            style={[styles[`textInput${mode}`], { height: 40 }]}
            placeholderTextColor={mode == "light" ? "black" : "white"}
            value={lastName}
            onChangeText={(text) => {
              setlastName(text);
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
            color: mode == "light" ? "black" : "white",
            fontSize: 16,
            paddingTop: 20,
          }}
        >
          Phone
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: mode == "light" ? "black" : "white",
            height: 40,
            width: 200,
          }}
        >
          <Input
            keyboardType="number-pad"
            placeholder="Phone number"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
            }}
            style={{
              color: mode == "light" ? "black" : "white",
              fontSize: 15,
              marginLeft: 1,
              height: 50,
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
            color: mode == "light" ? "black" : "white",
            fontSize: 16,
            paddingTop: 20,
          }}
        >
          Email
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: mode == "light" ? "black" : "white",
            width: 200,
          }}
        >
          <TextInput
            style={[styles[`textInput${mode}`], { height: 40 }]}
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
            color: mode == "light" ? "black" : "white",
            fontSize: 16,
            paddingTop: 20,
          }}
        >
          Date of Birth
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: mode == "light" ? "black" : "white",
            width: 200,
          }}
        >
          <TextInputMask
            type={"datetime"}
            options={{
              format: "YYYY-MM-DD",
            }}
            value={dob}
            onChangeText={(text) => {
              setdob(text);
            }}
            placeholderTextColor={mode == "light" ? "black" : "white"}
            placeholder="YYYY-MM-DD"
            style={{
              fontSize: 16,

              color: mode == "light" ? "black" : "white",
              height: 40,
            }}
          />
        </View>
      </View>
      <View style={{}}>
        <Text
          style={{
            color: mode == "light" ? "black" : "white",

            fontSize: 23,
            fontWeight: "700",
            paddingLeft: 20,
            marginTop: 100,
            marginBottom: 10,
          }}
        >
          A bit about where you live
        </Text>
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
            color: mode == "light" ? "black" : "white",
            fontSize: 16,
            paddingTop: 20,
          }}
        >
          Address
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: mode == "light" ? "black" : "white",
            width: 200,
          }}
        >
          <TextInput
            style={[styles[`textInput${mode}`], { height: 40 }]}
            placeholderTextColor="white"
            value={address}
            onChangeText={(text) => {
              setaddress(text);
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
            color: mode == "light" ? "black" : "white",
            fontSize: 16,
            paddingTop: 20,
          }}
        >
          State
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: mode == "light" ? "black" : "white",
            width: 200,
          }}
        >
          <TextInput
            style={[styles[`textInput${mode}`], { height: 40 }]}
            placeholderTextColor={mode == "light" ? "black" : "white"}
            value={state}
            onChangeText={(text) => {
              setstate(text);
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
            color: mode == "light" ? "black" : "white",
            fontSize: 16,
            paddingTop: 20,
          }}
        >
          LGA
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: mode == "light" ? "black" : "white",
            width: 200,
          }}
        >
          <TextInput
            style={[styles[`textInput${mode}`], { height: 40 }]}
            placeholderTextColor="white"
            value={lga}
            onChangeText={(text) => {
              setlga(text);
            }}
          />
        </View>
      </View>

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Button
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            width: "100%",
            backgroundColor: mode == "light" ? "#00000090" : "#ffffff20",
            height: 50,
            alignItems: "center",
            justifyContent: "center",

            marginTop: 50,
            marginBottom: 100,
          }}
          onPress={() => {
            handleSubmit();
          }}
        >
          {buttonLoader ? (
            <Spinner color="#fff" size="small" />
          ) : (
            <Text
              style={{
                textAlign: "center",
                color: "white",

                fontSize: 13,
              }}
            >
              Update Profile
            </Text>
          )}
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  containerlight: {
    margin: 20,
    backgroundColor: "#fff",
  },
  containerdark: {
    margin: 20,
    backgroundColor: "#000",
  },

  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 40,
    opacity: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  textInputdark: {
    color: "white",

    fontSize: 16,
  },
  textInputlight: {
    color: "black",

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
