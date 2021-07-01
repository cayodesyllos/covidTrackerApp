import React, {useEffect, useCallback} from 'react';
import {View, TouchableOpacity, Text, Dimensions} from 'react-native';
import api from '../services/api';
import MainStyles from '../style/MainStyles';
import Colors from '../style/Colors';
import {LineChart} from 'react-native-chart-kit';
import PropTypes from 'prop-types';

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
  }, [mountRequests]);

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

  const mountRequests = useCallback(async () => {
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
  }, []);

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

CovidData.propTypes = {};

export default CovidData;
