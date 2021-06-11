import React, {Component} from 'react';
import {View} from 'react-native';
import {StyleSheet, TouchableHighlight, Text} from 'react-native';
import navigationService from '../services/NavigationService';
import MainStyles from '../style/MainStyles';
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';

export default class UpdateVaccine extends Component {
  render() {
    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          flex: 1,
        }}>
        <View style={{height: 100}}>
          <Text style={MainStyles.TextTitle}>Update Vaccine</Text>
        </View>

        <View style={{height: 300}} />
        <View
          style={{
            height: 120,
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <TouchableHighlight
            style={[MainStyles.buttonContainer, MainStyles.regularButton]}
            onPress={async () => {
              navigationService.RootView();
            }}>
            <Text style={MainStyles.regularText}>Update</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={[
              MainStyles.buttonContainer,
              MainStyles.regularButtonSecondary,
            ]}
            onPress={async () => {
              navigationService.RootView();
            }}>
            <Text style={MainStyles.regularTextSecondary}>Cancel</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
