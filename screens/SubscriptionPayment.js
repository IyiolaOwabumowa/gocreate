import React, { useState, useEffect, useLayoutEffect } from "react";
import { StyleSheet, Dimensions, Alert } from "react-native";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Spinner, Toast } from "native-base";
import { StripeProvider } from "@stripe/stripe-react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { authActions } from "../src/actions/auth.actions";
import { subscriptionActions } from "../src/actions/subscription.actions";

const width = Dimensions.get("window").width;
const noOfPayouts = 0;
function SubscriptionPayment({ route }, props) {
  const { itemPrice, artistid, packageid } = route.params;
  const { confirmPayment } = useStripe();
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
  const mode = useSelector((state) => state.userReducer.mode);


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
    }
  };

  return (
   
      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: "4242 4242 4242 4242",
        }}
        cardStyle={{
          backgroundColor: "#FFFFFF",
          textColor: "#000000",
        }}
        style={{
          width: "100%",
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={(cardDetails) => {
          console.log("cardDetails", cardDetails);
        }}
        onFocus={(focusedField) => {
          console.log("focusField", focusedField);
        }}
      />
  );
  // return (
  //   <KeyboardAwareScrollView
  //     style={{ backgroundColor: mode == "light" ? "#d5d5d5" : "#000" }}
  //     contentContainerStyle={styles[`container${mode}`]}
  //     behavior="padding"
  //     showsVerticalScrollIndicator={false}
  //     showsHorizontalScrollIndicator={false}
  //     keyboardShouldPersistTaps="always"
  //     extraScrollHeight={50}
  //     enabled
  //     enableOnAndroid={true}
  //   >
  //     <StatusBar
  //       barStyle={mode == "light" ? "dark-content" : "light-content"}
  //     />
  //     <View
  //       style={{
  //         backgroundColor: mode == "light" ? "#fff" : "#111111",
  //         width: width - 40,
  //         height: 180,
  //         marginTop: 20,
  //         borderRadius: 5,
  //       }}
  //     >
  //       <Text
  //         style={{
  //           color: mode == "light" ? "black" : "white",
  //           fontSize: 12,
  //           marginLeft: 30,
  //           marginTop: 30,
  //         }}
  //       >
  //         Card Number
  //       </Text>
  //       <Text
  //         style={{
  //           color: mode == "light" ? "black" : "white",
  //           fontSize: 18,
  //           marginLeft: 30,
  //           marginTop: 10,
  //         }}
  //       >
  //         {cardNumber}
  //       </Text>
  //       <View
  //         style={{
  //           flex: 1,
  //           flexDirection: "row",
  //           justifyContent: "space-between",
  //         }}
  //       >
  //         <View>
  //           <Text
  //             style={{
  //               color: mode == "light" ? "black" : "white",
  //               fontSize: 12,
  //               marginLeft: 30,
  //               marginTop: 30,
  //             }}
  //           >
  //             Expiry Date
  //           </Text>
  //           <Text
  //             style={{
  //               color: mode == "light" ? "black" : "white",
  //               fontSize: 18,
  //               marginLeft: 30,
  //               marginTop: 10,
  //             }}
  //           >
  //             {cardExpiry &&
  //               cardExpiry.substr(0, 2) + "/" + (cardExpiry.substr(2) || "")}
  //           </Text>
  //         </View>

  //         <View>
  //           <Text
  //             style={{
  //               color: mode == "light" ? "black" : "white",
  //               fontSize: 12,
  //               marginRight: 30,
  //               marginTop: 30,
  //             }}
  //           >
  //             CVV
  //           </Text>
  //           <Text
  //             style={{
  //               color: mode == "light" ? "black" : "white",
  //               textAlign: "left",
  //               fontSize: 18,
  //               marginTop: 10,
  //             }}
  //           >
  //             {cvv && cvv}
  //           </Text>
  //         </View>
  //       </View>
  //     </View>

  //     <View
  //       style={{
  //         flexDirection: "row",
  //         justifyContent: "space-between",
  //         margin: 20,
  //       }}
  //     >
  //       <View
  //         style={{
  //           backgroundColor: "#00000030",
  //           height: 50,
  //           borderRadius: 5,
  //           width: "100%",
  //           justifyContent: "center",
  //         }}
  //       >
  //         <TextInput
  //           style={styles[`textInput${mode}`]}
  //           keyboardType="number-pad"
  //           placeholderTextColor="white"
  //           placeholder="Card Number"
  //           maxLength={16}
  //           value={cardNumber}
  //           onChangeText={(text) => {
  //             setcardNumber(text);
  //           }}
  //         />
  //       </View>
  //     </View>
  //     <View
  //       style={{
  //         flexDirection: "row",
  //         justifyContent: "space-between",
  //         marginLeft: 20,
  //         marginRight: 20,
  //       }}
  //     >
  //       <View
  //         style={{
  //           backgroundColor: "#00000030",
  //           height: 50,
  //           borderRadius: 5,
  //           width: "100%",
  //           justifyContent: "center",
  //         }}
  //       >
  //         <TextInput
  //           style={styles[`textInput${mode}`]}
  //           placeholderTextColor="white"
  //           placeholder="Expiry Date"
  //           keyboardType="number-pad"
  //           maxLength={4}
  //           value={cardExpiry}
  //           onChangeText={(text) => {
  //             setcardExpiry(text);
  //           }}
  //         />
  //       </View>
  //     </View>
  //     <View
  //       style={{
  //         flexDirection: "row",
  //         justifyContent: "space-between",
  //         margin: 20,
  //       }}
  //     >
  //       <View
  //         style={{
  //           backgroundColor: "#00000030",
  //           height: 50,
  //           borderRadius: 5,
  //           width: "100%",
  //           justifyContent: "center",
  //         }}
  //       >
  //         <TextInput
  //           style={styles[`textInput${mode}`]}
  //           keyboardType="number-pad"
  //           placeholderTextColor="white"
  //           placeholder="CVV"
  //           value={cvv}
  //           onChangeText={(text) => {
  //             setCvv(text);
  //           }}
  //           maxLength={3}
  //         />
  //       </View>
  //     </View>
  //     <View
  //       style={{
  //         flexDirection: "row",
  //         justifyContent: "space-between",
  //         marginLeft: 20,
  //         marginRight: 20,
  //       }}
  //     >
  //       <View
  //         style={{
  //           backgroundColor: "#00000030",
  //           height: 50,
  //           borderRadius: 5,
  //           width: "100%",
  //           justifyContent: "center",
  //         }}
  //       >
  //         <TextInput
  //           style={styles[`textInput${mode}`]}
  //           keyboardType="email-address"
  //           placeholderTextColor="white"
  //           placeholder="Email"
  //           value={email}
  //           onChangeText={(text) => {
  //             setEmail(text);
  //           }}
  //         />
  //       </View>
  //     </View>

  //     <Text
  //       style={{
  //         fontStyle: "italic",
  //         fontSize: 12,
  //         color: mode == "light" ? "black" : "white",
  //         marginTop: 20,
  //         textAlign: "center",
  //       }}
  //     >
  //       Your information is not stored or shared with anyone. {"\n"}
  //       All payments made are secured by PayStack.
  //     </Text>

  //     <View
  //       style={{
  //         flex: 1,
  //         flexDirection: "row",
  //         marginLeft: 20,
  //         marginRight: 20,
  //       }}
  //     >
  //       <TouchableOpacity
  //         activeOpacity={0.8}
  //         onPress={() => {
  //           makePayment();
  //         }}
  //         style={{
  //           flexDirection: "row",
  //           marginTop: 20,
  //           marginBottom: 30,
  //           height: 50,
  //           backgroundColor: "#32CD3275",
  //           width: "100%",
  //           borderRadius: 3,
  //           justifyContent: "center",
  //           alignItems: "center",
  //         }}
  //       >
  //         <FontAwesome5 name="money-check" size={13} color="white" />
  //         <Text
  //           style={{
  //             marginLeft: 10,

  //             fontSize: 17,
  //             color: "white",
  //           }}
  //         >
  //           Pay ‎${itemPrice}
  //         </Text>
  //       </TouchableOpacity>
  //     </View>
  //   </KeyboardAwareScrollView>
  // );
}

export default SubscriptionPayment;

const styles = StyleSheet.create({
  containerlight: {
    flexDirection: "column",
    backgroundColor: "#d5d5d5",
    alignItems: "center",
  },
  containerdark: {
    flexDirection: "column",
    backgroundColor: "#000",
    alignItems: "center",
  },
  containerNoPayouts: {
    flex: 1,
    backgroundColor: "#101820FF",
    justifyContent: "center",
    alignItems: "center",
  },
  textInputlight: {
    color: "#000",
    fontSize: 14,
    paddingLeft: 25,
  },

  textInputdark: {
    color: "#fff",
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
