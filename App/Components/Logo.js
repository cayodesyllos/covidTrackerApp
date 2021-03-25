import React, {Component} from 'react';
import {Text, View} from 'react-native';
import Colors from '../style/Colors';
import {StyleSheet} from 'react-native';

class Logo extends Component {
  render() {
    return (
      <View>
        <Text style={styles.text}>CovidTracker</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    color: Colors.PURPLE,
    fontWeight: 'bold',
  },
});

export default Logo;
