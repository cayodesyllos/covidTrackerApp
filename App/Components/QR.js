import React, {useEffect, useState} from 'react';
import QRCode from 'react-native-qrcode-generator';
import api from '../services/api';
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  FlatList,
  Platform,
  ScrollView,
} from 'react-native';
import Colors from '../style/Colors';
import MainStyles from '../style/MainStyles';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faQrcode} from '@fortawesome/free-solid-svg-icons';
import prompt from 'react-native-prompt-android';
import PropTypes from 'prop-types';

const QR = (props) => {
  const [locations, setLocations] = React.useState([]);
  const [selectedQr, setSelectedQr] = React.useState(null);
  const [token, setToken] = React.useState(null);
  useEffect(() => {
    mountRequests();
  }, []);

  const mountRequests = async () => {
    const response = await api.get('/locations');
    setLocations(response.data);
  };

  const createLocation = async (name) => {
    console.warn(name);
    try {
      const response = await api.post('/location', {name: name});
      setLocations([response.data, ...locations]);
      setSelectedQr(`covidtracker://${response.data.token}`);
      setToken(response.data.token);
    } catch (error) {
      alert(error.response.data.error.message);
    }
  };

  const autoCheckin = async () => {
    try {
      await api.post('/checkin', {token: token});
      props.setCheckedIn(!props.checkedIn);
      alert('You checked-in successfully!');
    } catch (error) {
      alert(error.response.data.error.message);
    }
  };

  const renderItem = ({item}) => (
    <View
      style={{
        width: '80%',
        height: 60,
        alignSelf: 'center',
        borderBottomColor: 'white',
        padding: 10,
        borderRadius: 10,
        borderWidth: 0,
        backgroundColor: Colors.DARK_GRAY,
        marginBottom: 10,
      }}>
      <TouchableOpacity
        onPress={() => {
          setSelectedQr(`covidtracker://${item.token}`);
          console.log('RRR', item.token, item.created_at);
          setToken(item.token);
        }}
        style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <FontAwesomeIcon
          style={{
            color: 'white',
            fontSize: 40,
            alignSelf: 'flex-start',
          }}
          size={40}
          icon={faQrcode}
        />
        <Text style={MainStyles.regularText}>{item.name}</Text>
        <Text style={[MainStyles.regularTextMini, {alignSelf: 'flex-end'}]}>
          {item.created_at}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={MainStyles.container}>
      {selectedQr !== null ? (
        <QRCode value={selectedQr} size={200} bgColor="black" fgColor="white" />
      ) : (
        <View
          style={{
            width: 200,
            height: 200,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'white',
          }}
        />
      )}
      <View>
        <TouchableOpacity
          style={[MainStyles.buttonContainer, MainStyles.regularButton, {}]}
          onPress={() => {
            Platform.OS === 'ios'
              ? Alert.prompt(
                  'Create location',
                  'Input the name of the location',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Create',
                      onPress: (name) => createLocation(name),
                    },
                  ],
                )
              : prompt('Create location', 'Input the name of the location', [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'Create',
                    onPress: (name) => createLocation(name),
                  },
                ]);
          }}>
          <Text style={MainStyles.regularText}>Generate code</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[MainStyles.buttonContainer, MainStyles.regularButton, {}]}
          onPress={autoCheckin}>
          <Text style={MainStyles.regularText}>Auto check-in</Text>
        </TouchableOpacity>
      </View>

      <View style={{height: 200, width: '100%'}}>
        <FlatList
          style={{width: '100%'}}
          contentContainerStyle={{
            width: '100%',
            justifyContent: 'center',
          }}
          data={locations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </ScrollView>
  );
};

QR.propTypes = {
  setCheckedIn: PropTypes.func,
  checkedIn: PropTypes.bool,
};

export default QR;
