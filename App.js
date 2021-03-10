import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  AppState,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import {
  FontAwesome5,
  Ionicons,
  AntDesign,
  Fontisto,
  Octicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { navigationRef } from "./RootNavigation";
import { createStackNavigator } from "@react-navigation/stack";
import {
  NavigationContainer,
  useLinking,
  useNavigation,
} from "@react-navigation/native";
import { authActions } from "./src/actions/auth.actions";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Root, Toast, Button } from "native-base";
import Login from "./screens/Login";
import Splash from "./screens/Splash";
import SplashOptions from "./screens/SplashOptions";
import ForgotPassword from "./screens/ForgotPassword";
import MonitorUploads from "./screens/MonitorUploads";
import Dashboard from "./screens/Dashboard";
import UploadSong from "./screens/UploadSong";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./screens/Sidebar";
import CreatePassword from "./screens/CreatePassword";
import ResetPassword from "./screens/ResetPassword";
import { userActions } from "./src/actions/user.actions";
import BvnDisclaimer from "./screens/BvnDisclaimer";
import BvnVerification from "./screens/BvnVerification";
import OTP from "./screens/OTP";
import PersonalInformation from "./screens/PersonalInformation";
import { URL_SCHEMES } from "./assets/utils/constants";
import DeepLinking from "react-native-deep-linking";
import * as RootNavigation from "./RootNavigation.js";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import Royalties from "./screens/Royaties";
import Payouts from "./screens/Payouts";
import Uploads from "./screens/Uploads";
import EditProfile from "./screens/EditProfile";
import ManageRoyalties from "./screens/ManageRoyalties";
import AddTrack from "./screens/AddTrack";
import AddRoyalty from "./screens/AddRoyalty";
import Subscriptions from "./screens/Subscriptions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { YellowBox } from "react-native";
import SubscriptionPayment from "./screens/SubscriptionPayment";
import Label from "./screens/Label";
import UploadButton from "./screens/UploadButton";
// import RNPaystack from 'react-native-paystack';

const Drawer = createDrawerNavigator();

