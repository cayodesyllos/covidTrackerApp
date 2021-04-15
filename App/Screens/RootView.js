import React, {useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Alert,
  Linking,
  FlatList,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {StyleSheet} from 'react-native';
import navigationService from '../services/NavigationService';
import api from '../services/api';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faQrcode,
  faMapMarkerAlt,
  faBell,
  faUser,
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
import QRCode from 'react-native-qrcode-generator';

const QR = (props) => {
  const [locations, setLocations] = React.useState([]);
  const [selectedQr, setSelectedQr] = React.useState(null);
  useEffect(() => {
    mountRequests();
  }, []);

  const mountRequests = async () => {
    const response = await api.get('/locations');
    setLocations(response.data);
  };

  const createdLocation = async (name) => {
    const response = await api.post('/location', {name: name});
    setLocations([response.data, ...locations]);
    setSelectedQr(`covidtracker://${response.data.token}`);
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
        onPress={() => {
          setSelectedQr(`covidtracker://${item.token}`);
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
          {new Date(item.created_at).toLocaleString()}
        </Text>
      </TouchableWithoutFeedback>
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

      <TouchableOpacity
        style={[MainStyles.buttonContainer, MainStyles.regularButton, {}]}
        onPress={() => {
          Alert.prompt('Create location', 'Input the name of the location', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Create',
              onPress: (name) => createdLocation(name),
            },
          ]);
        }}>
        <Text style={MainStyles.regularText}>Generate code</Text>
      </TouchableOpacity>

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
            await props.changeStatus(1);
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
      <View style={{marginBottom: 30}}>
        <TouchableOpacity
          style={[MainStyles.buttonContainer, MainStyles.regularButton, {}]}
          onPress={async () => {
            await props.logout();
          }}>
          <Text style={MainStyles.regularText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            navigationService.SignUp();
          }}>
          <Text style={[MainStyles.regularText, {textAlign: 'center'}]}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Locations = (props) => {
  const [baseCheckins, setBaseCheckins] = React.useState([]);
  const [checkins, setCheckins] = React.useState([]);
  const [search, setSearch] = React.useState([]);

  useEffect(() => {
    mountRequests();
  }, []);

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
        onPress={() => {
          console.warn('open');
        }}
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

const Notifications = (props) => {
  return <ScrollView contentContainerStyle={MainStyles.container} />;
};

const CustomTab = (props) => {
  const [activeIndex, setActiveIndex] = React.useState(1);

  const handleIndexChange = (index) => {
    props.goToPage(index);
  };

  useEffect(() => {
    if (props.currentTab !== activeIndex) {
      setActiveIndex(props.currentTab);
    }
  }, [props.currentTab, activeIndex, setActiveIndex]);

  return (
    <View style={{}}>
      <View>
        <SafeAreaView style={{flex: 0, backgroundColor: 'black'}} />
        <StatusBar barStyle="light-content" />
      </View>

      <View style={[styles.header]}>
        <View style={[styles.headerAnimated]}>
          <Text
            style={[styles.Btn]}
            onPress={() => {
              handleIndexChange(0);
            }}>
            <FontAwesomeIcon
              style={{
                color: activeIndex === 0 ? Colors.PURPLE : 'white',
                fontSize: activeIndex === 0 ? 45 : 30,
                alignSelf: 'center',
              }}
              size={32}
              icon={faUser}
            />
          </Text>

          <Text
            onPress={() => {
              handleIndexChange(1);
            }}
            style={[styles.Btn]}>
            <FontAwesomeIcon
              style={{
                color: activeIndex === 1 ? Colors.PURPLE : 'white',
              }}
              size={32}
              icon={faQrcode}
            />
          </Text>

          <Text
            style={[styles.Btn]}
            onPress={() => {
              handleIndexChange(2);
            }}>
            <FontAwesomeIcon
              style={{
                color: activeIndex === 2 ? Colors.PURPLE : 'white',
              }}
              size={32}
              icon={faMapMarkerAlt}
            />
          </Text>
          <Text
            style={[styles.Btn]}
            onPress={() => {
              handleIndexChange(3);
            }}>
            <FontAwesomeIcon
              style={{
                color: activeIndex === 3 ? Colors.PURPLE : 'white',
              }}
              size={32}
              icon={faBell}
            />
          </Text>
        </View>
      </View>
    </View>
  );
};

const RootView = (props) => {
  const [currTab, setCurrTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = React.useState(1);

  useEffect(() => {
    Linking.addEventListener('url', handleOpenURL);
    handleInitialLoad();
  }, []);

  const handleOpenURL = async (event) => {
    const parts = event.url.split('//');
    const token = parts[1];
    try {
      console.log(parts, 'oo');
      const response = await api.post('/checkin', {token: token});
      alert(`Checked in at ${response.data.location_name}`);
    } catch (error) {
      console.warn(error.message);
      alert('Error checking in');
    }
  };

  const handleInitialLoad = async () => {
    setLoading(false);
  };

  const changeStatus = (status) => {
    setHealthStatus(status);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigationService.Initial();
  };

  const goToPage = (index) => {
    this.tabbar.goToPage(index);
  };

  return (
    <ScrollableTabView
      onScroll={(value) => setCurrTab(value)}
      ref={(component) => (tabbar = component)}
      initialPage={1}
      renderTabBar={() => (
        <CustomTab goToPage={goToPage} currentTab={currTab} />
      )}
      prerenderingSiblingsNumber={1}>
      <Profile
        logout={handleLogout}
        changeStatus={changeStatus}
        healthStatus={healthStatus}
        componentId={props.componentId}
      />
      <QR componentId={props.componentId} />
      <Locations componentId={props.componentId} />
      <Notifications componentId={props.componentId} />
    </ScrollableTabView>
  );
};

export default RootView;

const styles = StyleSheet.create({
  Btn: {
    width: 32,
    height: 32,
    textAlign: 'center',
  },
  header: {
    backgroundColor: 'black',
    marginTop: 0,
    width: '100%',
    height: 70, // it was 70 before
    maxHeight: 70,
    zIndex: 0,
  },
  headerAnimated: {
    width: '100%',
    height: 70, // it was 70 before
    maxHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 15,
  },
});
