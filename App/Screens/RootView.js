import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StatusBar,
  Text,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {StyleSheet} from 'react-native';
import navigationService from '../services/NavigationService';
import api from '../services/api';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faQrcode,
  faMapMarkerAlt,
  faBell,
  faUser,
  faNewspaper,
} from '@fortawesome/free-solid-svg-icons';
import Colors from '../style/Colors';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import QR from '../Components/QR';
import Profile from '../Components/Profile';
import CovidData from '../Components/CovidData';
import Locations from '../Components/Locations';
import Notifications from '../Components/Notifications';

PushNotification.configure({
  onNotification: function (notification) {
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  requestPermissions: true,
  smallIcon: 'ic_notification',
  largeIcon: '',
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
});

PushNotification.createChannel(
  {
    channelId: 'my-channel', // (required)
    channelName: 'My channel', // (required)
  },
  (created) => console.log(`CreateChannel returned '${created}'`),
);

const CustomTab = (props) => {
  const [activeIndex, setActiveIndex] = React.useState(1);

  const handleIndexChange = (index) => {
    props.goToPage(index);
  };

  useEffect(() => {
    if (props.currentTab !== activeIndex) {
      setActiveIndex(props.currentTab);
    }
  }, [props.currentTab, activeIndex, setActiveIndex]);

  return (
    <View style={{}}>
      <View>
        <SafeAreaView style={{flex: 0, backgroundColor: 'black'}} />
        <StatusBar barStyle="light-content" />
      </View>

      <View style={[styles.header]}>
        <View style={[styles.headerAnimated]}>
          <Text
            style={[styles.Btn]}
            onPress={() => {
              handleIndexChange(0);
            }}>
            <FontAwesomeIcon
              style={{
                color: activeIndex === 0 ? Colors.PURPLE : 'white',
                fontSize: activeIndex === 0 ? 45 : 30,
                alignSelf: 'center',
              }}
              size={32}
              icon={faUser}
            />
          </Text>

          <Text
            onPress={() => {
              handleIndexChange(1);
            }}
            style={[styles.Btn]}>
            <FontAwesomeIcon
              style={{
                color: activeIndex === 1 ? Colors.PURPLE : 'white',
              }}
              size={32}
              icon={faQrcode}
            />
          </Text>
          <Text
            style={[styles.Btn]}
            onPress={() => {
              handleIndexChange(2);
            }}>
            <FontAwesomeIcon
              style={{
                color: activeIndex === 2 ? Colors.PURPLE : 'white',
              }}
              size={32}
              icon={faNewspaper}
            />
          </Text>

          <Text
            style={[styles.Btn]}
            onPress={() => {
              handleIndexChange(3);
            }}>
            <FontAwesomeIcon
              style={{
                color: activeIndex === 3 ? Colors.PURPLE : 'white',
              }}
              size={32}
              icon={faMapMarkerAlt}
            />
          </Text>
          <Text
            style={[styles.Btn]}
            onPress={() => {
              handleIndexChange(4);
            }}>
            <FontAwesomeIcon
              style={{
                color: activeIndex === 4 ? Colors.PURPLE : 'white',
              }}
              size={32}
              icon={faBell}
            />
          </Text>
        </View>
      </View>
    </View>
  );
};

const RootView = (props) => {
  const [currTab, setCurrTab] = useState(1);
  const [checkedIn, setCheckedIn] = useState(false);
  const [healthStatus, setHealthStatus] = React.useState(1);
  const [updateNotifications, setUpdateNotifications] = React.useState(false);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      try {
        PushNotification.localNotification({
          channelId: 'my-channel',
          title: remoteMessage.notification.title,
          message: remoteMessage.notification.body,
        });
        setUpdateNotifications(!updateNotifications);
      } catch (err) {}
    });
    notificationsSetUp();
    handleInitialLoad();
    return unsubscribe;
  }, [handleInitialLoad, updateNotifications]);

  useEffect(() => {
    Linking.addEventListener('url', handleOpenURL);
    return () => Linking.removeAllListeners('url');
  }, [handleOpenURL]);

  const notificationsSetUp = async () => {
    console.disableYellowBox = true;
    PushNotification.requestPermissions();
    await messaging().requestPermission();

    // Get the device token
    await messaging()
      .getToken()
      .then(async (token) => {
        await api.put('/user', {fcm_token: token});
      });

    // Listen to whether the token changes
    messaging().onTokenRefresh(async (token) => {
      await api.put('/user', {fcm_token: token});
    });
  };

  const handleOpenURL = useCallback(
    async (event) => {
      const parts = event.url.split('//');
      const token = parts[1];
      try {
        const response = await api.post('/checkin', {token: token});
        alert(`Checked in at ${response.data.location_name}`);
        setCheckedIn(!checkedIn);
      } catch (error) {
        alert(error.response.data.error.message);
      }
      setCheckedIn(false);
    },
    [checkedIn],
  );

  const handleInitialLoad = useCallback(async () => {
    const response = await api.get('/user');
    if (response.data.infection) {
      const today = new Date();
      const infection_creation = new Date(response.data.infection.created_at);
      const diffTime = Math.abs(today - infection_creation);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 90) {
        Alert.alert(
          'It has been over 3 months since you recovered from Covid-19',
          'Could you tell us about your long term symtoms?',
          [
            {
              text: 'Yes',
              onPress: () => {
                navigationService.LongTerm(
                  response.data.id,
                  response.data.infection.id,
                );
              },
            },
            {text: 'Maybe later', onPress: () => {}},
            {
              text: 'Never',
              onPress: () => {
                api.post('/longterm', {
                  infection_id: response.data.infection.id,
                  long_term_status: 'NEVER',
                });
              },
            },
          ],
        );
      }
    }
    setHealthStatus(response.data.infected ? 2 : 1);
  }, []);

  const changeStatus = async (status) => {
    try {
      await api.put('/user', {infected: status === 2});
      setHealthStatus(status);
    } catch (error) {
      alert('Error changing status');
    }
  };

  const handleLogout = async () => {
    await api.put('/user', {fcm_token: ' '});
    await AsyncStorage.clear();
    navigationService.Initial();
  };

  const goToPage = (index) => {
    this.tabbar.goToPage(index);
  };

  return (
    <ScrollableTabView
      onScroll={(value) => setCurrTab(value)}
      ref={(component) => (tabbar = component)}
      initialPage={1}
      renderTabBar={() => (
        <CustomTab goToPage={goToPage} currentTab={currTab} />
      )}
      prerenderingSiblingsNumber={1}>
      <Profile
        logout={handleLogout}
        changeStatus={changeStatus}
        healthStatus={healthStatus}
        componentId={props.componentId}
      />
      <QR
        setCheckedIn={setCheckedIn}
        checkedIn={checkedIn}
        componentId={props.componentId}
      />
      <CovidData componentId={props.componentId} />
      <Locations checkedIn={checkedIn} componentId={props.componentId} />
      <Notifications
        updateNotifications={updateNotifications}
        componentId={props.componentId}
      />
    </ScrollableTabView>
  );
};

export default RootView;

const styles = StyleSheet.create({
  Btn: {
    width: 32,
    height: 32,
    textAlign: 'center',
  },
  header: {
    backgroundColor: 'black',
    marginTop: 0,
    width: '100%',
    height: 70, // it was 70 before
    maxHeight: 70,
    zIndex: 0,
  },
  headerAnimated: {
    width: '100%',
    height: 70, // it was 70 before
    maxHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 15,
  },
});
