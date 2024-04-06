import * as React from 'react';
import IMAGES from '../images';
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';


import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Platform,
} from 'react-native';
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isCancel,
  isInProgress,
  types,
} from 'react-native-document-picker';
import { Overlay } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const UploadFile = (props) => {
  const [locationStack, setLocationStack] = React.useState<string[]>([]);

  const [results, setResult] = React.useState<
    Array<DocumentPickerResponse>
  >([]);
  const [directoryList, setDirectoryList] = React.useState([{ id: 0, name: "root" }]);

  const [selectedDocIndex, setSelectedDocIndex] = React.useState(0);

  const [message, setMessage] = React.useState("");
  const [isMessageModalVisible, setIsMessageModalVisible] = React.useState(false);


  const [targetLocation, setTargetLocation] = React.useState(directoryList[directoryList.length - 1].name);
  const [isChooseDirectoryOverlayShow, setIsChooseDirectoryOverlayShow] = React.useState(false);



  React.useEffect(() => {
    console.log(JSON.stringify(results));
    if (results.length > 0) {
      for (var result of results) {
        RNFS.readFile(result.fileCopyUri, 'base64')
      }
    }
  }, [results]);

  const handleError = (err: unknown) => {
    setIsMessageModalVisible(true);
    if (isCancel(err)) {
      setMessage('User cancelled the picker');
      console.warn('User cancelled the picker');
    } else if (isInProgress(err)) {
      setMessage('Picker is still in progress');
      console.warn('Picker is still in progress');
    } else {
      setMessage(String(err));
      throw err;
    }
  };

  const handleCross = () => {
    setResult([]);
    setSelectedDocIndex(0)
  };

  const handleTick = async () => {
    setIsChooseDirectoryOverlayShow(true);
  }

  const pushStack = async () => {
    const result = await getDirectory(targetLocation)
    if (result) {
      const newLocationStack = [...locationStack, targetLocation]
      setLocationStack(newLocationStack)
    }
  }

  const popStack = async () => {
    const newLocationStack = locationStack.slice(0, -1);
    if (newLocationStack.length > 0) {
      await getDirectory(locationStack[locationStack.length - 1]);
      setLocationStack(newLocationStack)
    } else {
      setDirectoryList([{ id: 0, name: "root" }])
      setTargetLocation("root")
      setLocationStack([])
    }
  }

  const initDirectorySelect = () => {
    setDirectoryList([{ id: 0, name: "root" }])
    setTargetLocation("root")
    setLocationStack([])
  }

  const getDirectory = async (location: string) => {
    try {
      const userinfo = await AsyncStorage.getItem('userData').then(value => {
        if (value) {
          return JSON.parse(value);
        }
      });
      if (userinfo == null) return;
      const response = await fetch(`http://3.26.57.153:8000/file/getFolders?parent_id=${location}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userinfo.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.folders.length > 0) {
          setDirectoryList(data.folders);
          setTargetLocation(data.folders[0].id)
          return true
        } else {
          return false
        }
      } else {
        // Error occurred while uploading file
        setMessage("Error folder creation:" + response.status);
      }
    } catch (e) {
      console.log(e)
    }
  }

  const uploadFile = async () => {
    const formData = new FormData();
    if (results.length > 0) {
      for (var result of results) {
        formData.append("files", result, result.name);
      }

      try {
        const userinfo = await AsyncStorage.getItem('userData').then(value => {
          if (value) {
            return JSON.parse(value);
          }
        });
        if (userinfo == null) return;
        console.log("targetLocation in uplaod: " + targetLocation)
        const response = await fetch(`http://3.26.57.153:8000/file/upload?parent_id=${targetLocation}`, {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userinfo.token}`,
          },
        });
        // Handle response
        if (response.ok) {
          const data = await response.json()
          console.log(data)
          // File uploaded successfully
          setMessage("File uploaded successfully");
          setResult([]);
          setSelectedDocIndex(0)
        } else {
          // Error occurred while uploading file
          setMessage("Error uploading PDF file:" + response.status);
        }
      } catch (error) {
        setMessage("Error uploading PDF file:" + error);
      } finally {
        setIsChooseDirectoryOverlayShow(false);
        setIsMessageModalVisible(true);
        initDirectorySelect();
      }
    }
  }


  return (
    <View>
      <View>
        {results.length > 0 ? (
          <View style={styles.topbar}>
            <View style={styles.picker}>
              <Picker
                style={{ width: width * 0.5 }}
                selectedValue={selectedDocIndex}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedDocIndex(itemIndex)
                }>
                {
                  results.map((item, index) => {
                    return (
                      <Picker.Item label={item.name} value={item.name} key={index} />
                    )
                  })
                }
              </Picker>
            </View>
            <View style={styles.decision}>
              <TouchableOpacity
                onPress={() => handleTick()}>
                <Text style={styles.tick}>✓</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCross()}>
                <Text style={styles.cross}>✖</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View></View>
        )}
      </View>
      <View style={results.length > 0 ? { ...styles.container, height: Platform.OS == "ios" ? height * 0.85 : height * 0.9 } : styles.container}>
        {results.length > 0 ? (
          <Pdf
            enablePaging={true}
            trustAllCerts={false}
            source={{
              uri: results[selectedDocIndex].fileCopyUri,
              cache: true,
            }}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            onError={error => {
              console.log(error);
            }}
            onPressLink={uri => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdfCard}
          />
        ) : (
          <View style={styles.card}>
            <IoniconsIcon name="cloud-upload" style={styles.uploadIcon} />
            <Text style={styles.title}>DRAG FILES HERE</Text>
            <Text style={styles.subtitle}>
              Drag and drop files here {'\n'} or browse your phone
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                DocumentPicker.pick({
                  allowMultiSelection: true,
                  type: [DocumentPicker.types.pdf],
                  copyTo: 'cachesDirectory',
                })
                  .then(setResult)
                  .catch(handleError);
              }}>
              <Text style={styles.buttonText}>BROWSE FILES</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Here is the overlay */}
      <Overlay
        isVisible={isChooseDirectoryOverlayShow}
        onBackdropPress={() => { setIsChooseDirectoryOverlayShow(false) }}
      >
        <Text style={styles.ItemName}>Choose Your Directory</Text>
        <SafeAreaView style={styles.ToolsOverlayItems}>
          <Picker
            style={{ width: "100%" }}
            selectedValue={targetLocation}
            onValueChange={(itemValue, itemIndex) =>
              setTargetLocation(itemValue)
            }>
            {
              directoryList.map((item, index) => {
                return (
                  <Picker.Item label={item.name} value={item.id} key={index} />
                )
              })
            }
          </Picker>
          <SafeAreaView style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: "center", }}>
            <TouchableOpacity style={{ margin: 2, padding: 10, borderWidth: 1, borderRadius: 5 }} onPress={() => { popStack() }}>
              <Text>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ margin: 2, padding: 10, borderWidth: 1, borderRadius: 5 }} onPress={async () => {
              await pushStack()
            }}>
              <Text>Next</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
        <SafeAreaView style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: "center", }}>
          <TouchableOpacity style={{ margin: 2, padding: 10, borderWidth: 1, borderRadius: 5 }} onPress={() => {
            setIsChooseDirectoryOverlayShow(false);
            initDirectorySelect();
          }}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ margin: 2, padding: 10, borderWidth: 1, borderRadius: 5 }} onPress={() => {
            uploadFile()
          }}>
            <Text>Confirm</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Overlay>

      {/* Here is the modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isMessageModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setIsMessageModalVisible(false)}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS == "ios" ? 20 : 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffedd5',
    width: width,
    height: height
  },
  backButton: {
    marginLeft: 10,
    fontSize: 30,
    color: "black",
  },
  topbar: {
    paddingTop: Platform.OS == "ios" ? 20 : 0,
    flexDirection: "row",
    alignItems: "center",
    width: width,
    backgroundColor: "#ffedd5",
  },
  topBarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: "black",
    marginLeft: 15,
  },
  picker: {
    marginLeft: 20,
    alignItems: "center",
    justifyContent: 'flex-start',
  },
  decision: {
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'flex-end',
    flex: 1,
  },
  tick: {
    margin: 10,
    fontSize: 30,
    color: "green",
  },
  cross: {
    margin: 10,
    fontSize: 30,
    color: "red",
  },
  card: {
    margin: 30,
    marginTop: 0,
    marginBottom: 40,
    backgroundColor: 'rgba(170, 183, 191, 0.4)',
    borderWidth: 3,
    borderColor: 'gray',
    borderRadius: 10,
    borderStyle: 'dotted',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.9,
    height: Platform.OS == "ios" ? height * 0.85 : height * 0.9,
  },
  pdfCard: {
    backgroundColor: "gray",
    borderWidth: 3,
    borderColor: 'gray',
    borderRadius: 10,
    borderStyle: 'dotted',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.9,
    height: height * 0.8,
  },
  button: {
    margin: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#21201d',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  uploadIcon: {
    marginBottom: 30,
    fontSize: 120,
    color: '#0290bf',
  },
  title: {
    margin: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    margin: 10,
    fontSize: 20,
  },
  modalContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 25,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#21201d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ToolsOverlayItems: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    margin: 20,
    width: width * 0.5,
  },
  ItemName: {
    fontSize: 16,
    margin: 5,
  },
});

export default UploadFile;
