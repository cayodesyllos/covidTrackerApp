import React, {useEffect} from 'react';
import {View, Text, FlatList} from 'react-native';
import api from '../services/api';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBell} from '@fortawesome/free-solid-svg-icons';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import MainStyles from '../style/MainStyles';
import Colors from '../style/Colors';

const Notifications = (props) => {
  const [notifications, setNotifications] = React.useState([]);

  useEffect(() => {
    mountRequests();
  }, [props.updateNotifications]);

  const mountRequests = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.warn(error.message);
    }
  };

  const renderItem = ({item}) => (
    <View
      style={{
        width: '80%',
        height: 90,
        alignSelf: 'center',
        borderBottomColor: 'white',
        padding: 10,
        borderRadius: 10,
        borderWidth: 0,
        backgroundColor: Colors.DARK_GRAY,
        marginBottom: 10,
      }}>
      <TouchableWithoutFeedback
        onPress={() => {}}
        style={{flexDirection: 'column', justifyContent: 'space-evenly'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <FontAwesomeIcon
            style={{
              color: item.flag,
              fontSize: 40,
              alignSelf: 'center',
            }}
            size={40}
            icon={faBell}
          />
          <Text
            style={[
              MainStyles.regularText,
              {fontSize: 14, width: '80%', padding: 3},
            ]}>
            Someone infected crossed paths with you at {item.name} at{' '}
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>
        <Text style={[MainStyles.regularTextMini, {alignSelf: 'flex-end'}]}>
          {new Date(item.updated_at).toLocaleString()}
        </Text>
      </TouchableWithoutFeedback>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={MainStyles.container}>
      <View style={{height: '80%', width: '100%'}}>
        <FlatList
          style={{width: '100%'}}
          contentContainerStyle={{
            width: '100%',
            justifyContent: 'center',
          }}
          keyExtractor={(item) => item.id}
          data={notifications}
          renderItem={renderItem}
        />
      </View>
    </ScrollView>
  );
};

Notifications.propTypes = {};

export default Notifications;
