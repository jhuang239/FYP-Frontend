import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import IMAGES from '../images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosHeaders} from 'axios';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  label: {
    color: '#027ea8',
    margin: 20,
    marginLeft: 0,
  },
  btn_group: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: height * 0.05,
    margin: 20,
  },
  btn_sign_in: {
    backgroundColor: '#027ea8',
    paddingHorizontal: 90,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.7,
  },
  btn_text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
    padding: 8,
    backgroundColor: '#ffedd5',
  },
  textInputGroup: {
    margin: 20,
  },
  input: {
    height: 50,
    marginTop: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    color: '#333',
    fontSize: 16,
  },
  inputError: {
    borderBottomColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  image_container: {
    alignItems: 'center',
    textAlign: 'center',
  },
  image_body: {
    width: width - 20,
    height: height * 0.3,
    borderRadius: 10,
  },
});

type loginProps = {
  UpdateUserState: (user: any) => void;
};

const Login = ({UpdateUserState}: loginProps) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    console.log('data', data);
    const {username, password} = data;
    if (username == '' || password == '') return;
    const url = 'http://127.0.0.1:8000/auth/token';

    const headers: any = {
      'Content-Type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
    };

    try {
      const response = await axios
        .post(
          url,
          `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`,
          headers,
        )
        .then(async response => {
          await AsyncStorage.setItem(
            'userData',
            JSON.stringify({
              username: username,
              token: response.data.access_token,
            }),
          ).then(() => {
            UpdateUserState({
              username: username,
              token: response.data.access_token,
            });
          });
        });
    } catch (err) {
      console.log('err', err);
      Alert.alert('Login Failed', 'Please check your username and password');
    }
  };

  const handleBlurUsername = () => {
    handleSubmit(data => console.log(data))();
  };

  const handleBlurPassword = () => {
    handleSubmit(data => console.log(data))();
  };

  console.log('errors', errors);

  return (
    <View style={styles.container}>
      <View style={styles.image_container}>
        <Image source={IMAGES.PAGE3} style={styles.image_body} />
      </View>
      {/* <Text style={styles.label}>Username</Text> */}
      <View style={styles.textInputGroup}>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={[styles.input, errors.username && styles.inputError]}
              onChangeText={onChange}
              value={value}
              placeholder="Username"
              placeholderTextColor="#999"
              onBlur={handleBlurUsername}
            />
          )}
          name="username"
          rules={{required: true}}
        />
        {errors.username && (
          <Text style={styles.errorText}>Username is required</Text>
        )}

        {/* <Text style={styles.label}>Password</Text> */}
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              secureTextEntry
              style={[styles.input, errors.password && styles.inputError]}
              onChangeText={onChange}
              value={value}
              placeholder="Password"
              placeholderTextColor="#999"
              onBlur={handleBlurPassword}
            />
          )}
          name="password"
          rules={{required: true}}
        />
        {errors.password && (
          <Text style={styles.errorText}>Password is required</Text>
        )}
      </View>

      <View style={styles.btn_group}>
        {/* <TouchableOpacity
          style={styles.btn_sign_up}
          onPress={() => reset({ username: "", password: "" })}
        >
          <Text style={styles.btn_text}>Reset</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.btn_sign_in}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.btn_text}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
