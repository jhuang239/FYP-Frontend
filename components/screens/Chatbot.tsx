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
  Platform,
  SafeAreaView,
} from 'react-native';
import * as React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IMAGES from '../images';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {Overlay} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import Markdown from 'react-native-markdown-display';

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
    paddingTop: Platform.OS == 'ios' ? 20 : 0,
    flex: 1,
    backgroundColor: '#ffedd5',
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
    backgroundColor: '#849bbf',
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
    backgroundColor: '#ffedd5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 0,
    borderWidth: 0.5,
    padding: 10,
    borderRadius: 10,
    width: width * 0.8,
    backgroundColor: 'rgba(170, 183, 191, 0.4)',
  },
  send_button: {
    backgroundColor: '#00B9E8',
    padding: 10,
    borderRadius: 10,
    width: width * 0.125,
    alignItems: 'center',
  },
  ItemName: {
    fontSize: 16,
    margin: 5,
  },
  ToolsOverlayItems: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    margin: 20,
    width: width * 0.6,
  },
});

const markDownStyles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
});

const Chatbot = ({UpdateUserState}) => {
  const [mode, setMode] = React.useState(1);

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<any>(null);
  const [items, setItems] = React.useState<any[]>([]);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [chatWithDocMessages, setChatWithDocMessages] = React.useState<any[]>(
    [],
  );
  const [inputMessage, setInputMessage] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const scrollViewRef = React.useRef<any>(null);
  const [user, setUser] = React.useState<any>({});

  const [newChatName, setNewChatName] = React.useState('');
  const [isCreateChatOverlayShow, setIsCreateChatOverlayShow] =
    React.useState(false);

  const create_chat = async (chat_name: string) => {
    const userinfo = await AsyncStorage.getItem('userData').then(value => {
      if (value) {
        return JSON.parse(value);
      }
    });
    if (userinfo == null) return;

    if (mode == 1) {
      const url = 'http://3.26.57.153:8000/chat/add_chat';
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
              .id,
          );
        });
      } catch (err) {
        console.log('err', err);
      }
    } else if (mode == 2) {
      const url = 'http://3.26.57.153:8000/chat_history_doc/add_chat';
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
        chat_name: chat_name,
        time: formattedDate,
        message: [],
      };
      try {
        const response = await axios.post(url, data, {headers: headers});
        console.log('response', response.data);
        fetchChatDocHistory().then((data: any) => {
          console.log('chatItems', data.chatItems);
          setItems(data.chatItems);
          setValue(
            data.chatItems.filter((item: any) => item.id == response.data.id)[0]
              .id,
          );
        });
      } catch (err) {
        console.log('err', err);
      }
    }
  };

  const handleChange = async (item: any) => {
    const userinfo = await AsyncStorage.getItem('userData').then(value => {
      if (value) {
        return JSON.parse(value);
      }
    });
    if (userinfo == null) return;

    if (mode == 1) {
      if (item == 0) {
        if (Platform.OS === 'ios') {
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
          setIsCreateChatOverlayShow(true);
        }
      } else {
        const url = `http://3.26.57.153:8000/chat/get_chat?id=${item}`;
        console.log('url', url);
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userinfo.token}`,
        };
        const response = await axios.get(url, {headers: headers});
        console.log('response123', response.data);
        if (response.data.length == 0) return;
        setMessages(response.data[0].message);
      }
    } else if (mode == 2) {
      if (item == 0) {
        if (Platform.OS === 'ios') {
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
          setIsCreateChatOverlayShow(true);
        }
      } else {
        const url = `http://3.26.57.153:8000/chat_history_doc/get_chat?id=${item}`;
        console.log('url', url);
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userinfo.token}`,
        };
        const response = await axios.get(url, {headers: headers});
        console.log('response123', response.data);
        if (response.data.length == 0) return;
        setChatWithDocMessages(response.data.message);
      }
    }
  };

  const sync_chat_history = async (updatedMessage: any) => {
    const userinfo = await AsyncStorage.getItem('userData').then(value => {
      if (value) {
        return JSON.parse(value);
      }
    });

    if (mode == 1) {
      const item = items.filter((item: any) => item.id == value)[0];
      const url = `http://3.26.57.153:8000/chat/update_chat?id=${item.id}`;
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
        chat_name: item.value,
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
    } else if (mode == 2) {
      const item = items.filter((item: any) => item.id == value)[0];

      const url = `http://3.26.57.153:8000/chat_history_doc/update_chat?id=${item.id}`;
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
        chat_name: item.value,
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

    if (mode == 1) {
      const url = 'http://3.26.57.153:8000/chatbot/chatting';
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
    } else if (mode == 2) {
      const cloneChatWithDocMessages = [...chatWithDocMessages];
      const newChatWithDocMessage = {
        query: inputMessage,
        answer: null,
        source_documents: [],
      };
      const history: any[] = [];

      const url = 'http://3.26.57.153:8000/chatbot/chatwithdoc';
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userinfo.token}`,
      };

      for (var chatWithDocMessage of chatWithDocMessages) {
        history.push({
          question: chatWithDocMessage.query,
          answer: chatWithDocMessage.answer,
        });
      }

      let data = {
        query: inputMessage,
        history: history,
      };

      setChatWithDocMessages([
        ...cloneChatWithDocMessages,
        newChatWithDocMessage,
      ]);

      setInputMessage('');
      scrollViewRef.current.scrollToEnd({animated: true});

      console.log('data', data);
      try {
        const response = await axios.post(url, data, {
          headers: headers,
        });
        console.log('response', response.data);

        console.log('Before: ' + newChatWithDocMessage);
        newChatWithDocMessage.answer = response.data.answer;
        newChatWithDocMessage.source_documents = response.data.source_documents;
        console.log('After: ' + newChatWithDocMessage);

        setChatWithDocMessages([
          ...cloneChatWithDocMessages,
          newChatWithDocMessage,
        ]);
        scrollViewRef.current.scrollToEnd({animated: true});
        await sync_chat_history([
          ...cloneChatWithDocMessages,
          newChatWithDocMessage,
        ]);
      } catch (err) {
        console.log('err', err);
        setLoading(false);
      }
    }
  };

  const fetchData = async () => {
    const userinfo = await AsyncStorage.getItem('userData').then(value => {
      if (value) {
        return JSON.parse(value);
      }
    });
    if (userinfo == null) return;
    const url = `http://3.26.57.153:8000/chat/get_all_chat`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userinfo.token}`,
    };
    console.log('url', url);
    console.log('headers', headers);
    const response = await axios.get(url, {headers: headers});
    console.log('response', response.data);
    let temp: any[] = [];
    if (response.data.error) {
      temp.unshift({label: 'Create New Chat', value: 'create', id: 0});
      temp.unshift({
        id: -1,
        label: '\t-----\tChoose Your Bot\t-----\t',
        value: 'default',
      });
    } else {
      temp = response.data.map((chat: any) => {
        return {label: chat.chat_name, value: chat.chat_name, id: chat.id};
      });
      temp.unshift({label: 'Create New Chat', value: 'create', id: 0});
      temp.unshift({
        id: -1,
        label: '\t-----\tChoose Your Bot\t-----\t',
        value: 'default',
      });
    }
    console.log('temp', temp);

    return {
      chatItems: temp,
      user: userinfo,
    };
  };

  const fetchChatDocHistory = async () => {
    const userinfo = await AsyncStorage.getItem('userData').then(value => {
      if (value) {
        return JSON.parse(value);
      }
    });
    if (userinfo == null) return;

    const url = `http://3.26.57.153:8000/chat_history_doc/chatHistoryDoc`;
    const headers = {
      Authorization: `Bearer ${userinfo.token}`,
    };
    const response = await axios.get(url, {headers: headers});
    let temp = response.data.map((chat: any) => {
      return {label: chat.chat_name, value: chat.chat_name, id: chat.id};
    });
    temp.unshift({label: 'Create New Chat', value: 'create', id: 0});
    temp.unshift({
      id: -1,
      label: '\t-----\tChoose Your Bot\t-----\t',
      value: 'default',
    });
    console.log('temp2', temp);

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
    if (mode == 1) {
      fetchData().then((data: any) => {
        setItems(data.chatItems);
        setUser(data.user);
      });
    } else if (mode == 2) {
      fetchChatDocHistory().then((data: any) => {
        setItems(data.chatItems);
      });
    }
  }, []);

  React.useEffect(() => {
    // Init all state
    setOpen(false);
    setValue(null);
    setItems([]);
    setMessages([]);
    setChatWithDocMessages([]);
    setInputMessage('');
    setNewChatName('');

    // Load data
    if (mode == 1) {
      fetchData().then((data: any) => {
        setItems(data.chatItems);
      });
    } else if (mode == 2) {
      fetchChatDocHistory().then((data: any) => {
        setItems(data.chatItems);
      });
    }
  }, [mode]);

  const normalChat = () => {
    return (
      messages.length > 0 &&
      messages.map((message, index) => {
        if (message.role == 'assistant') {
          return (
            <View key={index} style={styles.assistant_container}>
              <View style={styles.icon_container}>
                <Image source={IMAGES.BOT} style={{width: 50, height: 50}} />
                <Text style={styles.icon_text}>Assistant</Text>
              </View>
              <View>
                <Markdown style={markDownStyles}>{message.content}</Markdown>
              </View>
            </View>
          );
        } else if (message.role == 'user') {
          return (
            <View key={index} style={styles.user_container}>
              <View style={styles.icon_container}>
                <Image source={IMAGES.USER} style={{width: 50, height: 50}} />
                <Text style={styles.icon_text}>{user.username}</Text>
              </View>
              <Text style={styles.chat_room_text}>{message.content}</Text>
            </View>
          );
        }
      })
    );
  };

  const chatDoc = () => {
    return (
      chatWithDocMessages.length > 0 &&
      chatWithDocMessages.map((message, index) => {
        const filterSourceDocuments: string[] = [];
        console.log(message);
        for (var source_document of message.source_documents) {
          const file = source_document.metadata.source.split('_')[1];
          if (filterSourceDocuments.includes(file)) {
            continue;
          } else {
            filterSourceDocuments.push(
              `${file} -- P.${source_document.metadata.page}`,
            );
          }
        }

        return (
          <View>
            {/* // user part */}
            <View style={styles.user_container}>
              <View style={styles.icon_container}>
                <Image source={IMAGES.USER} style={{width: 50, height: 50}} />
                <Text style={styles.icon_text}>{user.username}</Text>
              </View>
              <Text style={styles.chat_room_text}>{message.query}</Text>
            </View>
            {/* // bot part */}
            {message.answer != null ? (
              <View style={styles.assistant_container}>
                <View style={styles.icon_container}>
                  <Image source={IMAGES.BOT} style={{width: 50, height: 50}} />
                  <Text style={styles.icon_text}>Assistant</Text>
                </View>
                <View>
                  <Markdown style={markDownStyles}>{message.answer}</Markdown>
                </View>
                <View>
                  {filterSourceDocuments.length > 0 ? (
                    filterSourceDocuments.map((doc: any) => {
                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                          }}>
                          <AntDesignIcon
                            name="pdffile1"
                            style={{
                              fontSize: 10,
                              color: 'black',
                            }}
                          />
                          <Text>{doc}</Text>
                        </View>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </View>
              </View>
            ) : (
              <></>
            )}
          </View>
        );
      })
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            margin: 10,
            height: height * 0.1,
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 25,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: mode == 1 ? '#8c77ed' : 'lightgray',
          }}
          onPress={() => {
            setMode(1);
          }}>
          <View>
            <MaterialCommunityIcons
              name="robot-happy"
              style={{fontSize: 30, color: 'black'}}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: width * 0.35,
              }}>
              <Text style={{fontSize: 13, fontWeight: 'bold'}}>
                Talk To Chatbot
              </Text>
              <AntDesignIcon
                name="arrowright"
                style={{fontSize: 15, color: 'black'}}
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            margin: 10,
            height: height * 0.1,
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 25,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: mode == 2 ? '#9ef0c3' : 'lightgray',
          }}
          onPress={() => {
            setMode(2);
          }}>
          <View>
            <MaterialIcons
              name="question-answer"
              style={{fontSize: 30, color: 'black'}}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: width * 0.35,
              }}>
              <Text style={{fontSize: 13, fontWeight: 'bold'}}>
                Talk About Doc
              </Text>
              <AntDesignIcon
                name="arrowright"
                style={{fontSize: 15, color: 'black'}}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 15,
          zIndex: 1000,
        }}>
        {items.length > 0 ? (
          Platform.OS == 'ios' ? (
            <></>
          ) : (
            <Picker
              style={{width: width * 0.95}}
              selectedValue={value}
              onValueChange={(itemValue, itemIndex) => {
                setValue(itemValue + '');
              }}>
              {items.map((item, index) => {
                return (
                  <Picker.Item
                    label={item.label}
                    value={item.id}
                    key={index}
                    enabled={index == 0 ? false : true}
                  />
                );
              })}
            </Picker>
          )
        ) : (
          <></>
        )}
      </View>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({animated: true})
        }
        style={{
          zIndex: 0,
          borderColor: 'black',
          borderWidth: 0.5,
          backgroundColor: 'rgba(170, 183, 191, 0.4)',
          width: width - 20,
          borderRadius: 10,
        }}>
        <View style={{padding: 10}}>
          {mode == 1 ? normalChat() : chatDoc()}
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
          disabled={loading || value == null}
          style={styles.send_button}
          onPress={() => handleSendMessage()}>
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <MaterialCommunityIcons
              name="account-question"
              size={20}
              color="white"
            />
          )}
        </TouchableOpacity>
      </View>
      {/* Overlay area */}
      <Overlay
        isVisible={isCreateChatOverlayShow}
        onBackdropPress={() => {
          setIsCreateChatOverlayShow(false);
        }}>
        <Text style={styles.ItemName}>Create Chat</Text>
        <SafeAreaView style={styles.ToolsOverlayItems}>
          <Text style={{margin: 10}}>Please enter the chat name</Text>
          <TextInput
            onChangeText={setNewChatName}
            value={newChatName}
            placeholder="Chat Name"
            style={{
              padding: 10,
              borderWidth: 1,
              borderRadius: 5,
              width: '100%',
            }}
          />
        </SafeAreaView>
        <SafeAreaView
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{margin: 2, padding: 10, borderRadius: 15}}
            onPress={() => {
              setIsCreateChatOverlayShow(false);
              setNewChatName('');
            }}>
            <Text style={{color: 'black', fontWeight: 'bold'}}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              margin: 2,
              padding: 10,
              borderRadius: 15,
              backgroundColor: 'green',
            }}
            onPress={() => {
              create_chat(newChatName);
              setIsCreateChatOverlayShow(false);
            }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Create</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Overlay>
    </View>
  );
};

export default Chatbot;
