// RootNavigation.js

import * as React from "react";
import { StackActions, SwitchActions } from "@react-navigation/native";


export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function push(...args) {
  navigationRef.current?.dispatch(StackActions.push(...args));
}


export function replace(...args) {
  navigationRef.current?.dispatch(StackActions.replace(...args));
}


// add other navigation functions that you need and export them
