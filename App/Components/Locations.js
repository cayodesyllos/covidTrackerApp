import React, {useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  FlatList,
  TextInput,
} from 'react-native';
import api from '../services/api';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faSearch,
  faFilter,
  faLocationArrow,
} from '@fortawesome/free-solid-svg-icons';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import MainStyles from '../style/MainStyles';
import Colors from '../style/Colors';
import PropTypes from 'prop-types';

const Locations = (props) => {
  const [baseCheckins, setBaseCheckins] = React.useState([]);
  const [checkins, setCheckins] = React.useState([]);
  const [search, setSearch] = React.useState([]);

  useEffect(() => {
    mountRequests();
  }, [props.checkedIn]);

  useEffect(() => {}, [checkins]);

  const mountRequests = async () => {
    const response = await api.get('/checkins');
    setCheckins(response.data);
    setBaseCheckins(response.data);
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
      <TouchableWithoutFeedback
        onPress={() => {}}
        style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <FontAwesomeIcon
          style={{
            color: item.flag,
            fontSize: 40,
            alignSelf: 'flex-start',
          }}
          size={40}
          icon={faLocationArrow}
        />
        <Text style={MainStyles.regularText}>{item.name}</Text>
        <Text style={[MainStyles.regularTextMini, {alignSelf: 'flex-end'}]}>
          {new Date(item.created_at).toLocaleString()}
        </Text>
      </TouchableWithoutFeedback>
    </View>
  );

  const applySearch = () => {
    if (search.length === 0) {
      return;
    }
    const exp = new RegExp(search);
    const newCheckin = baseCheckins.filter((elem) => elem.name.match(exp));
    setCheckins(newCheckin);
  };

  const clearSearch = () => {
    setSearch('');
    setCheckins(baseCheckins);
  };

  const filterByGreenFlag = () => {
    const exp = new RegExp('green');
    const newCheckin = [...baseCheckins].filter((elem) => elem.flag.match(exp));
    setCheckins(newCheckin);
  };

  const filterByRedFlag = () => {
    const exp = new RegExp('red');
    const newCheckin = [...baseCheckins].filter((elem) => elem.flag.match(exp));
    setCheckins(newCheckin);
  };

  const orderByCheckinDateAsc = () => {
    const newCheckin = [...baseCheckins].sort((elem1, elem2) =>
      elem1.created_at > elem2.created_at
        ? 1
        : elem1.created_at < elem2.created_at
        ? -1
        : 0,
    );
    console.warn(newCheckin);
    setCheckins(newCheckin);
  };

  const orderByCheckinDateDesc = () => {
    const newCheckin = [...baseCheckins].sort((elem1, elem2) =>
      elem1.created_at < elem2.created_at
        ? 1
        : elem1.created_at > elem2.created_at
        ? -1
        : 0,
    );
    console.warn(newCheckin);
    setCheckins(newCheckin);
  };

  const showFilterAlert = () => {
    Alert.alert('Sort and Filtering', 'Select one', [
      {text: 'Filter by green flag', onPress: () => filterByGreenFlag()},
      {text: 'Filter by red flag', onPress: () => filterByRedFlag()},
      {
        text: 'Order by date ascending',
        onPress: () => orderByCheckinDateAsc(),
      },
      {
        text: 'Order by date descending',
        onPress: () => orderByCheckinDateDesc(),
      },
      {
        text: 'Reset',
        onPress: () => clearSearch(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={MainStyles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}>
        <View style={{width: '70%', flexDirection: 'row'}}>
          <View style={[MainStyles.inputContainer]}>
            <TextInput
              style={MainStyles.inputs}
              placeholder="search..."
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              value={search}
              onChangeText={(text) => setSearch(text)}
            />
            {search.length > 0 && (
              <TouchableOpacity
                onPress={clearSearch}
                style={{
                  right: 60,
                }}>
                <Text style={{color: 'blue'}}>clear</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={applySearch}
            style={{
              width: 50,
              height: 45,
              padding: 4,
              zIndex: 999,
              right: 50,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              borderLeftWidth: 1,
              borderLeftColor: 'black',
              alignItems: 'center',
            }}>
            <FontAwesomeIcon
              style={{
                color: 'black',
                fontSize: 32,
                alignSelf: 'center',
              }}
              size={32}
              icon={faSearch}
            />
          </TouchableOpacity>
        </View>
        <View style={{width: '10%'}}>
          <TouchableOpacity
            onPress={showFilterAlert}
            style={{
              width: 50,
              height: 45,
              padding: 4,
              alignItems: 'center',
            }}>
            <FontAwesomeIcon
              style={{
                color: 'white',
                fontSize: 32,
                alignSelf: 'center',
              }}
              size={32}
              icon={faFilter}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{height: '80%', width: '100%'}}>
        <FlatList
          style={{width: '100%'}}
          contentContainerStyle={{
            width: '100%',
            justifyContent: 'center',
          }}
          keyExtractor={(item) => item.id}
          data={checkins}
          renderItem={renderItem}
        />
      </View>
    </ScrollView>
  );
};

Locations.propTypes = {
  logout: PropTypes.func,
  changeStatus: PropTypes.func,
  healthStatus: PropTypes.number,
};

export default Locations;
