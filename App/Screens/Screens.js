import {Navigation} from 'react-native-navigation';
import LoginScreen from '../Screens/Login';
import SignUpScreen from '../Screens/SignUp';
import InitialScreen from '../Screens/Initial';
import RootView from '../Screens/RootView';
import InformedConsent from '../Screens/InformedConsent';
import UpdateComorbidities from '../Screens/UpdateComorbidities';
import UpdateVaccine from '../Screens/UpdateVaccine';
import CovidSeverity from '../Screens/CovidSeverity';
import LongTerm from '../Screens/LongTerm';

export function registerScreens() {
  Navigation.registerComponent('CovidTracker.SignUp', () => SignUpScreen);
  Navigation.registerComponent(
    'CovidTracker.InformedConsent',
    () => InformedConsent,
  );
  Navigation.registerComponent(
    'CovidTracker.UpdateComorbidities',
    () => UpdateComorbidities,
  );
  Navigation.registerComponent(
    'CovidTracker.UpdateVaccine',
    () => UpdateVaccine,
  );
  Navigation.registerComponent('CovidTracker.Login', () => LoginScreen);
  Navigation.registerComponent('CovidTracker.Initial', () => InitialScreen);

  Navigation.registerComponent(
    'CovidTracker.CovidSeverity',
    () => CovidSeverity,
  );

  Navigation.registerComponent('CovidTracker.LongTerm', () => LongTerm);

  Navigation.registerComponent('CovidTracker.RootView', () => RootView);
}
