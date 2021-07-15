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

  // await AsyncStorage.removeItem('tutorial');

  const jwt = await AsyncStorage.getItem('jwt');
  if (!jwt) {
    Initial();
  }

  const step = await AsyncStorage.getItem('step');
  const tutorial = await AsyncStorage.getItem('tutorial');

  if (step === '5') {
    if (!tutorial) {
      Tutorial();
    } else {
      RootView();
    }
  } else if (step === '4') {
    InformedConsent();
  } else {
    SignUp();
  }
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

const Tutorial = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'CovidTracker.Tutorial',
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

const InformedConsent = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'CovidTracker.InformedConsent',
            },
          },
        ],
      },
    },
  });
};

const UpdateComorbidities = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'CovidTracker.UpdateComorbidities',
            },
          },
        ],
      },
    },
  });
};

const UpdateVaccine = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'CovidTracker.UpdateVaccine',
            },
          },
        ],
      },
    },
  });
};

const LongTerm = (user_id, infection_id) => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              passProps: {
                user_id: user_id,
                infection_id: infection_id,
              },
              name: 'CovidTracker.LongTerm',
            },
          },
        ],
      },
    },
  });
};

const CovidSeverity = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'CovidTracker.CovidSeverity',
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

const navigationService = {
  SignUp,
  Login,
  RootView,
  initialLoad,
  Initial,
  InformedConsent,
  UpdateComorbidities,
  UpdateVaccine,
  CovidSeverity,
  LongTerm,
  Tutorial,
};

export default navigationService;
