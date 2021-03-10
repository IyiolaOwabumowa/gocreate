import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  TextInput,
  Platform,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import axios from "axios";
import RNPaystack from "react-native-paystack";
import { useSelector, useDispatch } from "react-redux";
import { Spinner, Toast } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Input, Item } from "native-base";
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
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { authActions } from "../src/actions/auth.actions";
import { subscriptionActions } from "../src/actions/subscription.actions";
import {
  usePaystackPayment,
  PaystackButton,
  PaystackConsumer,
} from "react-paystack";

const width = Dimensions.get("window").width;
const noOfPayouts = 0;
function SubscriptionPayment({ route }, props) {
  const { itemPrice, artistid, packageid } = route.params;

  const dispatch = useDispatch();
  const [cardNumber, setcardNumber] = useState("");
  const [cardExpiry, setcardExpiry] = useState("");
  const [email, setEmail] = useState("");
  const [cvv, setCvv] = useState("");
  const [creating, setCreating] = useState(false);
  const [paying, setPaying] = useState(false);
  const token = useSelector((state) => state.authReducer.token);
  const subscriptions = useSelector((state) =>
    state.subscriptionReducer.subscriptions
      ? state.subscriptionReducer.subscriptions
      : null
  );
  const artist_subscriptions = useSelector((state) =>
    state.subscriptionReducer.artist_subscriptions
      ? state.subscriptionReducer.artist_subscriptions
      : null
  );

  useEffect(() => {
    dispatch(subscriptionActions.getAvailableSubscriptions(token));
    dispatch(subscriptionActions.getArtistSubscriptions(token));
  }, []);

  const createPackage = (reference, artistid, packageid) => {
    setCreating(true);
    return axios
      .post(`https://web.gocreateafrica.app/api/v1/subscriptions/artist/`, {
        reference,
        artist: artistid,
        package: packageid,
      })
      .then((res) => {
        console.log(res.status);

        Alert.alert(
          "Payment Successful",
          "You can now start adding tracks to your new package",
          [
            {
              text: "Return to Distribution",
              onPress: () => {
                navigation.navigate("Subscriptions");
              },
            },
          ],
          { cancelable: false }
        );

        setCreating(false);
      })
      .catch((err) => {
        console.log(err.response.data);
        Toast.show({
          text: err.response.data,
          textStyle: {
            fontSize: 14,
            paddingLeft: 10,
          },
          duration: 4000,
          style: {
            backgroundColor: "red",
          },
          onClose: () => {
            dispatch(authActions.clearToastMessage());
          },
        });

        setCreating(false);
      });
  };

  const makePayment = () => {
    if (
      cardNumber.length == 0 ||
      cardExpiry.length == 0 ||
      cvv.length == 0 ||
      email.length == 0
    ) {
      setPaying(false);
      Toast.show({
        text: "Please recheck all fields",
        textStyle: {
          fontSize: 14,
          paddingLeft: 10,
        },
        duration: 4000,
        style: {
          backgroundColor: "red",
        },
        onClose: () => {
          dispatch(authActions.clearToastMessage());
        },
      });
    } else {
      const expiryYear = cardExpiry.substr(2, 4);
      const expiryMonth = cardExpiry.substr(0, 2);

      console.log(
        cardNumber,
        expiryMonth,
        expiryYear,
        cvv,
        email,
        itemPrice * 100
      );

      function chargeCard() {
        RNPaystack.chargeCard({
          cardNumber: `${cardNumber}`,
          expiryMonth: `${expiryMonth}`,
          expiryYear: `${expiryYear}`,
          cvc: `${cvv}`,
          email: `${email}`,
          amountInKobo: itemPrice * 100,
        })
          .then((response) => {
            console.log("successful");
            console.log(response); // card charged successfully, get reference here
            createPackage(response, artistid, packageid);
          })
          .catch((error) => {
            console.log("error ti wa o ");
            console.log(error); // error is a javascript Error object
            console.log(error.message);
            console.log(error.code);
            Toast.show({
              text: error.message,
              textStyle: {
                fontSize: 14,
                paddingLeft: 10,
              },
              duration: 4000,
              style: {
                backgroundColor: "red",
              },
              onClose: () => {},
            });
          });

        console.log("clicked");
      }
      chargeCard();
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
          width: width - 40,
          height: 180,
          marginTop: 20,
          borderRadius: 5,
        }}
      >
        <Text
          style={{
            fontFamily: "Trebuchet",
            color: "white",
            fontSize: 12,
            marginLeft: 30,
            marginTop: 30,
          }}
        >
          Card Number
        </Text>
        <Text
          style={{
            fontFamily: "Trebuchet",
            color: "white",
            fontSize: 18,
            marginLeft: 30,
            marginTop: 10,
          }}
        >
          {cardNumber}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Trebuchet",
                color: "white",
                fontSize: 12,
                marginLeft: 30,
                marginTop: 30,
              }}
            >
              Expiry Date
            </Text>
            <Text
              style={{
                fontFamily: "Trebuchet",
                color: "white",
                fontSize: 18,
                marginLeft: 30,
                marginTop: 10,
              }}
            >
              {cardExpiry &&
                cardExpiry.substr(0, 2) + "/" + (cardExpiry.substr(2) || "")}
            </Text>
          </View>

          <View>
            <Text
              style={{
                fontFamily: "Trebuchet",
                color: "white",
                fontSize: 12,
                marginRight: 30,
                marginTop: 30,
              }}
            >
              CVV
            </Text>
            <Text
              style={{
                fontFamily: "Trebuchet",
                color: "white",
                textAlign: "left",
                fontSize: 18,
                marginTop: 10,
              }}
            >
              {cvv && cvv}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#00000080",
            height: 50,
            borderRadius: 5,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <TextInput
            style={styles.textInput}
            keyboardType="number-pad"
            placeholderTextColor="white"
            placeholder="Card Number"
            maxLength={16}
            value={cardNumber}
            onChangeText={(text) => {
              setcardNumber(text);
            }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginLeft: 20,
          marginRight: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#00000080",
            height: 50,
            borderRadius: 5,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <TextInput
            style={styles.textInput}
            placeholderTextColor="white"
            placeholder="Expiry Date"
            keyboardType="number-pad"
            maxLength={4}
            value={cardExpiry}
            onChangeText={(text) => {
              setcardExpiry(text);
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
        <View
          style={{
            backgroundColor: "#00000080",
            height: 50,
            borderRadius: 5,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <TextInput
            style={styles.textInput}
            keyboardType="number-pad"
            placeholderTextColor="white"
            placeholder="CVV"
            value={cvv}
            onChangeText={(text) => {
              setCvv(text);
            }}
            maxLength={3}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginLeft: 20,
          marginRight: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#00000080",
            height: 50,
            borderRadius: 5,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <TextInput
            style={styles.textInput}
            keyboardType="email-address"
            placeholderTextColor="white"
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
          />
        </View>
      </View>

      <Text
        style={{
          fontStyle: "italic",
          fontSize: 12,
          color: "white",
          marginTop: 20,
          textAlign: "center",
        }}
      >
        Your information is not stored or shared with anyone. {"\n"}
        All payments made are secured by PayStack.
      </Text>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginLeft: 20,
          marginRight: 20,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            makePayment();
          }}
          style={{
            flexDirection: "row",
            marginTop: 20,
            marginBottom: 30,
            height: 50,
            backgroundColor: "#32CD3275",
            width: "100%",
            borderRadius: 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome5 name="money-check" size={13} color="white" />
          <Text
            style={{
              marginLeft: 10,
              fontFamily: "Trebuchet",
              fontSize: 17,
              color: "white",
            }}
          >
            Pay ‎₦{itemPrice}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

export default SubscriptionPayment;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#101820FF",
    alignItems: "center",
  },
  containerNoPayouts: {
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    height: "100%",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Trebuchet",
    fontSize: 18,
    marginTop: 30,
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
  cards: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 15,
    backgroundColor: "#010114",
    height: 300,
    width: 250,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    shadowColor: "#010114",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.55,
    shadowRadius: 10.78,

    elevation: 22,
  },
});
