import * as React from 'react';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import IMAGES from '../images';
import axios from 'axios';
import Login from './Login';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  label: {
    color: 'white',
    margin: 20,
    marginLeft: 0,
  },
  btn_group: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    height: height * 0.05,
    marginTop: 20,
  },
  btn_sign_in: {
    backgroundColor: '#00BFFF',
    paddingHorizontal: 20,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    width: width * 0.4,
  },
  btn_sign_up: {
    backgroundColor: '#72A0C1',
    paddingHorizontal: 20,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    width: width * 0.4,
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
    backgroundColor: '#008B8B',
  },
  input: {
    backgroundColor: 'white',
    height: 40,
    padding: 10,
    borderRadius: 4,
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

type RootStackParamList = {
  Home: undefined;
  Login: {};
};

type LoginScreenNavigationProp = NavigationProp<RootStackParamList, 'Login'>;

type SignUpProps = {};

const SignUp = () => {
  //const navigator = props.navigation;

  const navigator = useNavigation<LoginScreenNavigationProp>();

  const {
    handleSubmit,
    control,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      Name: '',
      Email: '',
      Phone: '',
      Birthday: '',
    },
  });

  const onSubmit = async (data: any) => {
    console.log('data', data);
    //const {username, password, confirmPassword, Name, Email, Phone, Birthday} =
    data;
    if (
      (data.username == '' ||
        data.password == '' ||
        data.confirmPassword == '' ||
        data.Name == '' ||
        data.Email == '' ||
        data.Phone == '',
      data.Birthday == '')
    ) {
      Alert.alert('Please fill all the information');
      return;
    }
    if (data.password != data.confirmPassword) {
      Alert.alert('Password not match', 'Please check your password');
      return;
    }

    const url = 'http://127.0.0.1:8000/auth/add_user';
    const header: any = {
      'Content-Type': 'application/json',
      accept: 'application/json',
    };

    const body = {
      user_id: data.username,
      name: data.Name,
      email: data.Email,
      password: data.password,
      phone: data.Phone,
      birthday: data.Birthday,
      activated: true,
    };

    try {
      const response = await axios.post(url, body, header);
      console.log('response', response);
      Alert.alert('Sign Up Success', 'Please login with your account', [
        {
          text: 'OK',
          onPress: () => {
            reset({
              username: '',
              password: '',
              confirmPassword: '',
              Name: '',
              Email: '',
              Phone: '',
              Birthday: '',
            });
            navigator.navigate('Login', {});
          },
        },
      ]);
    } catch (err) {
      console.log('err', err);
      Alert.alert('Sign Up Failed', 'Please check your information');
    }
  };

  return (
    <View style={styles.container}>
      <View></View>
      <ScrollView>
        <View style={styles.image_container}>
          <Image source={IMAGES.PAGE3} style={styles.image_body} />
        </View>
        <Text style={styles.label}>User Name</Text>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
              value={value}
            />
          )}
          name="username"
          rules={{required: true}}
        />
        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
              value={value}
            />
          )}
          name="password"
          rules={{required: true}}
        />
        <Text style={styles.label}>Comfirm Password</Text>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
              value={value}
            />
          )}
          name="confirmPassword"
          rules={{required: true}}
        />
        <Text style={styles.label}>Name</Text>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
              value={value}
            />
          )}
          name="Name"
          rules={{required: true}}
        />
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
              value={value}
            />
          )}
          name="Email"
          rules={{required: true}}
        />

        <Text style={styles.label}>Phone</Text>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
              value={value}
            />
          )}
          name="Phone"
          rules={{required: true}}
        />

        <Text style={styles.label}>{`Birthday (DD/MM)`}</Text>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
              value={value}
            />
          )}
          name="Birthday"
          rules={{required: true}}
        />
      </ScrollView>
      <View style={{height: height * 0.1}}>
        <View style={styles.btn_group}>
          <TouchableOpacity
            style={styles.btn_sign_up}
            onPress={() =>
              reset({
                username: '',
                password: '',
                confirmPassword: '',
                Name: '',
                Email: '',
                Phone: '',
                Birthday: '',
              })
            }>
            <Text style={styles.btn_text}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn_sign_in}
            onPress={handleSubmit(onSubmit)}>
            <Text style={styles.btn_text}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignUp;
