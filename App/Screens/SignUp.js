import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import navigationService from '../services/NavigationService';
import MainStyles from '../style/MainStyles';
import api from '../services/api';
import Logo from '../Components/Logo';

export default class SignUp extends Component {
  state = {
    email: '',
    password: '',
  };

  handleValidateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase()) === false) {
      return false;
    }
    return true;
  };

  handleValidation = () => {
    if (!this.handleValidateEmail(this.state.email)) {
      alert('Invalid email');
      return false;
    }
    if (this.state.password.length < 8) {
      alert('Password has to have at least 8 characters');
      return false;
    }
    return true;
  };

  handleCreateUser = async () => {
    const validated = this.handleValidation();
    if (!validated) {
      return;
    }
    this.setState({loading: true});
    const body = {
      email: this.state.email,
      password: this.state.password,
    };

    try {
      const response = await api.post('/user', body);
      await AsyncStorage.setItem('jwt', response.data.token);
      navigationService.RootView();
    } catch (err) {
      alert(err.message);
    }

    this.setState({loading: false});
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
            onPress={async () => await this.handleCreateUser()}
            style={[
              MainStyles.buttonContainer,
              this.state.loading
                ? MainStyles.regularButtonDisabled
                : MainStyles.regularButton,
            ]}
            disabled={this.state.loading}>
            <Text style={MainStyles.regularText}>Sign Up</Text>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={this.state.loading}
            onPress={async () => {
              navigationService.Login();
            }}>
            <Text
              style={[
                MainStyles.regularText,
                {textAlign: 'center', fontSize: 14},
              ]}>
              I have an account
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
