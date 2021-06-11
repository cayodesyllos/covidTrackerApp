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
  Platform,
  Dimensions,
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
  faNewspaper,
} from '@fortawesome/free-solid-svg-icons';
import {
  ScrollView,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
} from 'react-native-gesture-handler';
import MainStyles from '../style/MainStyles';
import Colors from '../style/Colors';
import QRCode from 'react-native-qrcode-generator';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import prompt from 'react-native-prompt-android';

PushNotification.configure({
  onNotification: function (notification) {
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  requestPermissions: true,
  smallIcon: 'ic_notification',
  largeIcon: '',
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
});

PushNotification.createChannel(
  {
    channelId: 'my-channel', // (required)
    channelName: 'My channel', // (required)
  },
  (created) => console.log(`CreateChannel returned '${created}'`),
);

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

  const createdLocation = async (name) => {
    const response = await api.post('/location', {name: name});
    setLocations([response.data, ...locations]);
    setSelectedQr(`covidtracker://${response.data.token}`);
    setToken(response.data.token);
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
                      onPress: (name) => createdLocation(name),
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
                    onPress: (name) => createdLocation(name),
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

const CovidData = (props) => {
  const [numCases, setNumCases] = React.useState(null);
  const [numDeaths, setNumDeaths] = React.useState(null);
  const [newDeaths, setNewDeaths] = React.useState(null);
  const [newCases, setNewCases] = React.useState(null);
  const [labels, setLabels] = React.useState([]);
  const [data1, setData1] = React.useState([]);
  const [data2, setData2] = React.useState([]);
  const [data3, setData3] = React.useState([]);
  const [data4, setData4] = React.useState([]);
  const [chart, setChart] = React.useState(1);

  useEffect(() => {
    mountRequests();
  }, []);

  useEffect(() => {}, [chart]);

  const convertToThousand = (num) => {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million
    } else if (num < 900) {
      return num; // if value < 1000, nothing to do
    }
  };

  const todaysDate = () => {
    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  };

  const mountRequests = async () => {
    try {
      const options = {
        method: 'GET',
        url: 'https://covid-193.p.rapidapi.com/history',
        params: {country: 'brazil', day: todaysDate()},
        headers: {
          'x-rapidapi-key':
            '59b3728935msh886e2653ed04c92p161baejsna7cfbaac0a2b',
          'x-rapidapi-host': 'covid-193.p.rapidapi.com',
        },
      };

      api
        .request(options)
        .then(function (response) {
          const data = response.data.response[0];
          console.log(data);
          setNumCases(data.cases.total);
          setNewCases(data.cases.new);
          setNumDeaths(data.deaths.total);
          setNewDeaths(data.deaths.new);
        })
        .catch(function (error) {
          console.error(error);
        });

      const options_all = {
        method: 'GET',
        url: 'https://api.covid19api.com/dayone/country/brazil',
      };

      api.request(options_all).then(async (response) => {
        const data_filtered = await response.data.filter(
          (e) => e.Date.split('T')[0].split('-')[2] === '01',
        );

        const labels_ = await data_filtered.map((e) => e.Date.split('T')[0]);

        const data1_ = await data_filtered.map((e) => e.Confirmed);
        const data2_ = await data_filtered.map((e) => e.Deaths);
        const data3_ = await data_filtered.map((e, index) => {
          return index > 0
            ? e.Confirmed - data_filtered[index - 1].Confirmed
            : e.Confirmed;
        });
        const data4_ = await data_filtered.map((e, index) => {
          return index > 0
            ? e.Deaths - data_filtered[index - 1].Deaths
            : e.Deaths;
        });

        setLabels(labels_);
        setData1(data1_);
        setData2(data2_);
        setData3(data3_);
        setData4(data4_);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const numberWithCommas = (number) => {
    try {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } catch (error) {
      return 0;
    }
  };

  return (
    <View contentContainerStyle={MainStyles.container}>
      <View style={{height: 20}} />
      <View style={MainStyles.newsRow}>
        <TouchableOpacity
          onPress={() => setChart(1)}
          style={
            chart === 1 ? MainStyles.newsCellSelected : MainStyles.newsCell
          }>
          <Text style={MainStyles.newsTextTitle}>Total cases</Text>
          <Text style={MainStyles.newsText}>{numberWithCommas(numCases)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setChart(2)}
          style={
            chart === 2 ? MainStyles.newsCellSelected : MainStyles.newsCell
          }>
          <Text style={MainStyles.newsTextTitle}>Total deaths</Text>
          <Text style={MainStyles.newsText}>{numberWithCommas(numDeaths)}</Text>
        </TouchableOpacity>
      </View>
      <View style={{height: 20}} />
      <View style={MainStyles.newsRow}>
        <TouchableOpacity
          onPress={() => setChart(3)}
          style={
            chart === 3 ? MainStyles.newsCellSelected : MainStyles.newsCell
          }>
          <Text style={MainStyles.newsTextTitle}>New cases</Text>
          <Text style={MainStyles.newsText}>{numberWithCommas(newCases)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setChart(4)}
          style={
            chart === 4 ? MainStyles.newsCellSelected : MainStyles.newsCell
          }>
          <Text style={MainStyles.newsTextTitle}>New deaths</Text>
          <Text style={MainStyles.newsText}>{numberWithCommas(newDeaths)}</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{flexDirection: 'row', justifyContent: 'center', marginTop: 50}}>
        {labels.length > 0 && data1.length > 0 && (
          <LineChart
            data={{
              labels: labels,
              datasets: [
                {
                  data:
                    chart === 1
                      ? data1
                      : chart === 2
                      ? data2
                      : chart === 3
                      ? data3
                      : data4,
                },
              ],
            }}
            width={Dimensions.get('window').width * 0.9} // from react-native
            height={300}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            formatXLabel={(e) => {
              const part1 = e.split('-')[1];
              const part2 = e.split('-')[0];
              const resp = parseInt(part1) % 4 === 0 ? part1 + '/' + part2 : '';
              return resp;
            }}
            formatYLabel={(e) => {
              return convertToThousand(e);
            }}
            chartConfig={{
              backgroundColor: Colors.PURPLE,
              backgroundGradientFrom: Colors.PURPLE_LIGHT,
              backgroundGradientTo: Colors.PURPLE_DARK,
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={{
              marginVertical: 1,
              borderRadius: 16,
            }}
          />
        )}
      </View>
    </View>
  );
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
              icon={faNewspaper}
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
              icon={faMapMarkerAlt}
            />
          </Text>
          <Text
            style={[styles.Btn]}
            onPress={() => {
              handleIndexChange(4);
            }}>
            <FontAwesomeIcon
              style={{
                color: activeIndex === 4 ? Colors.PURPLE : 'white',
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
  const [checkedIn, setCheckedIn] = useState(false);
  const [healthStatus, setHealthStatus] = React.useState(1);
  const [updateNotifications, setUpdateNotifications] = React.useState(false);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      try {
        PushNotification.localNotification({
          channelId: 'my-channel',
          title: remoteMessage.notification.title,
          message: remoteMessage.notification.body,
        });
        setUpdateNotifications(!updateNotifications);
      } catch (err) {}
    });
    notificationsSetUp();
    handleInitialLoad();
    return unsubscribe;
  }, []);

  useEffect(() => {
    Linking.addEventListener('url', handleOpenURL);
    return () => Linking.removeAllListeners('url');
  }, []);

  const notificationsSetUp = async () => {
    console.disableYellowBox = true;
    PushNotification.requestPermissions();
    await messaging().requestPermission();

    // Get the device token
    await messaging()
      .getToken()
      .then(async (token) => {
        await api.put('/user', {fcm_token: token});
      });

    // Listen to whether the token changes
    messaging().onTokenRefresh(async (token) => {
      await api.put('/user', {fcm_token: token});
    });
  };

  const handleOpenURL = async (event) => {
    const parts = event.url.split('//');
    const token = parts[1];
    try {
      const response = await api.post('/checkin', {token: token});
      alert(`Checked in at ${response.data.location_name}`);
      setCheckedIn(!checkedIn);
    } catch (error) {
      alert(error.response.data.error.message);
    }
    setCheckedIn(false);
  };

  const handleInitialLoad = async () => {
    const response = await api.get('/user');
    setHealthStatus(response.data.infected ? 2 : 1);
    setLoading(false);
  };

  const changeStatus = async (status) => {
    try {
      await api.put('/user', {infected: status === 2});
      setHealthStatus(status);
    } catch (error) {
      alert('Error changing status');
    }
  };

  const handleLogout = async () => {
    await api.put('/user', {fcm_token: ' '});
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
      <QR
        setCheckedIn={setCheckedIn}
        checkedIn={checkedIn}
        componentId={props.componentId}
      />
      <CovidData componentId={props.componentId} />
      <Locations checkedIn={checkedIn} componentId={props.componentId} />
      <Notifications
        updateNotifications={updateNotifications}
        componentId={props.componentId}
      />
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
