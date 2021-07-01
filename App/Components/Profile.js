import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import navigationService from '../services/NavigationService';
import MainStyles from '../style/MainStyles';
import Colors from '../style/Colors';
import PropTypes from 'prop-types';

const Profile = (props) => {
  return (
    <View
      style={[
        MainStyles.container,
        {justifyContent: 'space-between', flexDirection: 'column'},
      ]}>
      <View style={{marginTop: 30}}>
        <Text style={[MainStyles.regularText, {marginBottom: 15}]}>Status</Text>
        <TouchableOpacity
          style={[
            MainStyles.selectContainer,
            MainStyles.regularButton,
            {
              backgroundColor:
                props.healthStatus === 1 ? Colors.PURPLE : 'white',
            },
          ]}
          onPress={async () => {
            if (props.healthStatus === 2) {
              await props.changeStatus(1);
              navigationService.CovidSeverity();
            }
          }}>
          <Text
            style={[
              MainStyles.regularText,
              {color: props.healthStatus === 2 ? Colors.PURPLE : 'white'},
            ]}>
            Healthy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            MainStyles.selectContainer,
            MainStyles.regularButton,
            {
              backgroundColor:
                props.healthStatus === 2 ? Colors.PURPLE : 'white',
            },
          ]}
          onPress={async () => {
            await props.changeStatus(2);
          }}>
          <Text
            style={[
              MainStyles.regularText,
              {color: props.healthStatus === 1 ? Colors.PURPLE : 'white'},
            ]}>
            Infected
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{marginTop: 30}}>
        <Text style={[MainStyles.regularText, {marginBottom: 15}]}>
          Personal info
        </Text>
        <TouchableOpacity
          style={[MainStyles.buttonContainer, MainStyles.regularButton, {}]}
          onPress={async () => {
            navigationService.UpdateComorbidities();
          }}>
          <Text style={MainStyles.regularText}>Update comorbidities</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[MainStyles.buttonContainer, MainStyles.regularButton, {}]}
          onPress={async () => {
            navigationService.UpdateVaccine();
          }}>
          <Text style={MainStyles.regularText}>Update Vaccine</Text>
        </TouchableOpacity>
      </View>

      <View style={{marginBottom: 30}}>
        <TouchableOpacity
          style={[
            MainStyles.buttonContainer,
            MainStyles.regularButtonSecondary,
            {},
          ]}
          onPress={async () => {
            await props.logout();
          }}>
          <Text style={MainStyles.regularTextSecondary}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => {}}>
          <Text style={[MainStyles.regularText, {textAlign: 'center'}]}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

Profile.propTypes = {
  logout: PropTypes.func,
  changeStatus: PropTypes.func,
  healthStatus: PropTypes.number,
};

export default Profile;
