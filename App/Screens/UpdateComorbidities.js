import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  TouchableOpacity,
} from 'react-native';
import navigationService from '../services/NavigationService';
import MainStyles from '../style/MainStyles';
import Colors from '../style/Colors';
import api from '../services/api';

export default class UpdateComorbidities extends Component {
  state = {
    cardiovascular: false,
    diabetis: false,
    lung: false,
    cancer: false,
    kidney: false,
    solid_organ: false,
    obesity: false,
    smoking: false,
  };

  componentDidMount() {
    this.initialLoad();
  }

  initialLoad = async () => {
    const comorbidities = await api.get('/comorbity');
    this.setState(comorbidities.data);
  };

  update = async () => {
    await api.put('/comorbity', this.state);
  };

  render() {
    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          flex: 1,
        }}>
        <View
          style={{
            marginVertical: 20,
          }}>
          <Text style={MainStyles.TextTitle}>Update Comorbidities</Text>
        </View>

        <View style={{alignItems: 'center'}}>
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
                  color: !this.state.cardiovascular ? Colors.PURPLE : 'white',
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
                backgroundColor: this.state.diabetis ? Colors.PURPLE : 'white',
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
                backgroundColor: this.state.cancer ? Colors.PURPLE : 'white',
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
                backgroundColor: this.state.kidney ? Colors.PURPLE : 'white',
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
                backgroundColor: this.state.obesity ? Colors.PURPLE : 'white',
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
                backgroundColor: this.state.smoking ? Colors.PURPLE : 'white',
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
