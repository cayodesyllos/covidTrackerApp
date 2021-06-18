import React, {Component} from 'react';
import {View} from 'react-native';
import {
  StyleSheet,
  TouchableHighlight,
  Text,
  TouchableOpacity,
} from 'react-native';
import navigationService from '../services/NavigationService';
import MainStyles from '../style/MainStyles';
import api from '../services/api';
import Colors from '../style/Colors';

export default class UpdateVaccine extends Component {
  state = {
    severity: '',
  };

  componentDidMount() {}

  update = async () => {
    await api.put('/infection', this.state);
  };

  render() {
    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          flex: 1,
        }}>
        <View style={{height: 100}}>
          <Text style={MainStyles.TextTitle}>Disease severity</Text>
        </View>

        <View style={{paddingHorizontal: 20, textAlign: 'left'}}>
          <Text style={MainStyles.regularText}>
            We are glad to know that you are healthy again! Could you tell us
            more about the severeness of your disease?
          </Text>
        </View>

        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            style={[
              MainStyles.selectContainerBig,
              MainStyles.regularButton,
              {
                backgroundColor:
                  this.state.severity === 'MILD' ? Colors.PURPLE : 'white',
              },
            ]}
            onPress={async () => {
              this.setState({severity: 'MILD'});
            }}>
            <Text
              style={[
                MainStyles.regularText,
                {
                  color:
                    this.state.severity !== 'MILD' ? Colors.PURPLE : 'white',
                },
              ]}>
              Mild disease
            </Text>
            <Text
              style={[
                MainStyles.regularTextMini,
                {
                  color:
                    this.state.severity !== 'MILD' ? Colors.PURPLE : 'white',
                },
              ]}>
              No or mild pneumonia
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              MainStyles.selectContainerBig,
              MainStyles.regularButton,
              {
                backgroundColor:
                  this.state.severity === 'SEVERE' ? Colors.PURPLE : 'white',
              },
            ]}
            onPress={async () => {
              this.setState({severity: 'SEVERE'});
            }}>
            <Text
              style={[
                MainStyles.regularText,
                {
                  color:
                    this.state.severity !== 'SEVERE' ? Colors.PURPLE : 'white',
                },
              ]}>
              Severe disease
            </Text>
            <Text
              style={[
                MainStyles.regularTextMini,
                {
                  color:
                    this.state.severity !== 'SEVERE' ? Colors.PURPLE : 'white',
                },
              ]}>
              Needed Oxygen
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              MainStyles.selectContainerBig,
              MainStyles.regularButton,
              {
                backgroundColor:
                  this.state.severity === 'CRITICAL' ? Colors.PURPLE : 'white',
              },
            ]}
            onPress={async () => {
              this.setState({severity: 'CRITICAL'});
            }}>
            <Text
              style={[
                MainStyles.regularText,
                {
                  color:
                    this.state.severity !== 'CRITICAL'
                      ? Colors.PURPLE
                      : 'white',
                },
              ]}>
              Critical disease
            </Text>
            <Text
              style={[
                MainStyles.regularTextMini,
                {
                  color:
                    this.state.severity !== 'CRITICAL'
                      ? Colors.PURPLE
                      : 'white',
                },
              ]}>
              Went to ICU
            </Text>
          </TouchableOpacity>
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
              try {
                await this.update();
                navigationService.RootView();
              } catch (error) {
                alert('Network error');
              }
            }}>
            <Text style={MainStyles.regularText}>Save</Text>
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