const App = () => {
  const token = useSelector((state) => state.authReducer.token);
  const isPassword = useSelector((state) => state.authReducer.isPassword);
  const [initialised, setInitialised] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const dispatch = useDispatch();
  const Stack = createStackNavigator();
  const ref = React.useRef();


  // add URL schemes to `DeepLinking`
  for (let scheme of URL_SCHEMES) {
    DeepLinking.addScheme(scheme);
  }

  const readUrl = async () => {
    const initial = await Linking.getInitialURL();
    //setInitialised(false)
    if (initial !== null) {
      setInitialised(true);
      DeepLinking.evaluateUrl(initial);
      // configure a route, in this case, a simple Settings route
      // DeepLinking.addRoute("/accounts/verify", (response) => {
      //   // navigation.navigate("CreatePassword");
      // });
      DeepLinking.addRoute("/accounts/verify", (response) => {
        if (isPassword == false) {
          RootNavigation.navigate("CreatePassword");
        }
      });
    }
  };
  readUrl();

  useEffect(() => {
    console.disableYellowBox = true;

    YellowBox.ignoreWarnings(["Animated: `useNativeDriver`"]);

    dispatch(authActions.getUserToken());

    // const checkInitialUrl = async () => {
    //   if ((await Linking.getInitialURL()) !== null) {
    //     AppState.removeEventListener("change", handleAppStateChange);
    //   }
    // };

    // checkInitialUrl();

    const splashScreen = async () => {
      return new Promise((resolve) =>
        setTimeout(() => {
          setIsScreenLoading(false);
        }, 4000)
      );
    };

    const fontLoader = async () => {
      await Font.loadAsync({
        Trebuchet: require("./assets/fonts/Trebuchet.ttf"),
      });
      setFontLoaded(true);
    };

    fontLoader();
    splashScreen();

    return () => {};
  }, []);

  if (fontLoaded == false || isScreenLoading == true) {
    return <Splash />;
  }

  const handleSubmit = () => {
    dispatch(authActions.deleteUserToken());
  };

  const uploadButton = () => {

      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("UploadSong");
          }}
          style={{ paddingLeft: 20, paddingRight: 20 }}
        >
          <Ionicons name="ios-add" size={30} color="white" />
        </TouchableOpacity>
      );
 
  };

  const Root = ({ navigation }) => {
    const Stack = createStackNavigator();

    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            headerTitle: `Dashboard`,

            headerStyle: {
              backgroundColor: "#010114",
              shadowColor: "#181818",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: "#1A5C79",
            },
            headerLeft: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.openDrawer();
                  }}
                  style={{ paddingLeft: 20 }}
                >
                  <FontAwesome5 name={"bars"} size={20} color="white" />
                </TouchableOpacity>
              );
            },
          }}
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerTitle: `Profile`,

            headerStyle: {
              backgroundColor: "#010114",
              shadowColor: "transparent",
              borderBottomWidth: 0,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },
          }}
        />
        <Stack.Screen
          name="OTP"
          component={OTP}
          options={{
            headerTitle: `Enter Your OTP`,

            headerStyle: {
              backgroundColor: "#010114",
              shadowColor: "transparent",
              borderBottomWidth: 0,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },
          }}
        />
      </Stack.Navigator>
    );
  };
  const RoyaltiesScreen = ({ route, navigation }) => {
    const RoyaltiesStack = createStackNavigator();

    return (
      <RoyaltiesStack.Navigator>
        <RoyaltiesStack.Screen
          name="Royalties"
          component={Royalties}
          options={{
            headerTitle: `Royalties`,

            headerStyle: {
              backgroundColor: "#010114",
              shadowColor: "#181818",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: "#1A5C79",
            },
            headerLeft: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.openDrawer();
                  }}
                  style={{ paddingLeft: 20 }}
                >
                  <FontAwesome5 name={"bars"} size={20} color="white" />
                </TouchableOpacity>
              );
            },
            headerRight: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("AddRoyalty");
                  }}
                  style={{ paddingLeft: 20, paddingRight: 20 }}
                >
                  <Ionicons name="ios-add" size={30} color="white" />
                </TouchableOpacity>
              );
            },
          }}
        />
        <RoyaltiesStack.Screen
          name="ManageRoyalties"
          component={ManageRoyalties}
          options={{
            headerTitle: `Manage Royalties`,

            headerStyle: {
              backgroundColor: "#010114",
              shadowColor: "#181818",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: "#fff",
            },
          }}
        />
        <RoyaltiesStack.Screen
          name="AddRoyalty"
          component={AddRoyalty}
          options={{
            headerTitle: `Add a Royalty`,

            headerStyle: {
              backgroundColor: "#010114",
              shadowColor: "#181818",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: "#fff",
            },
          }}
        />
      </RoyaltiesStack.Navigator>
    );
  };

  const PayoutScreen = ({ navigation }) => {
    const PayoutStack = createStackNavigator();

    return (
      <PayoutStack.Navigator>
        <PayoutStack.Screen
          name="Payouts"
          component={Payouts}
          options={{
            headerTitle: `Payouts`,

            headerStyle: {
              backgroundColor: "#010114",
              shadowColor: "#18181800",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: "#1A5C79",
            },
            headerLeft: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.openDrawer();
                  }}
                  style={{ paddingLeft: 20 }}
                >
                  <FontAwesome5 name={"bars"} size={20} color="white" />
                </TouchableOpacity>
              );
            },
          }}
        />

        <Stack.Screen
          name="BvnDisclaimer"
          component={BvnDisclaimer}
          options={{
            headerTitle: `Disclaimer`,
            headerStyle: {
              backgroundColor: "#010114",
              shadowColor: "#181818",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },
          }}
        />
        <Stack.Screen
          name="BvnVerification"
          component={BvnVerification}
          options={{
            headerTitle: `Verify Your BVN`,
            headerStyle: {
              backgroundColor: "#010114",
              shadowColor: "#181818",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },
          }}
        />
      </PayoutStack.Navigator>
    );
  };

  const SubscriptionsScreen = ({ navigation }) => {
    const SubscriptionsStack = createStackNavigator();

    return (
      <SubscriptionsStack.Navigator>
        <SubscriptionsStack.Screen
          name="Subscriptions"
          component={Subscriptions}
          options={{
            headerTitle: `Distribution`,

            headerStyle: {
              backgroundColor: "#010114",
              shadowColor: "#181818",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: "#1A5C79",
            },
            headerLeft: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.openDrawer();
                  }}
                  style={{ paddingLeft: 20 }}
                >
                  <FontAwesome5 name={"bars"} size={20} color="white" />
                </TouchableOpacity>
              );
            },
          }}
        />
        <SubscriptionsStack.Screen
          name="SubscriptionPayment"
          component={SubscriptionPayment}
          options={{
            headerTitle: `Distribution Payment`,

            headerStyle: {
              backgroundColor: "#010114",
              shadowColor: "#181818",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: "#FFF",
            },
          }}
        />
        <SubscriptionsStack.Screen
          name="AddTrack"
          component={AddTrack}
          options={{
            headerTitle: `Add Track`,

            headerStyle: {
              backgroundColor: "#010114",
              shadowColor: "transparent",
              borderBottomWidth: 0,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: "#fff",
              fontSize: 15,
              fontFamily: "Trebuchet",
            },
          }}
        />
      </SubscriptionsStack.Navigator>
    );
  };

  const UploadsScreen = ({ navigation }) => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Uploads"
          component={Uploads}
          options={{
            headerTitle: `Uploads`,

            headerStyle: {
              backgroundColor: "#010114",
              shadowColor: "#181818",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: "#1A5C79",
            },
            headerLeft: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.openDrawer();
                  }}
                  style={{ paddingLeft: 20 }}
                >
                  <FontAwesome5 name={"bars"} size={20} color="white" />
                </TouchableOpacity>
              );
            },

            headerRight: () => {
             return <UploadButton navigation= {navigation} />
            },
          }}
        />
        <Stack.Screen
          name="Label"
          component={Label}
          options={{
            headerTitle: `Choose a Label`,

            headerStyle: {
              backgroundColor: "#010114",
              shadowColor: "transparent",
              borderBottomWidth: 0,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },

            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: "#fff",
              fontSize: 15,
              fontFamily: "Trebuchet",
            },
          }}
        />
        <Stack.Screen
          name="UploadSong"
          component={UploadSong}
          options={{
            headerTitle: `Publish Song`,

            headerStyle: {
              backgroundColor: "#010114",
              shadowColor: "transparent",
              borderBottomWidth: 0,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: "#fff",
              fontFamily: "Trebuchet",
            },

            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: "#fff",
              fontSize: 15,
              fontFamily: "Trebuchet",
            },
          }}
        />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer ref={navigationRef}>
      {token == undefined || token == null ? (
        <Stack.Navigator>
          <>
            <Stack.Screen
              name="SplashOptions"
              component={SplashOptions}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerTitle: "Login to your account",

                headerStyle: {
                  backgroundColor: "#101820FF",
                  shadowColor: "#181818",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontSize: 15,
                  color: "#fff",

                  fontFamily: "Trebuchet",
                },
                headerBackTitle: "Back",
                headerBackTitleStyle: {
                  color: "#fff",
                },
                headerTintColor: "#fff",
              }}
            />
            <Stack.Screen
              name="CreatePassword"
              component={CreatePassword}
              options={{
                headerShown: false,
                headerTitle: "Create Your Password",

                headerStyle: {
                  backgroundColor: "#fff",
                  shadowColor: "#181818",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontSize: 15,
                  color: "#1A5C79",

                  fontFamily: "Trebuchet",
                },
                headerBackTitle: "Back",
                headerBackTitleStyle: {
                  color: "#1A5C79",
                },
                headerTintColor: "#1A5C79",
              }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPassword}
              options={{
                headerTitle: "Forgot Password",
                headerStyle: {
                  backgroundColor: "#101820FF",
                  shadowColor: "#181818",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontSize: 15,
                  color: "#fff",

                  fontFamily: "Trebuchet",
                },
                headerBackTitle: "Back",
                headerBackTitleStyle: {
                  color: "#fff",
                },
                headerTintColor: "#fff",
              }}
            />
            <Stack.Screen
              name="PersonalInfo"
              component={PersonalInformation}
              options={{
                headerTitle: "Personal Information",
               
                headerStyle: {
                  backgroundColor: "#101820FF",
                  shadowColor: "#181818",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontSize: 15,
                  color: "#fff",

                  fontFamily: "Trebuchet",
                },
                headerBackTitle: "Back",
                headerBackTitleStyle: {
                  color: "#fff",
                },
                headerTintColor: "#fff",
              }}
            />
          

          </>
        </Stack.Navigator>
      ) : (
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          drawerContentOptions={{
            activeTintColor: "#9DC828",
            inactiveTintColor: "#ffffff",
          }}
          drawerStyle={{
            backgroundColor: "#010114",
          }}
        >
          <Drawer.Screen
            name="Dashboard"
            component={Root}
            options={{
              drawerIcon: ({ focused, size }) => (
                <SimpleLineIcons name={"graph"} size={20} color="white" />
              ),
            }}
          />

          <Drawer.Screen
            name="Uploads"
            component={UploadsScreen}
            options={{
              drawerIcon: ({ focused, size }) => (
                <AntDesign name={"upload"} size={20} color="white" />
              ),
            }}
          />

          <Drawer.Screen
            name="Royalties"
            component={RoyaltiesScreen}
            options={{
              drawerIcon: ({ focused, size }) => (
                <FontAwesome5 name={"signature"} size={20} color="white" />
              ),
            }}
          />
          <Drawer.Screen
            name="Payouts"
            component={PayoutScreen}
            options={{
              drawerIcon: ({ focused, size }) => (
                <FontAwesome5 name={"money-check"} size={20} color="white" />
              ),
            }}
          />

          <Drawer.Screen
            name="Distribution"
            component={SubscriptionsScreen}
            options={{
              drawerIcon: ({ focused, size }) => (
                <MaterialCommunityIcons
                  name="contactless-payment"
                  size={20}
                  color="white"
                />
              ),
            }}
          />

          {/* <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerIcon: ({ focused, size }) => (
              <FontAwesome5 name={"money-check"} size={20} color="white" />
            ),
          }}
        /> */}
        </Drawer.Navigator>
      )}
    </NavigationContainer>
  );

  function CustomDrawerContent(props) {
    const [loader, setloader] = useState(false);
    const artist = useSelector((state) =>
      state.userReducer.artist ? state.userReducer.artist : null
    );
    const dp = artist ? artist.dp : null;
    const dpImage = dp ? dp.image : null;

    return (
      <>
        <DrawerContentScrollView {...props}>
          <View
            style={{
              backgroundColor: "#ffffff05",
              width: "92%",
              height: 100,
              marginLeft: 10,
              marginRight: 10,
              borderRadius: 10,
              marginTop: 40,
              marginBottom: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* {loader ? (
                <View style={styles.loading}>
                  <ActivityIndicator />
                </View>
              ) : null} */}

              {dpImage != null ? (
                <View>
                  <Image
                    source={{ uri: dpImage }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 50,
                      marginRight: 20,
                    }}
                    onLoadStart={() => {
                      setloader(true);
                    }}
                    onLoadEnd={() => {
                      setloader(false);
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: "grey",
                    width: 60,
                    height: 60,
                    borderRadius: 50,
                  }}
                ></View>
              )}
              <View>
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Trebuchet",
                    marginBottom: 15,
                    fontSize: 15,
                    textAlign: "center",
                  }}
                >
                  {artist && artist.first_name} {artist && artist.last_name}
                </Text>
                <Button
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    width: 150,
                    backgroundColor: "#ffffff05",
                    height: 30,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    props.navigation.navigate("Dashboard", {
                      screen: "EditProfile",
                      params: { imageUrl: dpImage },
                    });
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
                    Edit Profile
                  </Text>
                </Button>
              </View>
            </View>
          </View>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
        <View style={{ position: "absolute", bottom: 0 }}>
          <DrawerItem
            icon={() => {
              return <AntDesign name={"logout"} size={20} color="white" />;
            }}
            label="Signout of GoCreate"
            inactiveTintColor="white"
            onPress={() => dispatch(authActions.deleteUserToken())}
          />
        </View>
      </>
    );
  }
};

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <Root>
        <App />
      </Root>
    </Provider>
  );
};

export default AppWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
});
