import {Navigation} from 'react-native-navigation';
import LoginScreen from '../Screens/Login';
import LocationDetail from '../Screens/LocationDetail';
import SignUpScreen from '../Screens/SignUp';
import InitialScreen from '../Screens/Initial';
import RootView from '../Screens/RootView';

export function registerScreens() {
  Navigation.registerComponent('CovidTracker.SignUp', () => SignUpScreen);
  Navigation.registerComponent('CovidTracker.Login', () => LoginScreen);
  Navigation.registerComponent('CovidTracker.Initial', () => InitialScreen);
  Navigation.registerComponent(
    'CovidTracker.LocationDetail',
    () => LocationDetail,
  );
  Navigation.registerComponent('CovidTracker.RootView', () => RootView);
}
