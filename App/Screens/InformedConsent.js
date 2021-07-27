import React, {Component} from 'react';
import {View} from 'react-native';
import {StyleSheet, TouchableHighlight, Text} from 'react-native';
import navigationService from '../services/NavigationService';
import MainStyles from '../style/MainStyles';
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';

export default class InformedConsent extends Component {
  render() {
    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          flex: 1,
        }}>
        <View style={{height: 100}}>
          <Text style={MainStyles.TextTitle}>Informed Consent</Text>
        </View>

        <View style={{height: 300}}>
          <Text
            style={[MainStyles.TextSubTitle, {textAlign: 'left', padding: 20}]}>
            PARTICIPANT CONFIDENTIALITY
          </Text>
          <Text
            style={[MainStyles.regularText, {textAlign: 'left', padding: 20}]}>
            In order to maintain confidentiality, your name will not be
            connected to any publication or presentation that uses the
            information and data collected about you or with the research
            findings from this study.
          </Text>
          <Text
            style={[MainStyles.regularText, {textAlign: 'left', padding: 20}]}>
            Your identifiable information will only be shared if required by law
            or you give written permission.
          </Text>
        </View>
        <View
          style={{
            height: 120,
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <TouchableHighlight
            style={[MainStyles.buttonContainer, MainStyles.regularButton]}
            onPress={async () => {
              await api.put('/user', {agreed: true});
              await AsyncStorage.setItem('step', '5');
              navigationService.Tutorial();
            }}>
            <Text style={MainStyles.regularText}>I consent</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={[
              MainStyles.buttonContainer,
              MainStyles.regularButtonSecondary,
            ]}
            onPress={async () => {}}>
            <Text style={MainStyles.regularTextSecondary}>
              I DO NOT consent
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
