import React, {Component} from 'react';
import {StyleSheet, Image} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import Colors from '../style/Colors';
import navigationService from '../services/NavigationService';
import AsyncStorage from '@react-native-community/async-storage';
export default class InformedConsent extends Component {
  endTutorial = async () => {
    await AsyncStorage.setItem('tutorial', 'done');
    navigationService.RootView();
  };

  render() {
    return (
      <Onboarding
        onDone={() => this.endTutorial()}
        onSkip={() => this.endTutorial()}
        pages={[
          {
            backgroundColor: Colors.DARKER_GRAY,
            image: <Image source={require('../Assets/CovidTrackerLogo.png')} />,
            title: 'Welcome to Covid Tracker',
            subtitle:
              'Please, take the following steps to get to know the main app functionalities.',
          },
          {
            backgroundColor: Colors.PURPLE_DARK,
            image: <Image source={require('../Assets/screen_shot_1.png')} />,
            title: 'Enable others to track their safety',
            subtitle:
              'By creating your QR code, people can keep track of who crossed paths with them in your location.',
          },
          {
            backgroundColor: Colors.PURPLE_DARK,
            image: <Image source={require('../Assets/screen_shot_2.png')} />,
            title: "Scan other's QR code and keep track of your safety",
            subtitle:
              "With the app installed, point the camera, scan someone's QR code, and keep track of people that crossed paths with you there that day",
          },
          {
            backgroundColor: Colors.PURPLE_DARK,
            image: <Image source={require('../Assets/screen_shot_3.png')} />,
            title: 'Do your part',
            subtitle: 'Keep your health status updated',
          },
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({});
