import React, { useState, useEffect, useLayoutEffect } from "react";
import { Picker } from "@react-native-community/picker";
import DocumentPicker from "react-native-document-picker";
import {
  launchCamera,
  launchImageLibrary,
  ImagePicker,
} from "react-native-image-picker";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  Alert,
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Toast, Spinner } from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Item } from "native-base";
import DropDownPicker from "react-native-dropdown-picker";
import {
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { authActions } from "../src/actions/auth.actions";
import { songActions } from "../src/actions/song.actions";
import axios from "axios";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import moment from "moment";
import { userActions } from "../src/actions/user.actions";

const width = Dimensions.get("window").width;
const songSelected = null;

function UploadSong(props) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);
  const mode = useSelector((state) => state.userReducer.mode);
  const [label, setLabel] = useState("None");
  const [labels, setLabels] = useState(null);
  const [image, setImage] = useState(null);
  const [genres, setGenres] = useState(null);
  const [genreDrop, setGenreDrop] = useState([]);
  const [labelDrop, setlabelDrop] = useState([]);
  const [avDrop, setavDrop] = useState([]);
  const [genre, setGenre] = useState("None");
  const [availabilites, setAvailabilites] = useState(null);
  const [availability, setAvailability] = useState("None");
  const [albums, setAlbums] = useState(null);
  const [chosenDate1, setChosenDate1] = useState(new Date());
  const [chosenDate2, setChosenDate2] = useState(new Date());
  const [chosenDate3, setChosenDate3] = useState(new Date());
  const [artistName, setArtistName] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [labelAdd, setLabelAdd] = useState("");
  const [upload, setUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(true);
  const [showLabelAdd, setShowLabelAdd] = useState(false);
  const [createdLabelId, setCreatedLabelId] = useState(null);
  const [date1, setDate1] = useState(new Date(1598051730000));
  const [date2, setDate2] = useState(new Date(1598051730000));
  const [date3, setDate3] = useState(new Date(1598051730000));
  const [show, setShow] = useState(false);

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
    getLabels();
    generateLabelDrop();
  }, [JSON.stringify(labels)]);

  useEffect(() => {
    getGenres();
    generateGenreDrop();
  }, [JSON.stringify(genres)]);

  useEffect(() => {
    getSongsAvailabilities();
    generateAVDrop();
  }, [JSON.stringify(availabilites)]);

  useEffect(() => {
    getAlbums();
  }, [JSON.stringify(albums)]);

  const generateGenreDrop = () => {
    if (genres) {
      for (var i = 0; i < genres.length; i++) {
        genreDrop.push({ label: genres[i].title, value: genres[i].title });
      }
    }
  };

  const generateLabelDrop = () => {
    if (labels) {
      for (var i = 0; i < labels.length; i++) {
        labelDrop.push({ label: labels[i].title, value: labels[i].id });
      }
    }
  };

  const generateAVDrop = () => {
    if (availabilites) {
      for (var i = 0; i < availabilites.length; i++) {
        avDrop.push({
          label: availabilites[i].title,
          value: availabilites[i].title,
        });
      }
    }
  };

  const getLabels = () => {
    return axios
      .get(`https://web.gocreateafrica.app/api/v1/songs/labels/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status == 200) {
          const successObject = {
            status: response.status,
            data: response.data,
          };
          setLabels(successObject.data.results);
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

          return errorObject;
        }
      });
  };

  const getGenres = () => {
    return axios
      .get(`https://web.gocreateafrica.app/api/v1/songs/genres/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status == 200) {
          const successObject = {
            status: response.status,
            data: response.data,
          };
          setGenres(successObject.data.results);
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

          return errorObject;
        }
      });
  };

  const getSongsAvailabilities = () => {
    return axios
      .get(`https://web.gocreateafrica.app/api/v1/songs/access/available/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status == 200) {
          const successObject = {
            status: response.status,
            data: response.data,
          };
          setAvailabilites(successObject.data.results);
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

          return errorObject;
        }
      });
  };

  const getAlbums = () => {
    return axios
      .get(`https://web.gocreateafrica.app/api/v1/songs/albums/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status == 200) {
          // console.log(response.data)
          const successObject = {
            status: response.status,
            data: response.data,
          };
          setAlbums(successObject.data.results);
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

          return errorObject;
        }
      });
  };

  const addLabel = (title) => {
    return axios
      .post(
        "https://web.gocreateafrica.app/api/v1/songs/labels/",
        {
          title,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // const successObject = { status: response.status, data: response.data };

        // Alert.alert(
        //   "Label Created Successfully",
        //   "You can now upload a song under this record label",
        //   [
        //     {
        //       text: "Continue",
        //       style: "cancel",
        //     },
        //   ]
        // );
        setCreatedLabelId(response.data.id);
        return response.data.id;
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          const values = Object.values(error.response.data);
          const errorObject = {
            status: error.response.status,
            error: values[0],
          };
          // for (const value of values) {
          //   console.log(value[0])
          // }
          //console.log(error.response.data.message);
          return errorObject;
        }
      });
  };

  const getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
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

      setImage(response.assets[0].uri);
    });
  };

  const uploadSong = (
    label,
    artist_name,
    title,
    genre,
    access_availability,
    preSalesDate,
    releaseStartDate,
    releaseEndDate,
    file,
    cover
  ) => {
    const removeTime = (fulldate) => {
      let d = new Date(fulldate);
      d = d.toISOString().split("T")[0];
      return d;
    };

    // console.log(
    //   "label",
    //   label,
    //   "artist name",
    //   artist_name,
    //   "title",
    //   title,
    //   "genre ",
    //   genre,
    //   "availability",
    //   access_availability,
    //   "file ",
    //   file,
    //   "cover",
    //   cover
    // );

    if (
      label != "None" ||
      artist_name != "" ||
      title != "" ||
      genre != "None" ||
      access_availability != "None" ||
      file != null ||
      cover != null
    ) {
      setLoading(true);

      const data = new FormData();
      const validateSong = new FormData();
      let uriParts = cover.split(".");
      let fileType = uriParts[uriParts.length - 1];
      let musicUriParts = file.split(".");
      let musicFileType = musicUriParts[musicUriParts.length - 1];

      data.append("label", label);
      data.append("artist_name", artist_name);
      data.append("title", title);
      data.append("description", title);
      data.append("genres", genre);
      data.append("access_availability", access_availability);
      data.append("preSalesDate", chosenDate1);
      data.append("releaseStartDate", chosenDate2);
      data.append("releaseEndDate", chosenDate3);
      data.append("file", {
        uri: file,
        name: `recording.${musicFileType}`,
        type: `audio/${musicFileType}`,
      });
      data.append("cover", {
        uri: cover,
        type: `image/${fileType}`,
        name: `image.${fileType}`,
      });
      validateSong.append("audio", {
        uri: file,
        name: `recording.${musicFileType}`,
        type: `audio/${musicFileType}`,
      });
      // console.log(data);

      fetch("https://web.gocreateafrica.app/api/v1/songs/validate/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: validateSong,
      })
        .then((response) => {
          // console.log(response);
          if (response.ok == true) {
            fetch(
              `https://web.gocreateafrica.app/api/v1/songs/new/${albums[0].id}/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                method: "POST",
                body: data,
              }
            )
              .then((response) => {
                setLoading(false);
                // const successObject = { status: response.status, data: response.data };
                // Alert.alert(response);
                // console.log(response.status == 200);
                if (response.status == 200) {
                  dispatch(songActions.getSongs(token));
                  dispatch(userActions.getArtist(token));
                  props.navigation.goBack();
                  Toast.show({
                    text: "We've uploaded your song successfully",
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
                  setTimeout(() => {}, 4000);
                }
              })
              .catch(function (error) {
                setLoading(false);
                Alert.alert(error.message);
                // console.log("There has been a problem with your song upload");
                throw error;
              });
          } else {
            console.log(response)
            setLoading(false);
            Alert.alert(
              "Duplicate Song",
              "You have uploaded this song before, try again with another song."
            );
          }
        })
        .catch(function (error) {
          setLoading(false);
          // console.log(error.message);
        });
    } else {
      setLoading(false);
      Toast.show({
        text: "Please check all fields and try again",
        textStyle: {
          fontSize: 14,
          paddingLeft: 10,
        },
        duration: 5000,
        style: {
          backgroundColor: "red",
        },
        onClose: () => {},
      });
    }
  };

  const pickAudio = async () => {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });
      // console.log(
      //   res.uri,
      //   res.type, // mime type
      //   res.name,
      //   res.size
      // );
      setUpload(res.uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const startUpload = async () => {
    if (label != "None") {
      uploadSong(
        label,
        artistName,
        songTitle,
        genre,
        availability,
        chosenDate1,
        chosenDate2,
        chosenDate3,
        upload,
        image
      );
    } else {
      await addLabel(labelAdd).then((id) => {
        // console.log(id);
        uploadSong(
          typeof id === "object" ? "None" : id,
          artistName,
          songTitle,
          genre,
          availability,
          chosenDate1,
          chosenDate2,
          chosenDate3,
          upload,
          image
        );
      });
    }
  };

  const onChangePresale = (event, selectedDate, testID) => {
    const currentDate = selectedDate || date;
    setDate1(currentDate);
    setChosenDate1(formatDate(selectedDate));
  };

  const onChangeStartDate = (event, selectedDate, testID) => {
    const currentDate = selectedDate || date;
    setDate2(currentDate);
    setChosenDate2(formatDate(selectedDate));
  };

  const onChangeEndDate = (event, selectedDate, testID) => {
    const currentDate = selectedDate || date;
    setDate3(currentDate);
    setChosenDate3(formatDate(selectedDate));
  };

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: mode == "light" ? "#fff" : "#000" }}
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {image != null ? (
          <Image
            source={{ uri: image }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 5,
              marginTop: 30,
              marginBottom: 30,
            }}
          />
        ) : (
          <View
            style={{
              backgroundColor: "grey",
              width: 100,
              height: 100,
              borderRadius: 5,
              marginTop: 30,
              marginBottom: 30,
            }}
          ></View>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          marginLeft: 20,
          marginRight: 20,
        }}
      >
        <View
          style={{
            flex: 1,
            borderBottomWidth: 1,
            borderBottomColor: mode == "light" ? "black" : "white",
          }}
        >
          <TextInput
            style={styles[`textInput${mode}`]}
            placeholderTextColor={mode == "light" ? "black" : "white"}
            placeholder="Artist Name"
            value={artistName}
            onChangeText={(text) => {
              setArtistName(text);
            }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          margin: 20,
        }}
      >
        <View
          style={{
            flex: 1,
            borderBottomWidth: 1,
            borderBottomColor: mode == "light" ? "black" : "white",
          }}
        >
          <TextInput
            style={styles[`textInput${mode}`]}
            placeholderTextColor={mode == "light" ? "black" : "white"}
            placeholder="Song Title"
            value={songTitle}
            onChangeText={(text) => {
              setSongTitle(text);
            }}
          />
        </View>
      </View>

      <Button
        style={{
          paddingLeft: 10,
          paddingLeft: 15,
          paddingRight: 10,
          backgroundColor: mode == "light" ? "#00000010" : "#ffffff10",
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginLeft: 17,
          marginRight: 17,
          marginTop: 15,
          marginBottom: 15,
          width: "92%",
        }}
        onPress={() => {
          choosePhotoFromLibrary();
        }}
      >
        <Text
          style={{
            color: mode == "light" ? "black" : "white",

            fontSize: 13,
          }}
        >
          {image == null
            ? "Upload Cover Picture"
            : "Cover Uploaded, Click to change cover"}
        </Text>
      </Button>
      <Button
        style={{
          paddingLeft: 10,
          paddingLeft: 15,
          paddingRight: 10,
          backgroundColor: mode == "light" ? "#00000010" : "#ffffff10",
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginLeft: 17,
          marginRight: 17,
          marginTop: 15,
          marginBottom: 15,
          width: "92%",
        }}
        onPress={() => {
          pickAudio();
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: mode == "light" ? "black" : "white",

            fontSize: 13,
          }}
        >
          {upload == null
            ? "Choose Song"
            : "Song Selected, Click to change song"}
        </Text>
      </Button>

      <DropDownPicker
        items={genreDrop && genreDrop}
        zIndex={5000}
        placeholder="Select Genre"
        selectedLabelStyle={{ color: mode == "light" ? "black" : "white" }}
        placeholderStyle={{ color: mode == "light" ? "black" : "white" }}
        containerStyle={{ height: 80 }}
        style={{
          backgroundColor: mode == "light" ? "#00000010" : "#ffffff10",
          margin: 15,
          borderWidth: 0,
        }}
        itemStyle={{
          justifyContent: "flex-start",
        }}
        dropDownStyle={{ backgroundColor: "#fafafa" }}
        onChangeItem={(item) => setGenre(item.value)}
      />

      <DropDownPicker
        items={avDrop && avDrop}
        zIndex={4000}
        placeholder="Select Availabilty Access"
        selectedLabelStyle={{ color: mode == "light" ? "black" : "white" }}
        placeholderStyle={{ color: mode == "light" ? "black" : "white" }}
        containerStyle={{ height: 80 }}
        style={{
          backgroundColor: mode == "light" ? "#00000010" : "#ffffff10",
          margin: 15,
          borderWidth: 0,
        }}
        itemStyle={{
          justifyContent: "flex-start",
        }}
        dropDownStyle={{ backgroundColor: "#fafafa" }}
        onChangeItem={(item) => setAvailability(item.value)}
      />

      {showLabelAdd ? (
        <>
          <View
            style={{
              flexDirection: "row",
              marginLeft: 20,
              marginRight: 20,
              marginBottom: 15,
            }}
          >
            <View
              style={{
                flex: 1,
                borderBottomWidth: 1,
                borderBottomColor: mode == "light" ? "black" : "white",
              }}
            >
              <TextInput
                style={styles.textInput}
                placeholderTextColor={mode == "light" ? "black" : "white"}
                placeholder="Create a new record label"
                value={labelAdd}
                onChangeText={(text) => {
                  if (text.length > 0) {
                    setLabelAdd(text);
                  }
                }}
              />
            </View>
          </View>
        </>
      ) : (
        <>
          <DropDownPicker
            zIndex={3000}
            items={labelDrop && labelDrop}
            placeholder="Select a record label"
            selectedLabelStyle={{ color: mode == "light" ? "black" : "white" }}
            placeholderStyle={{ color: mode == "light" ? "black" : "white" }}
            containerStyle={{ height: 80 }}
            style={{
              backgroundColor: mode == "light" ? "#00000010" : "#ffffff10",
              margin: 15,
              borderWidth: 0,
            }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            onChangeItem={(item) => setLabel(item.value)}
          />
        </>
      )}

      <Button
        style={{
          paddingLeˆIft: 10,
          paddingLeft: 15,
          paddingRight: 10,
          backgroundColor: mode == "light" ? "#00000010" : "#ffffff10",
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginLeft: 17,
          marginRight: 17,
          marginTop: 15,
          marginBottom: 15,
        }}
        onPress={() => {
          if (showLabelAdd) {
            setLabel("None");
          } else {
            setLabelAdd("");
          }
          setShowLabelAdd(!showLabelAdd);
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: mode == "light" ? "black" : "white",

            fontSize: 13,
          }}
        >
          {showLabelAdd ? "CANCEL" : "Or create a new record label"}
        </Text>
      </Button>
      <View style={{ marginLeft: 20, marginTop: 20 }}>
        <Text
          style={{ color: mode == "light" ? "black" : "white", fontSize: 15 }}
        >
          Choose a Pre-Sales Date:
        </Text>

        <DateTimePicker
          value={date1}
          mode={"date"}
          is24Hour={true}
          display="compact"
          onChange={onChangePresale}
          themeVariant={mode}
        />
      </View>
      <View
        style={{
          marginLeft: 20,
          marginTop: 20,
        }}
      >
        <Text
          style={{ color: mode == "light" ? "black" : "white", fontSize: 15 }}
        >
          Release Start Date:
        </Text>
        <View>
          <DateTimePicker
            value={date2}
            mode={"date"}
            is24Hour={true}
            display="compact"
            onChange={onChangeStartDate}
            themeVariant={mode}
          />
          {/* <DatePicker
            defaultDate={new Date()}
            minimumDate={new Date()}
            maximumDate={new Date(2050, 12, 31)}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Select Date"
            textStyle={{ color: mode == "light" ? "black" : "white" }}
            placeHolderTextStyle={{
              color: mode == "light" ? "black" : "white",

              fontSize: 15,
            }}
            onDateChange={(newDate) => {
              setChosenDate2(newDate);
            }}
            disabled={false}
          /> */}
        </View>
      </View>

      <View
        style={{
          marginLeft: 20,
          marginTop: 20,
        }}
      >
        <Text
          style={{ color: mode == "light" ? "black" : "white", fontSize: 15 }}
        >
          Release End Date:
        </Text>
        <View>
          <DateTimePicker
            value={date3}
            mode={"date"}
            is24Hour={true}
            display="compact"
            onChange={onChangeEndDate}
            themeVariant={mode}
          />
          {/* <DatePicker
            defaultDate={new Date()}
            minimumDate={new Date()}
            maximumDate={new Date(2050, 12, 31)}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Select Date"
            textStyle={{ color: mode == "light" ? "black" : "white" }}
            placeHolderTextStyle={{
              color: mode == "light" ? "black" : "white",

              fontSize: 15,
            }}
            onDateChange={(newDate) => {
              setChosenDate3(newDate);
            }}
            disabled={false}
          /> */}
        </View>
      </View>

      <Button
        disabled={loading}
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          width: width - 40,
          backgroundColor: mode == "light" ? "#00000010" : "#ffffff10",
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          margin: 20,
          marginBottom: 100,
        }}
        onPress={startUpload}
      >
        {loading ? (
          <Spinner color={mode == "light" ? "#000" : "#fff"} size="small" />
        ) : (
          <Text
            style={{
              textAlign: "center",
              color: mode == "light" ? "black" : "white",

              fontSize: 13,
            }}
          >
            Upload Song
          </Text>
        )}
      </Button>
    </KeyboardAwareScrollView>
  );
}

export default UploadSong;

const styles = StyleSheet.create({
  containerlight: {
    backgroundColor: "#fff",
  },
  containerdark: {
    backgroundColor: "#000",
  },
  textInputdark: {
    color: "white",

    fontSize: 16,
    marginBottom: 15,
  },
  textInputlight: {
    color: "black",

    fontSize: 16,
    marginBottom: 15,
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
