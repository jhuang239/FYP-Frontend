import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import IMAGES from '../images';
import * as React from 'react';
import Carousel from 'react-native-reanimated-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    color: 'white',
    padding: 10,
  },
});

type HomeProps = {
  UpdateUserState(user: any): void;
};

const Home = ({UpdateUserState}: HomeProps) => {
  const data = [
    {
      id: 1,
      title: 'Cheer Up',
      image: IMAGES.PAGE1,
      description: 'Cheer up your day with our new E-Learning application.',
    },
    {
      id: 2,
      title: 'Free Sources',
      image: IMAGES.PAGE2,
      description: 'Get the free sources from our senior schoolmates.',
    },
    {
      id: 2,
      title: 'Track Your Progress',
      image: IMAGES.PAGE3,
      description: 'Learning and test yourself with our E-learning content.',
    },
  ];

  const dummy = [
    {title: 'upcoming function 1', backgroundColor: '#007BA7'},
    {title: 'upcoming function 2', backgroundColor: '#008B8B'},
    {title: 'upcoming function 3', backgroundColor: '#72A0C1'},
    {title: 'upcoming function 4', backgroundColor: '#2072AF'},
  ];

  const Logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      UpdateUserState(null);
    } catch (e) {
      console.log(e);
    }
  };

  const width = Dimensions.get('window').width;
  return (
    <ScrollView>
      <Carousel
        width={width}
        height={300}
        autoPlay={true}
        data={[...data]}
        scrollAnimationDuration={1500}
        snapEnabled={true}
        // onSnapToItem={(index) => console.log("current index:", index)}
        renderItem={({index}) => (
          <View style={styles.container}>
            <Image
              source={data[index].image}
              style={{width: width - 20, height: 250, borderRadius: 10}}
            />
            <Text style={{height: 50, fontSize: 16}}>
              {data[index].description}
            </Text>
          </View>
        )}
      />
      <View style={{alignItems: 'center'}}>
        {dummy.map((item, index) => (
          <TouchableOpacity
            key={'upcoming function ' + index}
            style={{
              backgroundColor: item.backgroundColor,
              height: 80,
              width: width - 20,
              marginVertical: 20,
              flex: 1,
              justifyContent: 'center',
              borderRadius: 10,
            }}>
            <Text style={styles.label}>{item.title}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => Logout()}
          key={'Logout'}
          style={{
            backgroundColor: '#FDBCB4',
            height: 80,
            width: width - 20,
            marginVertical: 20,
            flex: 1,
            justifyContent: 'center',
            borderRadius: 10,
          }}>
          <Text style={styles.label}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Home;
