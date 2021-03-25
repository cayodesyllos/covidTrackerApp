import NavigationService from './App/services/NavigationService';
import {Navigation} from 'react-native-navigation';
import {registerScreens} from './App/Screens/Screens';

// AppRegistry.registerComponent(appName, () => SignUpScreen);
Navigation.events().registerAppLaunchedListener(() => {
  registerScreens();
  NavigationService.initialLoad();
});
