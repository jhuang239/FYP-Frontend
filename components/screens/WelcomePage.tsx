import * as React from 'react';
import IMAGES from '../images';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  ImageBackground,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffedd5',
    flex: 1,
  },
  btn_group: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    height: height * 0.05,
    flex: 1,
  },
  title_container: {
    width: width * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    margin: 5,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  image_body: {
    margin: 20,
    width: width - 30,
    height: height * 0.7,
    borderRadius: 10,
    objectFit: 'cover',
    flex: 2,
  },
  btn_sign_in: {
    backgroundColor: '#0290bf',
    paddingHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.7,
  },
  btn_sign_up: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 20,
    margin: 10,
    borderColor: '#0290bf',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.7,
  },
  btn_text_sign_in: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  btn_text_sign_up: {
    color: '#0290bf',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

const WelcomePage = (props, {setUserData}) => {
  console.log('Welcome props', props);
  const navigator = props.navigation;
  return (
    <>
      <View style={styles.container}>
        {/* <View style={styles.title_container}>
                    <Text style={styles.title}>Welcome to our E-Learning application.</Text>
                    <Text style={styles.title}>Let's start your journey.</Text>
                </View> */}
        <ImageBackground source={IMAGES.WELCOME} style={styles.image_body} />
        <View style={styles.btn_group}>
          <TouchableOpacity
            style={styles.btn_sign_in}
            onPress={() => navigator.navigate('Login')}>
            <Text style={styles.btn_text_sign_in}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn_sign_up}
            onPress={() => navigator.navigate('SignUp')}>
            <Text style={styles.btn_text_sign_up}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default WelcomePage;
