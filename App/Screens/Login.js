import React, {Component} from 'react';
import {
  View,
  StatusBar,
  TextInput,
  TouchableHighlight,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {StyleSheet} from 'react-native';
import navigationService from '../services/NavigationService';
import MainStyles from '../style/MainStyles';
import api from '../services/api';
import Logo from '../Components/Logo';

export default class SignUp extends Component {
  state = {
    password: '',
    email: '',
    loading: false,
  };

  handleLogin = async () => {
    try {
      this.setState({loading: true});

      const body = {
        password: this.state.password,
        email: this.state.email,
      };
      const response = await api.post('/login', body);
      AsyncStorage.setItem('jwt', response.data.token);

      this.setState({loading: false});
      navigationService.RootView();
    } catch (error) {
      this.setState({loading: false});
      Alert.alert('Fail to login', error.message);
    }
  };

  render() {
    return (
      <View style={MainStyles.container}>
        <StatusBar barStyle={'light-content'} />
        <View style={MainStyles.containerLogo}>
          <Logo />
        </View>

        <View>
          <View style={MainStyles.inputContainer}>
            <TextInput
              style={MainStyles.inputs}
              placeholder="Email"
              keyboardType="email-address"
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              value={this.state.email}
              onChangeText={(email) => this.setState({email})}
            />
          </View>

          <View style={MainStyles.inputContainer}>
            <TextInput
              style={MainStyles.inputs}
              placeholder="Password"
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              value={this.state.password}
              onChangeText={(password) => this.setState({password})}
            />
          </View>

          <TouchableHighlight
            style={[MainStyles.buttonContainer, MainStyles.regularButton]}
            disabled={this.state.loading}
            onPress={async () => {
              await this.handleLogin();
            }}>
            <Text style={MainStyles.regularText}>
              {!this.state.loading ? 'Login' : <ActivityIndicator />}
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={this.state.loading}
            onPress={async () => {
              navigationService.SignUp();
            }}>
            <Text
              style={[
                MainStyles.regularText,
                {textAlign: 'center', fontSize: 14},
              ]}>
              I need an account
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
