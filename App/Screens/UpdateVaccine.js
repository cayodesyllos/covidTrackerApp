import React, {Component} from 'react';
import {View} from 'react-native';
import {StyleSheet, TouchableHighlight, Text, Picker} from 'react-native';
import navigationService from '../services/NavigationService';
import MainStyles from '../style/MainStyles';
import api from '../services/api';
import {TextInputMask} from 'react-native-masked-text';
import AsyncStorage from '@react-native-community/async-storage';

export default class UpdateVaccine extends Component {
  state = {
    vacine: '',
    date_first_dose: '',
    date_second_dose: '',
  };

  componentDidMount() {
    this.initialLoad();
  }

  initialLoad = async () => {
    const response = await api.get('/vacine');
    this.setState(response.data);
  };

  update = async () => {
    await api.put('/vacine', this.state);
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
          <Text style={MainStyles.TextTitle}>Update Vaccine</Text>
        </View>

        <View style={{alignItems: 'center'}}>
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
