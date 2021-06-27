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

export default class LongTerm extends Component {
  state = {
    user_id: null,
    infection_id: null,
    fatigue: false,
    dyspnea: false,
    chest_discomfort: false,
    cough: false,
    anosmia: false,
    other_physics: false,
    post_traumatic: false,
    impaired_memory: false,
    poor_concentration: false,
    anxiety_depression: false,
    other_neuro: false,
    long_term_status: null,
    step: 1,
  };

  componentDidMount() {
    this.setState({
      user_id: this.props.user_id,
      infection_id: this.props.infection_id,
      long_term_status: 'ANSWERED',
    });
  }

  saveInfo = async () => {
    const body = this.state;
    delete body.step;
    await api.post('/longterm', body);
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
          <Text style={MainStyles.TextTitle}>
            {this.state.step === 1
              ? 'Long term  physics symptoms'
              : 'Long term  neurocognitive and psychologic symptoms'}
          </Text>
        </View>
        {this.state.step === 1 ? (
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              style={[
                MainStyles.selectContainer,
                MainStyles.regularButton,
                {
                  backgroundColor: this.state.fatigue ? Colors.PURPLE : 'white',
                },
              ]}
              onPress={async () => {
                this.setState({fatigue: !this.state.fatigue});
              }}>
              <Text
                style={[
                  MainStyles.regularText,
                  {
                    color: !this.state.fatigue ? Colors.PURPLE : 'white',
                  },
                ]}>
                Fatigue
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                MainStyles.selectContainer,
                MainStyles.regularButton,
                {
                  backgroundColor: this.state.dyspnea ? Colors.PURPLE : 'white',
                },
              ]}
              onPress={async () => {
                this.setState({dyspnea: !this.state.dyspnea});
              }}>
              <Text
                style={[
                  MainStyles.regularText,
                  {
                    color: !this.state.dyspnea ? Colors.PURPLE : 'white',
                  },
                ]}>
                Dyspnea (labored breathing)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                MainStyles.selectContainer,
                MainStyles.regularButton,
                {
                  backgroundColor: this.state.chest_discomfort
                    ? Colors.PURPLE
                    : 'white',
                },
              ]}
              onPress={async () => {
                this.setState({chest_discomfort: !this.state.chest_discomfort});
              }}>
              <Text
                style={[
                  MainStyles.regularText,
                  {
                    color: !this.state.chest_discomfort
                      ? Colors.PURPLE
                      : 'white',
                  },
                ]}>
                Chest Discomfort
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                MainStyles.selectContainer,
                MainStyles.regularButton,
                {
                  backgroundColor: this.state.cough ? Colors.PURPLE : 'white',
                },
              ]}
              onPress={async () => {
                this.setState({cough: !this.state.cough});
              }}>
              <Text
                style={[
                  MainStyles.regularText,
                  {
                    color: !this.state.cough ? Colors.PURPLE : 'white',
                  },
                ]}>
                Cough
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                MainStyles.selectContainer,
                MainStyles.regularButton,
                {
                  backgroundColor: this.state.anosmia ? Colors.PURPLE : 'white',
                },
              ]}
              onPress={async () => {
                this.setState({anosmia: !this.state.anosmia});
              }}>
              <Text
                style={[
                  MainStyles.regularText,
                  {
                    color: !this.state.anosmia ? Colors.PURPLE : 'white',
                  },
                ]}>
                Anosmia (loss of smell)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                MainStyles.selectContainer,
                MainStyles.regularButton,
                {
                  backgroundColor: this.state.other_physics
                    ? Colors.PURPLE
                    : 'white',
                },
              ]}
              onPress={async () => {
                this.setState({other_physics: !this.state.other_physics});
              }}>
              <Text
                style={[
                  MainStyles.regularText,
                  {
                    color: !this.state.other_physics ? Colors.PURPLE : 'white',
                  },
                ]}>
                Other
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              style={[
                MainStyles.selectContainer,
                MainStyles.regularButton,
                {
                  backgroundColor: this.state.post_traumatic
                    ? Colors.PURPLE
                    : 'white',
                },
              ]}
              onPress={async () => {
                this.setState({post_traumatic: !this.state.post_traumatic});
              }}>
              <Text
                style={[
                  MainStyles.regularText,
                  {
                    color: !this.state.post_traumatic ? Colors.PURPLE : 'white',
                  },
                ]}>
                Post traumatic stress disorder
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                MainStyles.selectContainer,
                MainStyles.regularButton,
                {
                  backgroundColor: this.state.impaired_memory
                    ? Colors.PURPLE
                    : 'white',
                },
              ]}
              onPress={async () => {
                this.setState({impaired_memory: !this.state.impaired_memory});
              }}>
              <Text
                style={[
                  MainStyles.regularText,
                  {
                    color: !this.state.impaired_memory
                      ? Colors.PURPLE
                      : 'white',
                  },
                ]}>
                Impaired Memory
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                MainStyles.selectContainer,
                MainStyles.regularButton,
                {
                  backgroundColor: this.state.poor_concentration
                    ? Colors.PURPLE
                    : 'white',
                },
              ]}
              onPress={async () => {
                this.setState({
                  poor_concentration: !this.state.poor_concentration,
                });
              }}>
              <Text
                style={[
                  MainStyles.regularText,
                  {
                    color: !this.state.poor_concentration
                      ? Colors.PURPLE
                      : 'white',
                  },
                ]}>
                Poor Concentration
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                MainStyles.selectContainer,
                MainStyles.regularButton,
                {
                  backgroundColor: this.state.anxiety_depression
                    ? Colors.PURPLE
                    : 'white',
                },
              ]}
              onPress={async () => {
                this.setState({
                  anxiety_depression: !this.state.anxiety_depression,
                });
              }}>
              <Text
                style={[
                  MainStyles.regularText,
                  {
                    color: !this.state.anxiety_depression
                      ? Colors.PURPLE
                      : 'white',
                  },
                ]}>
                Anxiety or Depression
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                MainStyles.selectContainer,
                MainStyles.regularButton,
                {
                  backgroundColor: this.state.other_neuro
                    ? Colors.PURPLE
                    : 'white',
                },
              ]}
              onPress={async () => {
                this.setState({other_neuro: !this.state.other_neuro});
              }}>
              <Text
                style={[
                  MainStyles.regularText,
                  {
                    color: !this.state.other_neuro ? Colors.PURPLE : 'white',
                  },
                ]}>
                Other
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            height: 120,
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <TouchableHighlight
            style={[MainStyles.buttonContainer, MainStyles.regularButton]}
            onPress={async () => {
              if (this.state.step === 1) {
                this.setState({step: 2});
                return;
              }
              try {
                await this.saveInfo();
                navigationService.RootView();
              } catch (error) {
                alert('Network error');
              }
            }}>
            <Text style={MainStyles.regularText}>
              {this.state.step === 1 ? 'Next' : 'Save'}
            </Text>
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
