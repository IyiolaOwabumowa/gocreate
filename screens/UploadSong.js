import React, { useState, useEffect, useLayoutEffect } from "react";
import { Picker } from "@react-native-community/picker";
import * as DocumentPicker from "expo-document-picker";

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
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Toast, Spinner, DatePicker } from "native-base";
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
import DropDownPicker from "react-native-dropdown-picker";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import { authActions } from "../src/actions/auth.actions";
import { songActions } from "../src/actions/song.actions";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import moment from "moment";

const width = Dimensions.get("window").width;
const songSelected = null;

function UploadSong(props) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);
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

    // console.log(albums[0].id);
    // console.log(token)
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
  // genres &&
  // genres.map((item) => {
  //   console.log({ label: item.title, value: item.title });
  //   return { label: item.title, value: item.title } + ", ";

  //   // <Picker.Item
  //   //   label={item.title}
  //   //   style={{ color: "#fff" }}
  //   //   value={item.title}
  //   //   key={item.id}
  //   // />
  // }),

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
        return response.data.id
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
          console.log(error.response.data.message);
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
    try {
      getPermissionAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setImage(result.uri);
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
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

  console.log("label", label , "artist name",
  artist_name , 
  "title",
  title , "genre ",
  genre, 
  "availability",
  access_availability , 
  "file ",
  file , "cover", 
  cover )

   if(label != "None" ||
      artist_name != "" ||
      title != "" ||
      genre != "None"  ||
      access_availability != "None" ||
      file != null||
      cover != null){

    setLoading(true);
    
    const data = new FormData();
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
    data.append("preSalesDate", "2020-10-30");
    data.append("releaseStartDate", "2020-10-30");
    data.append("releaseEndDate", "2020-10-30");
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

    console.log(data);

    return fetch(
      `https://web.gocreateafrica.app/api/v1/songs/new/${albums[0].id}/`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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
        console.log(response.status == 200);
        if (response.status == 200) {
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
          setTimeout(() => {
            props.navigation.goBack();
          }, 5000);
        }
      })
      .catch(function (error) {
        setLoading(false)
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
        throw error;
      });
    }  else{
      setLoading(false)
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
    let result = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
    
    setUpload(result.uri);

    // try {
    //   const res = await DocumentPicker.pick({
    //     type: [DocumentPicker.types.images],
    //   });
    //   console.log(
    //     res.uri,
    //     res.type, // mime type
    //     res.name,
    //     res.size
    //   );
    // } catch (err) {
    //   if (DocumentPicker.isCancel(err)) {

    //     // User cancelled the picker, exit any dialogs or menus and move on
    //   } else {
    //     throw err;
    //   }
    // }
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
        console.log(id);
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
<View style={{display:"flex", justifyContent: "center", alignItems:"center"}}>

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
      {/* <View
        style={{
          backgroundColor: "#010114",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={{ uri: image }}
          style={{
            backgroundColor: "grey",
            width: 100,
            height: 100,
            borderRadius: 5,
            marginTop: 30,
            marginBottom: 30,
          }}
        />

        <View style={{ alignItems: "center" }}>
          <Button
            onPress={choosePhotoFromLibrary}
            style={{
              paddingLeft: 10,
              paddingRight: 10,
              width: 150,
              backgroundColor: "#ffffff10",
              height: 30,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
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
              Select a cover picture
            </Text>
          </Button>

          <Button
            onPress={() => {
              
              pickAudio();
            }}
            style={{
              paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: "#00000040",
              height: 30,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
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
              Select a song to upload
            </Text>
          </Button>
        </View>
      </View>
       */}

       <View
       style={{
         flexDirection: "row",
        marginLeft:20,
        marginRight:20,

       }}
     >
       <View
         style={{
           flex: 1,
           borderBottomWidth: 1,
           borderBottomColor: "#ffffff",
         }}
       >
         <TextInput
           style={styles.textInput}
           placeholderTextColor="#ffffff"
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
           borderBottomColor: "white",
         }}
       >
         <TextInput
           style={styles.textInput}
           placeholderTextColor="#ffffff"
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
          backgroundColor: "#ffffff10",
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginLeft: 17,
          marginRight: 17,
          marginTop: 15,
          marginBottom:15
         
        }}
        onPress={() => {
          choosePhotoFromLibrary();
        }}
      >
        <Text
          style={{
            
            color: "white",
            fontFamily: "Trebuchet",
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
          backgroundColor: "#ffffff10",
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginLeft: 17,
          marginRight: 17,
          marginTop: 15,
          marginBottom:15
        }}
        onPress={() => {
          pickAudio();
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
          {upload == null
            ? "Choose Song"
            : "Song Selected, Click to change song"}
        </Text>
      </Button>

      {/* {showLabelPicker ? (
        <View style={{ marginLeft: 15, marginRight: 15 }}>
          <Picker
            selectedValue={label}
            onValueChange={(itemValue, itemIndex) => {
              setLabel(itemValue);
              if (itemValue != "None") {
                setShowLabelAdd(false);
              }
            }}
            itemStyle={{ color: "white" }}
          >
            <Picker.Item
              label={"Select a record label"}
              style={{ color: "#fff" }}
              value={"None"}
              key={0}
              color="white"
            />
            {labels &&
              labels.map((item) => {
                return (
                  <Picker.Item
                    label={item.title}
                    style={{ color: "#ff }}
                    value={item.id}
                    key={item.id}
                  />
                );
              })}
          </Picker>
          {label != null && label != "None" ? (
            <TouchableHighlight
              onPress={() => {
                setLabel("None");
                setShowLabelAdd(true);
              }}
            >
              <Text
                style={{
                  fontFamily: "Trebuchet",
                  color: "white",
                  marginLeft: 10,
                }}
              >
                Deselect
              </Text>
            </TouchableHighlight>
          ) : null}
        </View>
      ) : null}
      {showLabelAdd ? (
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
              borderBottomColor: "white",
            }}
          >
            <TextInput
              style={styles.textInput}
              placeholderTextColor="white"
              placeholder="Create another record label"
              value={labelAdd}
              onChangeText={(text) => {
                if (text == "") {
                  setLabelAdd(text);
                  setShowLabelPicker(true);
                } else {
                  setShowLabelPicker(false);
                  setLabelAdd(text);
                }
              }}
            />
          </View>
        </View>
      ) : null} */}
      {/* 
      {genres &&
        genres.map((item) => {
          console.log({ label: item.title, value: item.title });
          set
          return { label: item.title, value: item.title } + ", ";

          // <Picker.Item
          //   label={item.title}
          //   style={{ color: "#fff" }}
          //   value={item.title}
          //   key={item.id}
          // />
        })} */}
      <DropDownPicker
        items={genreDrop && genreDrop}
        placeholder="Select Genre"
        selectedLabelStyle={{ color: "white" }}
        placeholderStyle={{ color: "white" }}
        containerStyle={{ height: 80 }}
        style={{ backgroundColor: "#ffffff10", margin: 15, borderWidth: 0 }}
        itemStyle={{
          justifyContent: "flex-start",
        }}
        dropDownStyle={{ backgroundColor: "#fafafa" }}
        onChangeItem={(item) =>
          // this.setState({
          //   country: item.value,
          // })
          setGenre(item.value)
        }
      />



      <DropDownPicker
        items={avDrop && avDrop}
        placeholder="Select Availabilty Access"
        selectedLabelStyle={{ color: "white" }}
        placeholderStyle={{ color: "white" }}
        containerStyle={{ height: 80 }}
        style={{ backgroundColor: "#ffffff10", margin: 15, borderWidth: 0 }}
        itemStyle={{
          justifyContent: "flex-start",
        }}
        dropDownStyle={{ backgroundColor: "#fafafa" }}
        onChangeItem={(item) =>
          // this.setState({
          //   country: item.value,
          // })
          setAvailability(item.value)
        }
      />
      {/* <View style={{ marginLeft: 10, marginRight: 10 }}>
        <Picker
          selectedValue={genre}
          onValueChange={(itemValue, itemIndex) => {
            setGenre(itemValue);
          }}
          itemStyle={{ color: "white" }}
        >
          <Picker.Item
            label={"Select a genre"}
            style={{ color: "#fff" }}
            value={"None"}
            key={0}
            color="white"
          />
          {genres &&
            genres.map((item) => {
              return (
                <Picker.Item
                  label={item.title}
                  style={{ color: "#fff" }}
                  value={item.title}
                  key={item.id}
                />
              );
            })}
        </Picker>
      </View>
      <View style={{ marginLeft: 10, marginRight: 10 }}>
        <Picker
          selectedValue={availability}
          onValueChange={(itemValue, itemIndex) => {
            setAvailability(itemValue);
          }}
          itemStyle={{ color: "white" }}
        >
          <Picker.Item
            label={"Select availabilty"}
            style={{ color: "#fff" }}
            value={"None"}
            key={0}
            color="white"
          />
          {availabilites &&
            availabilites.map((item) => {
              return (
                <Picker.Item
                  label={item.title}
                  style={{ color: "#fff" }}
                  value={item.title}
                  key={item.id}
                />
              );
            })}
        </Picker>
      </View>
       */}

       {showLabelAdd ? <>
       <View
       style={{
         flexDirection: "row",
         marginLeft: 20,
         marginRight:20,
         marginBottom:15
       }}
     >
       <View
         style={{
           flex: 1,
           borderBottomWidth: 1,
           borderBottomColor: "white",
         }}
       >
         <TextInput
           style={styles.textInput}
           placeholderTextColor="white"
           placeholder="Create a new record label"
           value={labelAdd}
           onChangeText={(text) => {
             if (text.length > 0) {
              
              //setShowLabelPicker(false);
               setLabelAdd(text);
             }
           }}
         />
       </View>
     </View>
     </>: <>      
     
     <DropDownPicker
     items={labelDrop && labelDrop}
     placeholder="Select a record label"
     selectedLabelStyle={{ color: "white" }}
     placeholderStyle={{ color: "white" }}
     containerStyle={{ height: 80 }}
     style={{ backgroundColor: "#ffffff10", margin: 15, borderWidth: 0 }}
     itemStyle={{
       justifyContent: "flex-start",
     }}
     dropDownStyle={{ backgroundColor: "#fafafa" }}
     onChangeItem={(item) =>
       // this.setState({
       //   country: item.value,
       // })
       setLabel(item.value)
     }
   />
   
   </>}
     
     <Button
     style={{
       paddingLeˆIft: 10,
       paddingLeft: 15,
       paddingRight: 10,      
       backgroundColor: "#ffffff10",
       height: 50,
       display: "flex",
       alignItems: "center",
       justifyContent: "flex-start",
       marginLeft: 17,
       marginRight: 17,
       marginTop: 15,
       marginBottom:15
     }}
     onPress={() => {
       if(showLabelAdd){
         setLabel("None")
       }else{
         setLabelAdd("")
       }
      setShowLabelAdd(!showLabelAdd)

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
     {showLabelAdd ? "CANCEL" : 
     "Or create a new record label" }
    
     </Text>
   </Button>
      <View
        style={{
          flexDirection: "row",
          marginLeft: 20,
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ fontFamily: "Trebuchet", color: "white", fontSize: 15 }}>
          Pre-Sales Date:
        </Text>
        <View>
          <DatePicker
            defaultDate={new Date()}
            minimumDate={new Date()}
            maximumDate={new Date(2050, 12, 31)}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Select Date"
            textStyle={{ color: "white" }}
            placeHolderTextStyle={{
              color: "#fff",
              fontFamily: "Trebuchet",
              fontSize: 14,
            }}
            onDateChange={(newDate) => {
              setChosenDate1(newDate);
            }}
            disabled={false}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginLeft: 20,
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ fontFamily: "Trebuchet", color: "white", fontSize: 15 }}>
          Release Start Date:
        </Text>
        <View>
          <DatePicker
            defaultDate={new Date()}
            minimumDate={new Date()}
            maximumDate={new Date(2050, 12, 31)}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Select Date"
            textStyle={{ color: "white" }}
            placeHolderTextStyle={{
              color: "#fff",
              fontFamily: "Trebuchet",
              fontSize: 15,
            }}
            onDateChange={(newDate) => {
              setChosenDate2(newDate);
            }}
            disabled={false}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginLeft: 20,
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ fontFamily: "Trebuchet", color: "white", fontSize: 15 }}>
          Release End Date:
        </Text>
        <View>
          <DatePicker
            defaultDate={new Date()}
            minimumDate={new Date()}
            maximumDate={new Date(2050, 12, 31)}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Select Date"
            textStyle={{ color: "white" }}
            placeHolderTextStyle={{
              color: "#fff",
              fontFamily: "Trebuchet",
              fontSize: 15,
            }}
            onDateChange={(newDate) => {
              setChosenDate3(newDate);
            }}
            disabled={false}
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
        onPress={startUpload}
      >
        {loading ? (
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
            Publish Song
          </Text>
        )}
      </Button>
    </KeyboardAwareScrollView>
  );
}

export default UploadSong;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#101820FF",
  },
  textInput: {
    color: "white",
    fontFamily: "Trebuchet",
    fontSize: 16,
    marginBottom: 0,
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
