import React, { useState, useEffect, useLayoutEffect } from "react";
import { TextInputMask } from "react-native-masked-text";
import IntlPhoneInput from "react-native-intl-phone-input";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
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
import {
  MaterialCommunityIcons,
  FontAwesome5,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { authActions } from "../src/actions/auth.actions";
import { userActions } from "../src/actions/user.actions";
import { Spinner } from "native-base";

const width = Dimensions.get("window").width;

function EditProfile({ route }) {
  const dispatch = useDispatch();
  const [firstName, setfirstName] = useState(null);
  const [lastName, setlastName] = useState(null);
  const [phone, setphone] = useState(null);
  const [email, setemail] = useState(null);
  const [dob, setdob] = useState(null);
  const [address, setaddress] = useState(null);
  const [state, setstate] = useState(null);
  const [lga, setlga] = useState(null);
  const [image, setimage] = useState(null);
  const [loader, setloader] = useState(false);

  const { imageUrl } = route.params;

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

  useEffect(() => {
    setimage(imageUrl);
  }, []);

  useEffect(() => {
    setimage(artist.dp.image);
  }, [artist.dp.image]);

  useEffect(() => {
    setfirstName(artist.first_name);
    setlastName(artist.last_name);
    setphone(artist.phone);
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
  const onChangeText = ({
    dialCode,
    unmaskedPhoneNumber,
    phoneNumber,
    isVerified,
  }) => {
    setphone(dialCode + "" + unmaskedPhoneNumber);
  };
  // const renderCustomModal = (modalVisible, countries, onCountryChange) => (
  //   <Modal visible={modalVisible}>
  //     <SafeAreaView style={{ flex: 1 }}>
  //       <View>
  //         <View>
  //           <TextInput placeholder="Search" />
  //           <Text>🔍</Text>
  //         </View>
  //         <FlatList
  //           style={{ flex: 1 }}
  //           data={countries}
  //           keyExtractor={(item, index) => index.toString()}
  //           renderItem={({ item }) => (
  //             <TouchableWithoutFeedback
  //               onPress={() => onCountryChange(item.code)}
  //             >
  //               <Text>{item["your language code here for example tr"]}</Text>
  //             </TouchableWithoutFeedback>
  //           )}
  //         />
  //       </View>
  //       <TouchableOpacity onPress={() =>  phoneInput.hideModal()}>
  //         <Text>CLOSE</Text>
  //       </TouchableOpacity>
  //     </SafeAreaView>
  //   </Modal>
  // );

  const getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
  };

  const choosePhotoFromLibrary = async () => {
    try {
      getPermissionAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setimage(result.uri);
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };
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

        {image != null ? (
          <Image
            source={{ uri: image }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginTop: 30,
              marginBottom: 30,
            }}
            onLoadStart={() => {
              setloader(true);
            }}
            onLoadEnd={() => {
              setloader(false);
            }}
          />
        ) : (
          <View
            style={{
              backgroundColor: "grey",
              width: 100,
              height: 100,
              borderRadius: 50,
              marginTop: 30,
              marginBottom: 30,
            }}
          ></View>
        )}

        <Button
          style={{
            padding: 20,
            backgroundColor: "#ffffff10",
            height: 30,
            alignItems: "center",
            justifyContent: "center",
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
              fontFamily: "Trebuchet",
              fontSize: 13,
            }}
          >
            Select a display picture
          </Text>
        </Button>
      </View>
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
          <Ionicons name="ios-person" size={24} color="white" />
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontFamily: "Trebuchet",
              fontSize: 15,
              padding: 20,
            }}
          >
            Personal Information
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
          First Name
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
        <Text style={{ fontFamily: "Trebuchet", color: "white", fontSize: 16 }}>
          Last Name
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
        <Text style={{ fontFamily: "Trebuchet", color: "white", fontSize: 16 }}>
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
        <Text style={{ fontFamily: "Trebuchet", color: "white", fontSize: 16 }}>
          Date of Birth
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "white",
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
            placeholderTextColor="white"
            placeholder="YYYY-MM-DD"
            style={{ fontSize: 16, fontFamily: "Trebuchet", color: "white" }}
          />
        </View>
      </View>
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
          <Entypo name="location-pin" size={24} color="white" />
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontFamily: "Trebuchet",
              fontSize: 15,
              padding: 20,
            }}
          >
            Location Information
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
          Address
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
        <Text style={{ fontFamily: "Trebuchet", color: "white", fontSize: 16 }}>
          State
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
        <Text style={{ fontFamily: "Trebuchet", color: "white", fontSize: 16 }}>
          LGA
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
            value={lga}
            onChangeText={(text) => {
              setlga(text);
            }}
          />
        </View>
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
              fontFamily: "Trebuchet",
              fontSize: 13,
            }}
          >
            Update Profile
          </Text>
        )}
      </Button>
    </KeyboardAwareScrollView>
  );
}

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#101820FF",
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
