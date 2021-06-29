import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store";
import React, { useEffect, useState } from "react";
import FastImage from "react-native-fast-image";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Switch,
  Linking,
  AppState,
  ActivityIndicator,
  useColorScheme,
  Platform,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";

import { navigationRef } from "./RootNavigation";
import { createStackNavigator } from "@react-navigation/stack";
import {
  NavigationContainer,
  useLinking,
  useNavigation,
} from "@react-navigation/native";
import { authActions } from "./src/actions/auth.actions";
import {
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Root, Toast, Button } from "native-base";
import Login from "./screens/Login";
import Splash from "./screens/Splash";
import SplashOptions from "./screens/SplashOptions";
import ForgotPassword from "./screens/ForgotPassword";
import MonitorUploads from "./screens/MonitorUploads";
import Dashboard from "./screens/Dashboard";
import UploadSong from "./screens/UploadSong";
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
import SplashScreen from "react-native-splash-screen";
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
import { LogBox } from "react-native";
import SubscriptionPayment from "./screens/SubscriptionPayment";
import Label from "./screens/Label";
import UploadButton from "./screens/UploadButton";
import { StripeProvider } from "@stripe/stripe-react-native";

const Drawer = createDrawerNavigator();

const App = () => {
  const [publishableKey, setPublishableKey] = useState(
    "pk_test_51IjjhCKVJpjSXxYpL4pJsJCfwbvrBhEekm0n2ACycWcbTPMdJhRwrVOtmk07DMyd0Brpck5IHJqkp271RH8JYvJg00wg1vKuJG"
  );
  const token = useSelector((state) => state.authReducer.token);
  const mode = useSelector((state) => state.userReducer.mode);
  const isPassword = useSelector((state) => state.authReducer.isPassword);
  const authorized = useSelector((state) => state.userReducer.authorized);
  const [initialised, setInitialised] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const artist = useSelector((state) => state.userReducer.artist);

  const loading = useSelector((state) => state.userReducer.loading);

  const dispatch = useDispatch();
  const Stack = createStackNavigator();
  const ref = React.useRef();
  const colorScheme = useColorScheme();

  const toggleSwitch = () => {
    if (mode === "dark") {
      dispatch(userActions.setAppearance("light"));
    } else {
      dispatch(userActions.setAppearance("dark"));
    }
  };

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 5000);
  }, []);

  useEffect(() => {
    if (colorScheme === "dark") {
      dispatch(userActions.setAppearance("dark"));
    } else {
      dispatch(userActions.setAppearance("light"));
    }
  }, [colorScheme]);

  useEffect(() => {
    dispatch(authActions.getUserToken());

    return () => {};
  }, []);

  useEffect(() => {
    if (token != null) {
      dispatch(userActions.getArtist(token));
    }
  }, [token]);

  useEffect(() => {
    if (authorized == false) {
      dispatch(authActions.deleteUserToken());
    }
  }, [authorized]);

  const Root = ({ navigation }) => {
    const Stack = createStackNavigator();

    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            headerTitle: `Hi ${
              artist && artist.first_name ? artist.first_name : ""
            }!`,

            headerStyle: {
              backgroundColor: mode == "light" ? "#fff" : "#111",
              shadowColor: mode == "light" ? "#00000020" : "#181818",
            },
            headerTintColor: mode == "light" ? "#000" : "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: mode == "light" ? "#000" : "#fff",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: mode == "light" ? "#000" : "#fff",
            },
            headerLeft: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.toggleDrawer();
                  }}
                  style={{ paddingLeft: 20 }}
                >
                  <FontAwesome5
                    name={"bars"}
                    size={20}
                    color={mode == "light" ? "#000000" : "#fff"}
                  />
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
              backgroundColor: mode == "light" ? "#fff" : "#111",
              shadowColor: mode == "light" ? "#00000020" : "#181818",
            },
            headerTintColor: mode == "light" ? "#000" : "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: mode == "light" ? "#000" : "#fff",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: mode == "light" ? "#000" : "#fff",
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
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              fontSize: 15,
              color: "#fff",
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
              backgroundColor: mode == "light" ? "#fff" : "#111",
              shadowColor: mode == "light" ? "#00000020" : "#181818",
            },
            headerTintColor: mode == "light" ? "#000" : "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: mode == "light" ? "#000" : "#fff",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: mode == "light" ? "#000" : "#1A5C79",
            },

            headerLeft: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.openDrawer();
                  }}
                  style={{ paddingLeft: 20 }}
                >
                  <FontAwesome5
                    name={"bars"}
                    size={20}
                    color={mode == "light" ? "black" : "white"}
                  />
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
                  <Ionicons
                    name="ios-add"
                    size={30}
                    color={mode == "light" ? "black" : "white"}
                  />
                </TouchableOpacity>
              );
            },
          }}
        />
        <RoyaltiesStack.Screen
          name="ManageRoyalties"
          component={ManageRoyalties}
          options={{
            headerTitle: `Edit Royalties`,

            headerStyle: {
              backgroundColor: mode == "light" ? "#fff" : "#111",
              shadowColor: mode == "light" ? "#00000020" : "#181818",
            },
            headerTintColor: mode == "light" ? "#000" : "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: mode == "light" ? "#000" : "#fff",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: mode == "light" ? "#000" : "#fff",
            },
          }}
        />
        <RoyaltiesStack.Screen
          name="AddRoyalty"
          component={AddRoyalty}
          options={{
            headerTitle: `Add a Royalty`,

            headerStyle: {
              backgroundColor: mode == "light" ? "#fff" : "#111",
              shadowColor: mode == "light" ? "#00000020" : "#181818",
            },
            headerTintColor: mode == "light" ? "#000" : "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: mode == "light" ? "#000" : "#fff",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: mode == "light" ? "#000" : "#fff",
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
              backgroundColor: mode == "light" ? "#fff" : "#111",
              shadowColor: mode == "light" ? "#00000020" : "#181818",
            },
            headerTintColor: mode == "light" ? "#000" : "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: mode == "light" ? "#000" : "#fff",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: mode == "light" ? "#000" : "#1A5C79",
            },

            headerLeft: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.openDrawer();
                  }}
                  style={{ paddingLeft: 20 }}
                >
                  <FontAwesome5
                    name={"bars"}
                    size={20}
                    color={mode == "light" ? "black" : "white"}
                  />
                </TouchableOpacity>
              );
            },
            headerRight: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("BvnVerification");
                  }}
                  style={{ paddingRight: 20 }}
                >
                  <Text style={{ color: mode == "light" ? "black" : "white" }}>
                    Edit Bank Details
                  </Text>
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
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              fontSize: 15,
              color: "#fff",
            },
          }}
        />
        <Stack.Screen
          name="BvnVerification"
          component={BvnVerification}
          options={{
            headerTitle: `Update Bank Details`,

            headerStyle: {
              backgroundColor: mode == "light" ? "#fff" : "#111",
              shadowColor: mode == "light" ? "#00000020" : "#181818",
            },
            headerTintColor: mode == "light" ? "#000" : "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: mode == "light" ? "#000" : "#fff",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: mode == "light" ? "#000" : "#fff",
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
              backgroundColor: mode == "light" ? "#fff" : "#111",
              shadowColor: mode == "light" ? "#00000020" : "#181818",
            },
            headerTintColor: mode == "light" ? "#000" : "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: mode == "light" ? "#000" : "#fff",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: mode == "light" ? "#000" : "#1A5C79",
            },

            headerLeft: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.openDrawer();
                  }}
                  style={{ paddingLeft: 20 }}
                >
                  <FontAwesome5
                    name={"bars"}
                    size={20}
                    color={mode == "light" ? "black" : "white"}
                  />
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
              backgroundColor: mode == "light" ? "#fff" : "#111",
              shadowColor: mode == "light" ? "#00000020" : "#181818",
            },
            headerTintColor: mode == "light" ? "#000" : "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: mode == "light" ? "#000" : "#fff",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: mode == "light" ? "#000" : "#fff",
            },
          }}
        />
        <SubscriptionsStack.Screen
          name="AddTrack"
          component={AddTrack}
          options={({ route }) => ({
            headerTitle: `Add a song to ${route.params.packageName}`,

            headerStyle: {
              backgroundColor: mode == "light" ? "#fff" : "#111",
              shadowColor: mode == "light" ? "#00000020" : "#181818",
            },
            headerTintColor: mode == "light" ? "#000" : "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: mode == "light" ? "#000" : "#fff",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: mode == "light" ? "#000" : "#fff",
            },
          })}
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
              backgroundColor: mode == "light" ? "white" : "#111",
              shadowColor: mode == "light" ? "#00000020" : "#181818",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: mode == "light" ? "#000" : "#fff",
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
                  <FontAwesome5
                    name={"bars"}
                    size={20}
                    color={mode == "light" ? "#000" : "#fff"}
                  />
                </TouchableOpacity>
              );
            },

            headerRight: () => {
              // if (Platform.OS === "ios") {
              //   return null;
              // } else {
              return <UploadButton navigation={navigation} mode={mode} />;
              // }
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
            },

            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: "#fff",
              fontSize: 15,
            },
          }}
        />
        <Stack.Screen
          name="UploadSong"
          component={UploadSong}
          options={{
            headerTitle: `Publish Song`,

            headerStyle: {
              backgroundColor: mode == "light" ? "#fff" : "#111",
              shadowColor: mode == "light" ? "#00000020" : "#181818",
            },
            headerTintColor: mode == "light" ? "#000" : "#fff",
            headerTitleStyle: {
              fontSize: 15,
              color: mode == "light" ? "#000" : "#fff",
            },
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: mode == "light" ? "#000" : "#fff",
            },
          }}
        />
      </Stack.Navigator>
    );
  };

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.identifier"
    >
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
                    backgroundColor: mode == "light" ? "#fff" : "#111",
                    shadowColor: mode == "light" ? "#00000020" : "#181818",
                  },
                  headerTintColor: mode == "light" ? "#000" : "#fff",
                  headerTitleStyle: {
                    fontSize: 15,
                    color: mode == "light" ? "#000" : "#fff",
                  },
                  headerBackTitle: "Back",
                }}
              />
              <Stack.Screen
                name="CreatePassword"
                component={CreatePassword}
                options={{
                  headerShown: false,
                  headerTitle: "Create Your Password",

                  headerStyle: {
                    backgroundColor: mode == "light" ? "#7b7c7c" : "#101820FF",
                    shadowColor: "#181818",
                  },
                  headerTintColor: "#fff",
                  headerTitleStyle: {
                    fontSize: 15,
                    color: "#1A5C79",
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
                    backgroundColor: mode == "light" ? "#fff" : "#111",
                    shadowColor: mode == "light" ? "#00000020" : "#181818",
                  },
                  headerTintColor: mode == "light" ? "#000" : "#fff",
                  headerTitleStyle: {
                    fontSize: 15,
                    color: mode == "light" ? "#000" : "#fff",
                  },
                  headerBackTitle: "Back",
                }}
              />
              <Stack.Screen
                name="PersonalInfo"
                component={PersonalInformation}
                options={{
                  headerTitle: "Create an account",
                  headerStyle: {
                    backgroundColor: mode == "light" ? "#fff" : "#111",
                    shadowColor: mode == "light" ? "#00000020" : "#181818",
                  },
                  headerTintColor: mode == "light" ? "#000" : "#fff",
                  headerTitleStyle: {
                    fontSize: 15,
                    color: mode == "light" ? "#000" : "#fff",
                  },
                  headerBackTitle: "Back",
                }}
              />
            </>
          </Stack.Navigator>
        ) : (
          <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            drawerContentOptions={{
              activeTintColor: mode == "light" ? "#000" : "#fff",
              inactiveTintColor: mode == "light" ? "#000" : "#ffffff",
            }}
            drawerStyle={{
              backgroundColor: mode == "light" ? "#fff" : "#000",
            }}
          >
            <Drawer.Screen name="Dashboard" component={Root} />

            <Drawer.Screen name="Uploads" component={UploadsScreen} />

            <Drawer.Screen name="Royalties" component={RoyaltiesScreen} />
            <Drawer.Screen name="Payouts" component={PayoutScreen} />

            <Drawer.Screen
              name="Distribution"
              component={SubscriptionsScreen}
            />
          </Drawer.Navigator>
        )}
      </NavigationContainer>
    </StripeProvider>
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
              backgroundColor: mode == "light" ? "#00000010" : "#ffffff25",
              width: "100%",
              height: 100,

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

              <FastImage
                source={
                  dpImage != null
                    ? {
                        uri: dpImage.split("?")[0],
                        priority: FastImage.priority.high,
                        cache: FastImage.cacheControl.immutable,
                      }
                    : require("./assets/dummy_avatar.png")
                }
                resizeMode="cover"
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                  marginRight: 20,
                }}
              />
              <View>
                <Text
                  style={{
                    color: mode == "light" ? "#000" : "white",

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
                    backgroundColor:
                      mode == "light" ? "#00000010" : "#ffffff15",
                    height: 30,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    props.navigation.navigate("EditProfile");
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: mode == "light" ? "#000" : "white",

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
          <TouchableOpacity
            onPress={() => {
              toggleSwitch();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 18,
              marginTop: 18,
            }}
          >
            <Text
              style={{
                marginRight: 10,
                fontSize: 14,
                fontWeight: "500",
                color: mode == "light" ? "black" : "white",
              }}
            >
              Switch to {mode == "light" ? "dark" : "light"} mode
            </Text>
            {/* <Switch
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              trackColor={{
                false: mode == "light" ? "#000" : "#fff",
                true: mode == "light" ? "#fff" : "#00000020",
              }}
              thumbColor={
                isEnabled ? (mode == "light" ? "#000" : "#fff") : "#f4f3f4"
              }
              ios_backgroundColor="#ffffff90"
              onValueChange={toggleSwitch}
              value={isEnabled}
            /> */}
          </TouchableOpacity>
        </DrawerContentScrollView>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 50,
            marginLeft: 20,
          }}
          onPress={() => dispatch(authActions.deleteUserToken())}
        >
          {/* <AntDesign
            name={"logout"}
            size={20}
            color={mode == "light" ? "#000" : "white"}
          /> */}

          <Text
            style={{
              fontSize: 18,
              marginLeft: 10,
              color: mode == "light" ? "black" : "white",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
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
