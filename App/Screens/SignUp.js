import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  StatusBar,
  TouchableOpacity,
  CheckBox,
  Picker,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import navigationService from '../services/NavigationService';
import MainStyles from '../style/MainStyles';
import api from '../services/api';
import Logo from '../Components/Logo';
import Colors from '../style/Colors';
import {TextInputMask} from 'react-native-masked-text';
import {ScrollView} from 'react-native-gesture-handler';

export default class SignUp extends Component {
  state = {
    email: '',
    password: '',
    birthday: '',
    sex: '',

    vacine: '',
    date_first_dose: '',
    date_second_dose: '',
    step: 1,

    cardiovascular: false,
    diabetis: false,
    lung: false,
    cancer: false,
    kidney: false,
    solid_organ: false,
    obesity: false,
    smoking: false,
    agreed: false,
  };

  async componentDidMount() {
    const step = await AsyncStorage.getItem('step');
    if (step === '4') {
      navigationService.InformedConsent();
    } else if (step) {
      this.setState({step: parseInt(step)});
    }
  }

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

  handleNextStep = async () => {
    try {
      if (this.state.step === 1) {
        const validated = this.handleValidation();
        if (!validated) {
          return;
        }
        this.setState({loading: true});
        const body = {
          email: this.state.email,
          password: this.state.password,
          birthday: this.state.birthday,
          sex: this.state.sex,
        };
        const response = await api.post('/user', body);
        await AsyncStorage.setItem('jwt', response.data.token);
        await AsyncStorage.setItem('step', '2');
        this.setState({step: 2});
      } else if (this.state.step === 2) {
        this.setState({loading: true});
        const body = {
          vacine: this.state.vacine,
          date_first_dose: this.state.date_first_dose,
          date_second_dose: this.state.date_second_dose,
        };
        await api.post('/vacine', body);
        await AsyncStorage.setItem('step', '3');
        this.setState({step: 3});
      } else {
        this.setState({loading: true});
        const body = {
          cardiovascular: this.state.cardiovascular,
          diabetis: this.state.diabetis,
          lung: this.state.lung,
          cancer: this.state.cancer,
          kidney: this.state.kidney,
          solid_organ: this.state.solid_organ,
          obesity: this.state.obesity,
          smoking: this.state.smoking,
        };
        await api.post('/comorbity', body);

        await AsyncStorage.setItem('step', '4');
        navigationService.InformedConsent();
      }
    } catch (err) {
      alert(err.message);
    }

    this.setState({loading: false});
  };

