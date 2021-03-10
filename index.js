import { registerRootComponent } from 'expo';
import App from './App';
import RNPaystack from "react-native-paystack";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
RNPaystack.init({ publicKey: 'pk_test_d745bdcc21a79cdc8f5761eb978e0dbb764ed857'});
registerRootComponent(App);
