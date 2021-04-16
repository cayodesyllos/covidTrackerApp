import {Navigation} from 'react-native-navigation';
import AsyncStorage from '@react-native-community/async-storage';

const initialLoad = async () => {
  Navigation.setDefaultOptions({
    layout: {
      orientation: ['portrait'], // An array of supported orientations
      componentBackgroundColor: '#000',
      backgroundColor: '#000',
    },
    topBar: {
      visible: false,
      buttonColor: '#000',
      background: {
        color: 'white',
        translucent: true,
        blur: false,
      },
      backButton: {
        color: '#000',
        visible: true,
      },
    },

    bottomTabs: {
      visible: false,
      animate: false, // Controls whether BottomTabs visibility changes should be animated
      currentTabIndex: 0,
      currentTabId: 'currentTabId',
      testID: 'bottomTabsTestID',
      drawBehind: false,
      backgroundColor: 'white',
    },
    bottomTab: {
      badgeColor: 'red',
      testID: 'bottomTabTestID',
      iconColor: '#C1CDDA',
      selectedIconColor: '#444',
      textColor: 'red',
      selectedTextColor: '#444',
      fontSize: 10,
    },
  });

  const jwt = await AsyncStorage.getItem('jwt');
  jwt === null ? Initial() : RootView();
};

const SignUp = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'CovidTracker.SignUp',
            },
          },
        ],
      },
    },
  });
};

const Login = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'CovidTracker.Login',
            },
          },
        ],
      },
    },
  });
};

const Initial = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'CovidTracker.Initial',
            },
          },
        ],
      },
    },
  });
};

const RootView = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'CovidTracker.RootView',
            },
          },
        ],
      },
    },
  });
};

function LocationDetail(componentId, goToPageWithProps) {
  Navigation.push(componentId, {
    component: {
      name: 'CovidTracker.LocationDetail',
      passProps: {
        goToPageWithProps,
      },

      options: {
        animations: {
          showModal: {
            alpha: {
              from: 0,
              to: 1,
              duration: 300,
            },
          },
        },
        topBar: {
          elevation: 1.5,
          title: {
            text: goToPageWithProps.name,
            alignment: 'center',
            fontSize: 18,
            color: 'white',
          },
          backButton: {
            visible: true,
            showTitle: false,
            title: null,
            color: 'white',
          },
          background: {
            color: 'black',
          },
          drawBehind: false,
          visible: true,
          animate: false,
          noBorder: false,
        },
      },
    },
  });
}

const navigationService = {
  SignUp,
  Login,
  RootView,
  initialLoad,
  LocationDetail,
  Initial,
};

export default navigationService;