  render() {
    return (
      <View style={{flex: 1, paddingTop: StatusBar.currentHeight}}>
        <StatusBar barStyle={'light-content'} />
        <ScrollView contentContainerStyle={MainStyles.container}>
          <View style={MainStyles.containerLogo}>
            <Logo />
          </View>
          <View
            style={{
              marginBottom: 40,
              width: '100%',
              justifyContent: 'space-evenly',
              flexDirection: 'row',
            }}>
            <View
              style={{
                backgroundColor: Colors.PURPLE,
                width: 30,
                height: 30,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 1,
              }}>
              <Text
                style={[
                  MainStyles.regularText,
                  {
                    top: 30,
                    color: Colors.PURPLE,
                    width: 100,
                    textAlign: 'center',
                  },
                ]}>
                Bio
              </Text>
            </View>
            <View
              style={{
                backgroundColor: this.state.step >= 2 ? Colors.PURPLE : 'white',
                width: 30,
                height: 30,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 1,
              }}>
              <Text
                style={[
                  MainStyles.regularText,
                  {
                    top: 30,
                    color: this.state.step >= 2 ? Colors.PURPLE : 'white',
                    width: 100,
                    textAlign: 'center',
                  },
                ]}>
                Vaccine
              </Text>
            </View>
            <View
              style={{
                backgroundColor: this.state.step >= 3 ? Colors.PURPLE : 'white',
                width: 30,
                height: 30,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 1,
              }}>
              <Text
                style={[
                  MainStyles.regularText,
                  {
                    top: 30,
                    color: this.state.step >= 3 ? Colors.PURPLE : 'white',
                    width: 100,
                    textAlign: 'center',
                  },
                ]}>
                comorbidities
              </Text>
            </View>
          </View>

          {this.state.step === 1 && (
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
              <View style={MainStyles.inputContainer}>
                <TextInputMask
                  style={MainStyles.inputs}
                  placeholder="Birthday"
                  type={'datetime'}
                  options={{
                    format: 'DD/MM/YYYY',
                  }}
                  value={this.state.birthday}
                  onChangeText={(birthday) => {
                    this.setState({
                      birthday,
                    });
                  }}
                />
              </View>
              <View style={MainStyles.dropDownContainer}>
                <Picker
                  selectedValue={this.state.sex}
                  style={[{width: '100%'}, MainStyles.inputs]}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({sex: itemValue})
                  }>
                  <Picker.Item label="Choose sex..." value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                </Picker>
              </View>

              <TouchableHighlight
                onPress={async () => await this.handleNextStep()}
                style={[
                  MainStyles.buttonContainer,
                  this.state.loading
                    ? MainStyles.regularButtonDisabled
                    : MainStyles.regularButton,
                ]}
                disabled={this.state.loading}>
                <Text style={MainStyles.regularText}>Next</Text>
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
          )}
          {this.state.step === 2 && (
            <View>
              <View style={MainStyles.dropDownContainer}>
                <Picker
                  selectedValue={this.state.vacine}
                  style={[{width: '100%'}, MainStyles.inputs]}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({vacine: itemValue})
                  }>
                  <Picker.Item label="Choose vaccine..." value="" />
                  <Picker.Item label="Pfizer" value="Pfizer" />
                  <Picker.Item label="Astrazeneca" value="Astrazeneca" />
                  <Picker.Item label="Coronavac" value="Coronavac" />
                </Picker>
              </View>
              <View style={MainStyles.inputContainer}>
                <TextInputMask
                  style={MainStyles.inputs}
                  placeholder="Date First Dose"
                  type={'datetime'}
                  options={{
                    format: 'DD/MM/YYYY',
                  }}
                  value={this.state.date_first_dose}
                  onChangeText={(date_first_dose) => {
                    this.setState({
                      date_first_dose,
                    });
                  }}
                />
              </View>
              <View style={MainStyles.inputContainer}>
                <TextInputMask
                  style={MainStyles.inputs}
                  placeholder="Date Second Dose"
                  type={'datetime'}
                  options={{
                    format: 'DD/MM/YYYY',
                  }}
                  value={this.state.date_second_dose}
                  onChangeText={(date_second_dose) => {
                    this.setState({
                      date_second_dose,
                    });
                  }}
                />
              </View>
              <TouchableHighlight
                onPress={async () => await this.handleNextStep()}
                style={[
                  MainStyles.buttonContainer,
                  this.state.loading
                    ? MainStyles.regularButtonDisabled
                    : MainStyles.regularButton,
                ]}
                disabled={this.state.loading}>
                <Text style={MainStyles.regularText}>Next</Text>
              </TouchableHighlight>
            </View>
          )}
          {this.state.step === 3 && (
            <View style={{marginTop: 40}}>
              <TouchableOpacity
                style={[
                  MainStyles.selectContainer,
                  MainStyles.regularButton,
                  {
                    backgroundColor: this.state.cardiovascular
                      ? Colors.PURPLE
                      : 'white',
                  },
                ]}
                onPress={async () => {
                  this.setState({cardiovascular: !this.state.cardiovascular});
                }}>
                <Text
                  style={[
                    MainStyles.regularText,
                    {
                      color: !this.state.cardiovascular
                        ? Colors.PURPLE
                        : 'white',
                    },
                  ]}>
                  Cardiovascular desease
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  MainStyles.selectContainer,
                  MainStyles.regularButton,
                  {
                    backgroundColor: this.state.diabetis
                      ? Colors.PURPLE
                      : 'white',
                  },
                ]}
                onPress={async () => {
                  this.setState({diabetis: !this.state.diabetis});
                }}>
                <Text
                  style={[
                    MainStyles.regularText,
                    {
                      color: !this.state.diabetis ? Colors.PURPLE : 'white',
                    },
                  ]}>
                  Diabetis melitus
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  MainStyles.selectContainer,
                  MainStyles.regularButton,
                  {
                    backgroundColor: this.state.lung ? Colors.PURPLE : 'white',
                  },
                ]}
                onPress={async () => {
                  this.setState({lung: !this.state.lung});
                }}>
                <Text
                  style={[
                    MainStyles.regularText,
                    {
                      color: !this.state.lung ? Colors.PURPLE : 'white',
                    },
                  ]}>
                  Lung desease
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  MainStyles.selectContainer,
                  MainStyles.regularButton,
                  {
                    backgroundColor: this.state.cancer
                      ? Colors.PURPLE
                      : 'white',
                  },
                ]}
                onPress={async () => {
                  this.setState({cancer: !this.state.cancer});
                }}>
                <Text
                  style={[
                    MainStyles.regularText,
                    {
                      color: !this.state.cancer ? Colors.PURPLE : 'white',
                    },
                  ]}>
                  Cancer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  MainStyles.selectContainer,
                  MainStyles.regularButton,
                  {
                    backgroundColor: this.state.kidney
                      ? Colors.PURPLE
                      : 'white',
                  },
                ]}
                onPress={async () => {
                  this.setState({kidney: !this.state.kidney});
                }}>
                <Text
                  style={[
                    MainStyles.regularText,
                    {
                      color: !this.state.kidney ? Colors.PURPLE : 'white',
                    },
                  ]}>
                  Kidney desease
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  MainStyles.selectContainer,
                  MainStyles.regularButton,
                  {
                    backgroundColor: this.state.solid_organ
                      ? Colors.PURPLE
                      : 'white',
                  },
                ]}
                onPress={async () => {
                  this.setState({solid_organ: !this.state.solid_organ});
                }}>
                <Text
                  style={[
                    MainStyles.regularText,
                    {
                      color: !this.state.solid_organ ? Colors.PURPLE : 'white',
                    },
                  ]}>
                  Solid organ or hematopoietic {'\n'}stem cell transplantation
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  MainStyles.selectContainer,
                  MainStyles.regularButton,
                  {
                    backgroundColor: this.state.obesity
                      ? Colors.PURPLE
                      : 'white',
                  },
                ]}
                onPress={async () => {
                  this.setState({obesity: !this.state.obesity});
                }}>
                <Text
                  style={[
                    MainStyles.regularText,
                    {
                      color: !this.state.obesity ? Colors.PURPLE : 'white',
                    },
                  ]}>
                  Obesity
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  MainStyles.selectContainer,
                  MainStyles.regularButton,
                  {
                    backgroundColor: this.state.smoking
                      ? Colors.PURPLE
                      : 'white',
                  },
                ]}
                onPress={async () => {
                  this.setState({smoking: !this.state.smoking});
                }}>
                <Text
                  style={[
                    MainStyles.regularText,
                    {
                      color: !this.state.smoking ? Colors.PURPLE : 'white',
                    },
                  ]}>
                  Smoking
                </Text>
              </TouchableOpacity>

              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <View style={MainStyles.checkBoxContainer}>
                  <CheckBox
                    value={this.state.agreed}
                    onValueChange={(agreed) => this.setState({agreed})}
                    style={MainStyles.checkbox}
                    tintColors={{true: Colors.PURPLE, false: 'white'}}
                  />
                  <Text
                    style={[
                      MainStyles.regularText,
                      {
                        margin: 8,
                      },
                    ]}>
                    Do you agree to the{'\n'}
                    <Text style={{color: Colors.PURPLE}}>Terms of use</Text>?
                  </Text>
                </View>
              </View>
              <TouchableHighlight
                onPress={async () => await this.handleNextStep()}
                style={[
                  MainStyles.buttonContainer,
                  !this.state.agreed
                    ? MainStyles.regularButtonDisabled
                    : MainStyles.regularButton,
                ]}
                disabled={!this.state.agreed}>
                <Text style={MainStyles.regularText}>Finish</Text>
              </TouchableHighlight>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
