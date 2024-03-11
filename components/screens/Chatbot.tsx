import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IMAGES from '../images';
import Icon from 'react-native-vector-icons/FontAwesome';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
// const userData = AsyncStorage.getItem("userData").then((value) => {
//     if (value) {
//         return JSON.parse(value);
//     } else {
//         return null;
//     }
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assistant_container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#DBD7D2',
    marginVertical: 10,
    borderRadius: 10,
  },
  user_container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#8C92AC',
    borderRadius: 10,
  },
  icon_container: {
    flexDirection: 'row',
  },
  icon_text: {
    padding: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  chat_room_text: {
    fontSize: 20,
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 0,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    width: width * 0.8,
  },
  send_button: {
    backgroundColor: '#00B9E8',
    padding: 10,
    borderRadius: 10,
    width: width * 0.125,
    alignItems: 'center',
  },
});

const Chatbot = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<any>();
  const [items, setItems] = React.useState<any>([]);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [inputMessage, setInputMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const scrollViewRef = React.useRef<any>(null);
  const [user, setUser] = React.useState<any>({});

  const create_chat = async (chat_name: string) => {
    const userinfo = await AsyncStorage.getItem('userData').then(value => {
      if (value) {
        return JSON.parse(value);
      }
    });
    if (userinfo == null) return;
    const url = 'http://127.0.0.1:8000/add_chat';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userinfo.token}`,
    };

    const currentDate = new Date();
    const formattedDate =
      currentDate.toISOString().slice(0, -1) +
      (currentDate.getTimezoneOffset() > 0 ? '-' : '+') +
      (Math.abs(currentDate.getTimezoneOffset()) / 60)
        .toFixed(2)
        .padStart(5, '0');

    const data = {
      user_id: user.username,
      chat_name: chat_name,
      time: formattedDate,
      message: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
      ],
    };
    try {
      const response = await axios.post(url, data, {headers: headers});
      console.log('response', response.data);
      fetchData().then((data: any) => {
        console.log('chatItems', data.chatItems);
        setItems(data.chatItems);
        setValue(
          data.chatItems.filter((item: any) => item.id == response.data.id)[0]
            .value,
        );
      });
    } catch (err) {
      console.log('err', err);
    }
  };

  const handleChange = async (item: any) => {
    const userinfo = await AsyncStorage.getItem('userData').then(value => {
      if (value) {
        return JSON.parse(value);
      }
    });
    if (userinfo == null) return;
    if (item == 'create') {
      Alert.prompt(
        'Chat Name',
        'Please enter the chat name',
        text => {
          create_chat(text);
        },
        'plain-text',
        '',
        'default',
      );
    } else {
      const url = `http://127.0.0.1:8000/chat/${item}`;
      console.log('url', url);
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userinfo.token}`,
      };
      const response = await axios.get(url, {headers: headers});
      console.log('response123', response.data);
      setMessages(response.data[0].message);
    }
  };

  const sync_chat_history = async (updatedMessage: any) => {
    const userinfo = await AsyncStorage.getItem('userData').then(value => {
      if (value) {
        return JSON.parse(value);
      }
    });
    const id = items.filter((item: any) => item.value == value)[0].id;
    const url = `http://127.0.0.1:8000/chat/${id}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userinfo.token}`,
    };

    const currentDate = new Date();
    const formattedDate =
      currentDate.toISOString().slice(0, -1) +
      (currentDate.getTimezoneOffset() > 0 ? '-' : '+') +
      (Math.abs(currentDate.getTimezoneOffset()) / 60)
        .toFixed(2)
        .padStart(5, '0');

    const data = {
      user_id: user.username,
      chat_name: value,
      time: formattedDate,
      message: updatedMessage,
    };
    console.log('data', data);
    try {
      const response = await axios.put(url, data, {headers: headers});
      console.log('response', response.data);
      setLoading(false);
    } catch (err) {
      console.log('err', err);
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage == '' || loading) return;
    setLoading(true);
    const userinfo = await AsyncStorage.getItem('userData').then(value => {
      if (value) {
        return JSON.parse(value);
      }
    });
    if (userinfo == null) return;
    const url = 'http://127.0.0.1:8000/chatbot';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userinfo.token}`,
    };
    let data = [...messages];
    data.push({
      content: inputMessage,
      role: 'user',
    });

    setMessages([...data]);
    setInputMessage('');
    scrollViewRef.current.scrollToEnd({animated: true});

    console.log('data', data);
    try {
      const response = await axios.post(url, data, {
        headers: headers,
      });
      console.log('response', response.data);
      response.data.choices.map((choice: any) => {
        console.log('choice', choice.message.content);
        data.push({
          content: choice.message.content,
          role: 'assistant',
        });
      });
      console.log('data', data);
      setMessages([...data]);
      scrollViewRef.current.scrollToEnd({animated: true});
      await sync_chat_history(data);
    } catch (err) {
      console.log('err', err);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const userinfo = await AsyncStorage.getItem('userData').then(value => {
      if (value) {
        return JSON.parse(value);
      }
    });
    if (userinfo == null) return;
    const url = `http://127.0.0.1:8000/chat/all/${userinfo.username}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userinfo.token}`,
    };
    console.log('url', url);
    console.log('headers', headers);
    const response = await axios.get(url, {headers: headers});
    console.log('response', response.data);
    let temp = response.data.map((chat: any) => {
      return {label: chat.chat_name, value: chat.chat_name, id: chat.id};
    });
    temp.unshift({label: 'Create New Chat', value: 'create', id: 0});
    console.log('temp', temp);
    return {
      chatItems: temp,
      user: userinfo,
    };
  };

  React.useEffect(() => {
    if (value == '') return;
    handleChange(value);
  }, [value]);

  React.useEffect(() => {
    if (messages.length > 0) console.log('messages', messages);
  }, [messages]);

  React.useEffect(() => {
    // if (userData == null) return;
    // const userinfo = userData["_j"];
    // console.log("userinfo", userinfo);
    fetchData().then((data: any) => {
      setItems(data.chatItems);
      setUser(data.user);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 15,
          height: height * 0.1,
          zIndex: 1000,
        }}>
        {items.length > 0 && (
          <DropDownPicker
            containerStyle={{borderWidth: 0, width: width - 20}}
            style={{height: 60, width: width - 20}}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            // onChangeValue={(value) => {
            //     handleChange(value);
            // }}
            theme="DARK"
            multiple={false}
          />
        )}
      </View>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({animated: true})
        }
        style={{
          zIndex: 0,
          backgroundColor: '#00B9E8',
          width: width - 20,
          borderRadius: 10,
        }}>
        <View style={{padding: 10}}>
          {messages.length > 0 &&
            messages.map((message, index) => {
              if (message.role == 'assistant') {
                return (
                  <View key={index} style={styles.assistant_container}>
                    <View style={styles.icon_container}>
                      <Image
                        source={IMAGES.BOT}
                        style={{width: 50, height: 50}}
                      />
                      <Text style={styles.icon_text}>Assistant</Text>
                    </View>
                    <Text style={styles.chat_room_text}>{message.content}</Text>
                  </View>
                );
              } else if (message.role == 'user') {
                return (
                  <View key={index} style={styles.user_container}>
                    <View style={styles.icon_container}>
                      <Image
                        source={IMAGES.USER}
                        style={{width: 50, height: 50}}
                      />
                      <Text style={styles.icon_text}>{user.username}</Text>
                    </View>
                    <Text style={styles.chat_room_text}>{message.content}</Text>
                  </View>
                );
              }
            })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={text => setInputMessage(text)}
          placeholder="Input your promt here!"
        />
        <TouchableOpacity
          style={styles.send_button}
          onPress={() => handleSendMessage()}>
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Icon name="send" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chatbot;
