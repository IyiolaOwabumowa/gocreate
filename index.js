// import { registerRootComponent } from "expo";
import React, { Component } from "react";
import { AppRegistry } from "react-native";
import App from "./App";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
//registerRootComponent(App);
const AppWrapper = () => <App />;

AppRegistry.registerComponent("GoCreate", () =>
  gestureHandlerRootHOC(AppWrapper)
);
