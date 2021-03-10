import { registerRootComponent } from 'expo';
import App from './App';
import RNPaystack from "react-native-paystack";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
RNPaystack.init({ publicKey: 'pk_live_c0f31bc65dde5997576bda7d62a2034873c87e0e'});
registerRootComponent(App);
