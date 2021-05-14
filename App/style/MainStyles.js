import {StyleSheet} from 'react-native';
import Colors from './Colors';

const styles = StyleSheet.create({
  icon: {
    width: 150,
    height: 150,
  },
  containerLogo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  selectContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 10,
  },
  regularButton: {
    backgroundColor: Colors.PURPLE,
  },
  regularText: {
    color: 'white',
    alignItems: 'center',
    fontSize: 16,
  },
  regularTextMini: {
    color: 'white',
    alignItems: 'center',
    fontSize: 12,
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  newsRow: {
    width: '100%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  newsCell: {
    width: '40%',
    backgroundColor: Colors.DARKER_GRAY,
    borderRadius: 3,
    height: 100,
    justifyContent: 'center',
  },

  newsCellSelected: {
    width: '40%',
    backgroundColor: Colors.DARK_GRAY,
    borderRadius: 3,
    height: 100,
    justifyContent: 'center',
  },
  newsText: {
    fontWeight: '900',
    fontSize: 18,
    color: Colors.LIGHT_GRAY,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  newsTextTitle: {
    fontWeight: '900',
    fontSize: 22,
    color: Colors.PURPLE,
    textAlign: 'center',
    textAlignVertical: 'top',
  },
});

export default styles;
