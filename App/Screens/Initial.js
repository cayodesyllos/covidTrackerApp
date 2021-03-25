import React, {Component} from 'react';
import {
  View,
  StatusBar,
  Image,
  TextInput,
  TouchableHighlight,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {StyleSheet} from 'react-native';
import navigationService from '../services/NavigationService';
import MainStyles from '../style/MainStyles';
import Logo from '../Components/Logo';
export default class Initial extends Component {
  render() {
    return (
      <View style={MainStyles.container}>
        <StatusBar barStyle={'light-content'} />
        <View style={MainStyles.containerLogo}>
          <Logo />
        </View>

        <View>
          <TouchableHighlight
            style={[MainStyles.buttonContainer, MainStyles.regularButton]}
            onPress={async () => {
              navigationService.Login();
            }}>
            <Text style={MainStyles.regularText}>Login</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={[MainStyles.buttonContainer, MainStyles.regularButton]}
            onPress={async () => {
              navigationService.SignUp();
            }}>
            <Text style={MainStyles.regularText}>Sign Up</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={async () => {
              Alert.alert('Open website');
            }}>
            <Text
              style={[
                MainStyles.regularText,
                {textAlign: 'center', fontSize: 14},
              ]}>
              Frequent questions
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
